"use server";

import { ObjectId, startSession } from "mongoose";
import Category from "../models/category.model";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { CategoriesParams, CategoryType, FetchedCategory, ProductType } from "../types/types";
import clearCache from "./cache";
import { clearCatalogCache } from "./redis/catalog.actions";
import { deleteManyProducts, deleteProduct } from "./product.actions";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import Filter from "../models/filter.model";
import mongoose from "mongoose";

export async function createUrlCategories({ categories }: { categories: FetchedCategory[] }): Promise<CategoryType[]>;
export async function createUrlCategories({ categories }: { categories: FetchedCategory[] }, type: 'json'): Promise<string>;

export async function createUrlCategories({ categories }: { categories: FetchedCategory[] }, type?: 'json') {
   try {
      
    const sortedCategories = [...categories].sort((a, b) => {
        if (a.parentCategoryId && !b.parentCategoryId) return 1;
        if (!a.parentCategoryId && b.parentCategoryId) return -1;
        return 0;
    });

    console.log(sortedCategories)
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();

    for (const category of sortedCategories) {
        // Check if the category already exists
        const existingCategory = await Category.findOne({ id: category.id });

        if (existingCategory) {
            // If category already exists, update the category map
            categoryMap.set(category.id, existingCategory._id);
            continue;
        }

        // If the category doesn't exist, create it
        const newCategory = new Category({
            name: category.name,
            id: category.id,
            subCategories: [],
        });

        if (category.parentCategoryId) {
            const parentCategoryId = categoryMap.get(category.parentCategoryId);

            if (parentCategoryId) {
                await Category.findByIdAndUpdate(parentCategoryId, {
                    $push: { subCategories: newCategory._id }
                });
            }
        }

        await newCategory.save();
        categoryMap.set(category.id, newCategory._id);
    }

    const updatedCategories =  await Category.find();

    if(type === 'json'){
      return JSON.stringify(updatedCategories)
    } else {
      return updatedCategories
    }
   } catch (error: any) {
     throw new Error(`Erorr creating and ${error.message}`)
   }
}

export async function updateCategories(
  products: ProductType[],
  productOperation: "create" | "update" | "delete"
) {
  try {
    connectToDB();

    // Fetch all existing categories only when necessary
    const existingCategories = await Category.find();
    const categoryMap = new Map(
      existingCategories.map((cat) => [cat._id.toString(), cat])
    );

    // To track changes for recalculation
    const categoriesToUpdate: Record<
      string,
      { productIds: string[]; totalValue: number }
    > = {};

    const calculateTotalValue = async (categoryId: string): Promise<number> => {
      const category = await Category.findById(categoryId).populate("subCategories");
      if (!category) return 0;

      let totalValue = category.totalValue || 0;

      for (const subCategory of category.subCategories) {
        const subCategoryValue = await calculateTotalValue(subCategory._id.toString());
        totalValue += subCategoryValue;
      }

      return totalValue;
    };

    for (const product of products) {
      const newCategoryIds = product.category; // Updated category IDs

      if (productOperation === "create") {
        for (const categoryId of newCategoryIds) {
          if (!categoriesToUpdate[categoryId]) {
            const existingCategory = categoryMap.get(categoryId);
            categoriesToUpdate[categoryId] = {
              productIds: existingCategory ? [...existingCategory.products] : [],
              totalValue: existingCategory ? await calculateTotalValue(categoryId) : 0,
            };
          }

          const newCategory = categoriesToUpdate[categoryId];
          if (!newCategory.productIds.includes(product._id)) {
            newCategory.productIds.push(product._id);
            newCategory.totalValue += product.priceToShow || 0;
          }
        }
        continue;
      }

      for (const [categoryId, category] of categoryMap.entries()) {
        if (category.products.includes(product._id)) {
          if (!newCategoryIds.includes(categoryId) || productOperation === "delete") {
            category.products = category.products.filter(
              (id: string) => id.toString() !== product._id.toString()
            );

            const remainingProducts = await Product.find({
              _id: { $in: category.products },
            });

            category.totalValue = remainingProducts.reduce(
              (sum, prod) => sum + (prod.priceToShow || 0),
              0
            );

            categoriesToUpdate[categoryId] = {
              productIds: category.products,
              totalValue: category.totalValue,
            };
          }
        }
      }

      if (productOperation === "update") {
        for (const categoryId of newCategoryIds) {
          if (!categoriesToUpdate[categoryId]) {
            const existingCategory = categoryMap.get(categoryId);
            categoriesToUpdate[categoryId] = {
              productIds: existingCategory ? [...existingCategory.products] : [],
              totalValue: existingCategory ? existingCategory.totalValue : 0,
            };
          }

          const newCategory = categoriesToUpdate[categoryId];
          if (!newCategory.productIds.includes(product._id)) {
            newCategory.productIds.push(product._id);

            const categoryProducts = await Product.find({
              _id: { $in: newCategory.productIds },
            });
            newCategory.totalValue = categoryProducts.reduce(
              (sum, prod) => sum + (prod.priceToShow || 0),
              0
            );
          }
        }
      }
    }

    for (const categoryId in categoriesToUpdate) {
      const category = categoriesToUpdate[categoryId];
      category.productIds = Array.from(new Set(category.productIds.map((id) => id.toString())));
    }

    const categoryOps = Object.entries(categoriesToUpdate).map(
      async ([categoryId, { productIds, totalValue }]) => {
        if (categoryMap.has(categoryId)) {
          await Category.updateOne(
            { _id: categoryId },
            { products: productIds, totalValue }
          );
        }
      }
    );

    await Promise.all(categoryOps);

    clearCatalogCache();
    clearCache(["updateCategory", "updateProduct"], undefined);
  } catch (error: any) {
    throw new Error(
      `Error updating categories with products: ${error.message}`
    );
  }
}


