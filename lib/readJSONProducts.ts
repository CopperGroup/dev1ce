"use server"

import mongoose from "mongoose"; // Import mongoose if not already global
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchUrlProducts, updateUrlProductsMany, createUrlProductsMany } from "./actions/product.actions"; // Assumed updateUrlProductsMany exists
import { clearCatalogCache } from "./actions/redis/catalog.actions"; // Assuming clearCache exists
import { createUrlCategories, updateCategories } from "./actions/categories.actions"; // Import category actions
import { ProductType } from "./types/types"; // Base types
import * as fs from 'fs';
import * as path from 'path';
import { connectToDB } from "./mongoose"; // Assuming you have a db connection utility

// Interface for product data read from the file
interface ProductFromFile {
    id: string | null;
    name: string | null;
    images: (string | null)[];
    isAvailable: boolean;
    quantity: number;
    url: string | null;
    priceToShow: number;
    price: number;
    category: string | null; // Category name as string from JSON
    vendor: string | null;
    description: string | null;
    articleNumber: string | null;
    params: {
        name: string | null;
        value: string | null;
    }[];
    // Fields below are added/used during processing or come from DB
    _id?: string | mongoose.Types.ObjectId; // MongoDB ObjectId for existing products
    isFetched?: boolean;
    // reviews?: any[]; // Add other fields if necessary based on ProductType or DB schema
}

// Interface matching the expected input for createUrlCategories
// Assuming 'id' in FetchedCategory corresponds to the category name string from the JSON for lookup purposes
interface FetchedCategory {
    id: string; // Using category name from JSON as the unique ID here
    name: string;
    parentCategoryId?: string | null; // Optional: Add if your JSON/logic supports hierarchy
    _id?: mongoose.Types.ObjectId; // Added to hold the DB ID after creation/fetch
}

// Define the path to your JSON file
const productsFilePath = "C:\\Users\\Користувач\\Desktop\\webdev\\dev1ce\\lib\\products.json"; // Adjust path if needed