export async function fetchAllCategories(): Promise<CategoryType[]>;
export async function fetchAllCategories(type: 'json'): Promise<string>;

export async function fetchAllCategories(type?: 'json') {
   try {
      
    connectToDB();

    const allCategories = await Category.find();

    if(type === 'json'){
      return JSON.stringify(allCategories)
    } else {
      return allCategories
    }
   } catch (error: any) {
     throw new Error(`${error.message}`)
   }
}

export async function fetchCategoriesProperties() {
  try {
    connectToDB();

    const categories = await Category.find()
      .populate("products")

    const categoriesList = categories.map((category) => {
      const totalProducts = category.products.length;
      const totalValue = category.totalValue || 0; // Use the existing `totalValue` field
      const averageProductPrice =
        totalProducts > 0 ? parseFloat((totalValue / totalProducts).toFixed(2)) : 0;

      return {
        category: {name: category.name, _id: category._id.toString()},
        values: {
          totalProducts,
          totalValue,
          averageProductPrice,
          stringifiedProducts: JSON.stringify(category.products),
        },
      };
    });

    return categoriesList;
  } catch (error: any) {
    throw new Error(`Error fetching categories properties: ${error.message}`);
  }
}

export async function fetchCategory({ categoryId }: { categoryId: string }) {
  try {
    connectToDB();

    // Fetch the category by its ID and populate its products
    const categoryData = await Category.findById(categoryId).populate("products");

    if (!categoryData) {
      throw new Error("Category not found");
    }

    const products = categoryData.products;
    const category = {
      _id: categoryData._id,
      categoryName: categoryData.name,
      totalProducts: 0,
      totalValue: 0,
      averageProductPrice: 0,
      averageDiscountPercentage: 0,
    };

    let totalPriceWithoutDiscount = 0;

    for (const product of products) {
      category.totalProducts += 1;
      category.totalValue += product.priceToShow;
      totalPriceWithoutDiscount += product.price;
    }

    category.averageProductPrice =
      category.totalProducts !== 0 ? category.totalValue / category.totalProducts : 0;

    category.averageDiscountPercentage = 100 - parseInt(
      (
        (totalPriceWithoutDiscount !== 0
          ? category.totalValue / totalPriceWithoutDiscount
          : 0) * 100
      ).toFixed(0)
    );

    return { ...category, stringifiedProducts: JSON.stringify(products) };
  } catch (error: any) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
}