export async function proceedDataToDB() {
    try {
        await connectToDB(); // Ensure DB connection

        // --- 1. Read and parse the JSON file ---
        const fileContent = fs.readFileSync(productsFilePath, 'utf-8');
        const productsFromFile: ProductFromFile[] = JSON.parse(fileContent);
        console.log(`Read ${productsFromFile.length} products from ${productsFilePath}`);

        // --- 2. Identify unique category names ---
        const uniqueCategoryNames = new Set<string>();
        productsFromFile.forEach(product => {
            if (product.category) {
                uniqueCategoryNames.add(product.category);
            }
        });

        // --- 3. Ensure Categories Exist & Get DB IDs ---
        const categoriesToFetch: FetchedCategory[] = Array.from(uniqueCategoryNames).map(name => ({
            // Using the name as the 'id' for createUrlCategories logic, assuming it checks/creates based on this unique identifier
            id: name,
            name: name,
        }));

        console.log(`Found ${categoriesToFetch.length} unique category names. Ensuring they exist in DB...`);
        const createdOrFetchedCategoriesString = await createUrlCategories({ categories: categoriesToFetch }, 'json');
        const dbCategories: (FetchedCategory & { _id: mongoose.Types.ObjectId })[] = JSON.parse(createdOrFetchedCategoriesString);

        // Create a map from category name (used as ID) to MongoDB ObjectId
        const categoryNameToDbIdMap = new Map<string, mongoose.Types.ObjectId>();
        dbCategories.forEach(cat => {
            // Use cat.id if createUrlCategories consistently uses the input 'id' field for matching/creation reference
            // Or use cat.name if that's the reliable unique field returned matching the input name
             categoryNameToDbIdMap.set(cat.id, cat._id); // Assuming cat.id is the original name passed in
           // categoryNameToDbIdMap.set(cat.name, cat._id); // Alternative if name is the key
        });
        console.log(`Category mapping created. ${categoryNameToDbIdMap.size} categories mapped.`);


        // --- 4. Fetch existing products from the database ---
        const stringifiedUrlProducts = await fetchUrlProducts("json"); // Assuming this fetches products compatible with ProductFromFile structure + _id
        let urlProducts: ProductFromFile[] = JSON.parse(stringifiedUrlProducts as string);
        console.log(`Fetched ${urlProducts.length} existing products from DB.`);

        // --- 5. Process Products: Prepare for Update/Create ---
        const productsToUpdate: any[] = []; // Use 'any' or a more specific type if needed for update action
        const newProducts: any[] = []; // Use 'any' or a specific type for create action (CreateUrlParams?)

        for (const product of productsFromFile) {
            // Find the corresponding category DB ID
            const categoryDbId = product.category ? categoryNameToDbIdMap.get(product.category) : undefined;

            console.log(categoryDbId, categoryNameToDbIdMap.get(product.category))
            const categoryFieldForDb = categoryDbId ? [categoryDbId] : []; // Product schema expects an array of ObjectIds
            console.log(categoryFieldForDb)
            // Prepare the core product data, mapping fields as needed
            const productDataPayload = {
                 ...product, // Spread fields from file
                 id: product.id || product.articleNumber, // Ensure 'id' field required by schema is present
                 category: categoryFieldForDb,
                 // Ensure required fields like 'name' have fallbacks if needed
                 name: product.name || 'Unnamed Product',
                 // Remove fields not in Product schema if necessary, e.g., if 'isFetched' isn't in DB schema
            };
            // delete productDataPayload.isFetched; // Example: remove field not in DB schema

            // Find if a product with the same articleNumber exists in the DB
            const existingProduct = urlProducts.find(urlProduct => urlProduct.articleNumber && urlProduct.articleNumber === product.articleNumber);

            if (existingProduct && existingProduct._id) {
                // Product exists, prepare for update
                productsToUpdate.push({
                    ...productDataPayload,
                    _id: existingProduct._id, // Use the existing DB _id
                });
            } else {
                 // Product does not exist, prepare for creation
                // Remove _id if it accidentally exists on the payload
                 const { _id, ...newProductData } = productDataPayload;
                 newProducts.push(newProductData);
            }
        }

        // --- 6. Bulk Operations ---
        if (productsToUpdate.length > 0) {
            console.log(`Updating ${productsToUpdate.length} products...`);
            // Assuming updateUrlProductsMany takes the product data including _id
            await updateUrlProductsMany(productsToUpdate);
            console.log("Products updated successfully.");
            // Consider if explicit call to updateCategories is needed for updated products
            await updateCategories(productsToUpdate, "update"); // Maybe needed if updateUrlProductsMany doesn't handle it
        } else {
            console.log("No products to update.");
        }

        if (newProducts.length > 0) {
            console.log(`Creating ${newProducts.length} new products...`);
            // createUrlProductsMany expects CreateUrlParams[] and internally calls updateCategories
            await createUrlProductsMany(newProducts);
            console.log("New products created successfully.");
        } else {
            console.log("No new products to create.");
        }

        // --- 7. Clear Cache ---
        console.log("Clearing relevant caches...");
        await clearCatalogCache(); // Specific catalog cache
        // clearCache might be called within actions, but call again if needed
        // clearCache(["updateCategory", "updateProduct", "createProduct"], undefined);
        console.log("Caches cleared.");

        console.log("Data processing complete.");
        return null; // Indicate success

    } catch (error: any) {
        console.error("Error processing product data from file:", error);
         if (error instanceof SyntaxError) {
             throw new Error(`Error parsing JSON file at ${productsFilePath}: ${error.message}`);
        } else if (error.code === 'ENOENT') {
             throw new Error(`Error: Product file not found at ${productsFilePath}`);
        } else {
             // Log the specific Mongoose/DB error if available
             console.error("Underlying error details:", error);
             throw new Error(`Error proceeding products to DB: ${error.message}`);
        }
    }
}