export async function setCategoryDiscount({categoryId, percentage}: {categoryId: string, percentage: number}) {
  try {
    connectToDB();

    // Fetch the category by its ID and populate its products

    console.log(percentage)
    const category = await Category.findById(categoryId).populate("products");

    if (!category) {
      throw new Error("Category not found");
    }

    const products = category.products;
    let totalValue = 0;
    for (const product of products) {
      const priceWithDiscount = product.price - product.price * (percentage / 100);
      product.priceToShow = priceWithDiscount;

      totalValue += priceWithDiscount
      await product.save();
    }

    category.totalValue = totalValue;

    await category.save();
    // Clear the cache after updating product prices
    await clearCatalogCache();
    clearCache(["updateCategory", "updateProduct"], undefined);

  } catch (error: any) {
    throw new Error(`Error changing discount for all the products in the category: ${error.message}`);
  }
}

export async function changeCategoryName({ categoryId, newName }: { categoryId: string, newName: string }) {
  try {
    connectToDB();

    // Find the category by its _id
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    // Update the category name
    category.name = newName;
    await category.save();

    // Update the category name in all associated products
    await clearCatalogCache();

    clearCache(["updateCategory","updateProduct"], undefined);
  } catch (error: any) {
    throw new Error(`Error changing category's name: ${error.message}`);
  }
}

export async function moveProductsToCategory({
  initialCategoryId,
  targetCategoryId,
  productIds,
}: {
  initialCategoryId: string;
  targetCategoryId: string;
  productIds: string[];
}) {
  try {
    connectToDB();

    const initialCategory = await Category.findById(initialCategoryId).populate("products");
    if (!initialCategory) {
      throw new Error(`Initial category with ID ${initialCategoryId} not found`);
    }

    const targetCategory = await Category.findById(targetCategoryId);
    if (!targetCategory) {
      throw new Error(`Target category with ID ${targetCategoryId} not found`);
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $addToSet: { category: targetCategory._id } }
    );

    targetCategory.products.push(...productIds);

    await targetCategory.save();

    const populatedTargetCategory = await Category.findById(targetCategoryId).populate("products");

    populatedTargetCategory.totalValue = populatedTargetCategory.products.reduce((sum: number, product: ProductType) => sum + product.priceToShow, 0)

    await populatedTargetCategory.save();
    
    initialCategory.products = initialCategory.products.filter(
      (product: ProductType) => !productIds.includes(product._id.toString())
    );

    initialCategory.totalValue = initialCategory.products.reduce((sum: number, product: ProductType) => sum + (product.priceToShow || 0), 0)

    await initialCategory.save();

    await targetCategory.save();

    await clearCatalogCache();
    clearCache(["updateCategory", "updateProduct"], undefined);
    revalidatePath(`/admin/categories/edit/${initialCategoryId}`)
  } catch (error: any) {
    throw new Error(`Error moving products to another category: ${error.message}`);
  }
}

export async function getCategoriesNamesAndIds(): Promise<{ name: string; categoryId: string; }[]> {
  try {
    connectToDB();

    const categories = await Category.find();

    const categoriesNamesAndIdsArray = categories.map(category => ({ name: category.name, categoryId: category._id.toString()}))

    return categoriesNamesAndIdsArray
  } catch (error: any) {
    throw new Error(`Error fetching all categories names an _ids: ${error.message}`)
  }
}

export async function getCategoriesNamesIdsTotalProducts(): Promise<{ name: string; categoryId: string; totalProducts: number, subCategories: string[] }[]> {
  try {
    connectToDB();

    const categories = await Category.find();

    const categoriesNamesAndIdsArray = categories.map(category => ({ name: category.name, categoryId: category._id.toString(), totalProducts: category.products.length, subCategories: category.subCategories }))

    return categoriesNamesAndIdsArray
  } catch (error: any) {
    throw new Error(`Error fetching all categories names an _ids: ${error.message}`)
  }
}

export async function createNewCategory({ name, products, previousCategoryId }: { name: string, products: ProductType[], previousCategoryId?: string }) {
  try {
    connectToDB();

    const productIds = products.map(product => product._id);

    if(previousCategoryId) {
      const previousCategory = await Category.findById(previousCategoryId).populate("products");

      previousCategory.products = previousCategory.products.filter(
        (product: ProductType) => !productIds.includes(product._id.toString())
      );

      previousCategory.totalValue = previousCategory.products.reduce((sum: number, product: ProductType) => sum + product.priceToShow, 0)
      
      await previousCategory.save();

      revalidatePath(`/admin/categories/edit/${previousCategoryId}`)
    }

    const totalValue = products.reduce((sum, product) => sum + (product.priceToShow || 0), 0);

    const createdCategory = await Category.create({
      name,
      totalValue,
      products: productIds
    })

    clearCatalogCache();
    clearCache(["createCategory", "updateProduct"], undefined);

    return createdCategory
  } catch (error: any) {
    throw new Error(`Error creating new category: ${error.message}`)
  }
}

type DeleteCategoryProps = {
  categoryId: string;
  removeProducts: boolean;
};

export async function deleteCategory(props: DeleteCategoryProps) {
  const session = await startSession();
  session.startTransaction();

  try {
    await connectToDB();

    const category = await Category.findById(props.categoryId).populate("products").session(session);

    if (!category) {
      throw new Error("Category not found.");
    }

    const productIds: string[] = category.products.map((product: any) => product._id.toString());

    if (props.removeProducts) {
      // Delete products
      await deleteManyProducts(productIds, "keep-catalog-cache");

      // Remove products from other categories
      await Category.updateMany(
        { _id: { $in: category.products.map((p: { category: string[] }) => p.category).flat() } },
        { $pull: { products: { $in: productIds } } },
        { session }
      );
    } else {
      // Remove category reference from products
      await Product.updateMany(
        { category: { $in: category._id } },
        { $pull: { category: category._id } },
        { session }
      );
    }

    // Exclude category from filter
    await Filter.updateOne(
      { "categories.categoryId": props.categoryId },
      { $pull: { categories: { categoryId: props.categoryId } } },
      { session }
    );

    // Delete the category
    await Category.deleteOne({ _id: category._id }, { session });

    await session.commitTransaction();

    await clearCatalogCache();
    clearCache(["deleteCategory", "updateProduct"], undefined);

  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(`Error deleting category: ${error.message}`);
  } finally {
    session.endSession();
  }
}


export async function fetchCategoriesProducts(categoryId: string, type?: 'json') {
  try {
    // Connect to the database
    await connectToDB();

    // Find the category by _id
    const category = await Category.findById(categoryId).populate('products');

    if (!category) {
      throw new Error('Category not found');
    }

    const products = category.products;

    // Return the products in the specified format
    if (type === 'json') {
      return JSON.stringify(products);
    } else {
      return products;
    }
  } catch (error: any) {
    throw new Error(`Error fetching category products: ${error.message}`);
  }
}


export async function fetchCategoriesParams(): Promise<CategoriesParams>;
export async function fetchCategoriesParams(type: 'json'): Promise<string>;

export async function fetchCategoriesParams(type?: 'json') {
  try {
      await connectToDB();
      
      const categories = await Category.find().populate("products");
      
      const result = categories.reduce((acc, category) => {
          const totalProducts = category.products.length;
          const paramCounts: Record<string, number> = {};
          
          category.products.forEach((product: ProductType) => {
              product.params.forEach(param => {
                  const key = param.name;
                  if (!paramCounts[key]) {
                      paramCounts[key] = 0;
                  }
                  paramCounts[key] += 1;
              });
          });
          
          acc[category._id] = {
              name: category.name,
              totalProducts,
              params: Object.entries(paramCounts).map(([name, totalProducts]) => ({ name, totalProducts, type: ""}))
          };
          
          return acc;
      }, {});

      return type === 'json' ? JSON.stringify(result) : result;
  } catch (error: any) {
      throw new Error(`Error fetching categories params: ${error.message}`);
  }
}

export async function updateSubcategories({ categories }: { categories: CategoryType[] }) {
  try {
    await connectToDB();

      for (const category of categories) {
        await Category.updateOne(
          { _id: category._id },
          { $set: { subCategories: category.subCategories } }
        )
      }
    
    await clearCatalogCache();
    await clearCache("updateCategory", undefined)
  } catch (error: any) {
    throw new Error(`Error updating subcategories: ${error.message}`)
  }
}