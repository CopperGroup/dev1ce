import * as babelParser from '@babel/parser';
import * as babelTypes from '@babel/types';
import generate from '@babel/generator';

// --- Type Definitions ---

interface StyleObject {
    [key: string]: string | number;
}

interface ComponentInfo {
    isComponent: boolean;
    packageName: string;
    importName: string;
    importType: 'default' | 'named' | 'unknown';
    specificTag?: string;
}

interface ComponentConfig {
    [tagName: string]: ComponentInfo;
}

// Represents the static structure of a .map call
interface MapExpressionNode {
    type: 'map';
    arraySource: string; // Source code of the array variable/expression
    callbackSource: string; // Source code of the map callback function
    parent: string | null;
}

// Represents a JSX element node in the output
interface JSXObject {
    id: string;
    type: string; // Tag name (e.g., 'div', 'Image', 'motion.section')
    parent: string | null;
    className?: string;
    style?: StyleObject;
    attributes?: Record<string, string>; // Stores other attributes as strings
    componentInfo?: ComponentInfo;
    textContent?: string; // Consolidated text content from direct children
    // Children can now contain elements or map representations
    children?: (JSXObject | MapExpressionNode)[];
}

// Type returned by the main function
interface ParsedComponentResult {
    functionBody: string; // Code before the return statement
    jsxObject: JSXObject | null; // Parsed JSX structure from return statement
}

// Internal type returned by transformNode before consolidation/handling
type IntermediateNodeRepresentation = { type: 'text' | 'expression', content: string };
// transformNode can now also return an intermediate map representation
type TransformedNode = JSXObject | IntermediateNodeRepresentation | MapExpressionNode | null;


interface IdCounter {
    count: number;
}

// --- Main Function ---

/**
 * Parses a React functional component body string. It separates the code
 * before the main return statement (functionBody) from the JSX structure
 * within the return statement (jsxObject). Represents .map calls structurally.
 * Does NOT execute JavaScript.
 *
 * @param componentCodeString The string containing the component's body code.
 * @param userComponentConfig Optional configuration for component resolution.
 * @returns An object with 'functionBody' and 'jsxObject', or null on error.
 */
export function parseComponentCode(
    componentCodeString: string,
    userComponentConfig: ComponentConfig | null = null
): ParsedComponentResult | null {

    // --- Default + Merged Component Configuration ---
     const finalComponentConfig: ComponentConfig = {
         Image: { isComponent: true, packageName: "next/image", importName: "Image", importType: "default", },
         Link: { isComponent: true, packageName: "next/link", importName: "Link", importType: "default", },
         motion: { isComponent: true, packageName: "framer-motion", importName: "motion", importType: "default"}, // Example for motion
         ...(userComponentConfig || {})
     };

    // --- Internal Helper: Transform Style Object --- (same as before)
     function transformStyleObject(
         objectExpressionNode: babelTypes.ObjectExpression | null | undefined
     ): StyleObject {
        // ... (implementation from previous version)
        const style: StyleObject = {};
        if (!objectExpressionNode) return style;
        objectExpressionNode.properties.forEach(prop => {
            if (babelTypes.isObjectProperty(prop) && babelTypes.isIdentifier(prop.key)) {
                const key = prop.key.name;
                if (babelTypes.isStringLiteral(prop.value) || babelTypes.isNumericLiteral(prop.value)) {
                    style[key] = prop.value.value;
                }
            }
        });
        return style;
    }

    // --- Internal Helper: Generate Source Code from Node ---
    // Encapsulates the generator call with error handling
    function generateSource(node: babelTypes.Node | null | undefined): string {
         if (!node) return '';
         try {
             // Use concise: true for potentially shorter output
             return generate(node, { concise: true }).code.replace(/;$/, ''); // Remove trailing semicolon
         } catch(genError) {
              console.warn("Babel Generator failed for node:", node, genError);
              return '{...GENERATION_ERROR...}'; // Fallback placeholder
         }
    }


    // --- Internal Helper: Recursive Node Transformation ---
     function transformNode(
         node: babelTypes.Node | null | undefined,
         parentId: string | null,
         idCounter: IdCounter
     ): TransformedNode {
         if (!node) return null;

         let currentId: string = '';

         // Handle Text Nodes -> intermediate representation
         if (babelTypes.isJSXText(node)) {
             const text = node.value.trim().replace(/\s+/g, ' ');
             return text ? { type: 'text', content: text } : null;
         }

         // Handle Expressions
         if (babelTypes.isJSXExpressionContainer(node)) {
             const exp = node.expression;
             // Treat simple literals directly as text content
             if (babelTypes.isStringLiteral(exp) || babelTypes.isNumericLiteral(exp)) {
                 return { type: 'text', content: String(exp.value) };
             }
              // --- Handle .map() calls specifically ---
             if (babelTypes.isCallExpression(exp) &&
                 babelTypes.isMemberExpression(exp.callee) &&
                 babelTypes.isIdentifier(exp.callee.property, { name: 'map' }) &&
                 exp.arguments.length > 0)
             {
                 const arraySourceNode = exp.callee.object;
                 const callbackNode = exp.arguments[0]; // Assuming first arg is the callback

                  return {
                      type: 'map',
                      arraySource: generateSource(arraySourceNode),
                      callbackSource: generateSource(callbackNode),
                      parent: parentId // Add parent ID here
                  };
             }

             // For other expressions, generate their code
             const generatedCode = generateSource(exp);
             return { type: 'expression', content: generatedCode };
         }

        // Handle Element Nodes
         if (babelTypes.isJSXElement(node)) {
             const openingElement = node.openingElement;
             let tagName: string = "unknown";

             // Determine Tag Name (same as before)
             if (babelTypes.isJSXIdentifier(openingElement.name)) { tagName = openingElement.name.name; }
             else if (babelTypes.isJSXMemberExpression(openingElement.name)) {
                 if (babelTypes.isJSXIdentifier(openingElement.name.object) && babelTypes.isJSXIdentifier(openingElement.name.property)) {
                     tagName = `${openingElement.name.object.name}.${openingElement.name.property.name}`;
                 }
             }

             const elementObject: JSXObject = { id: '', type: tagName, parent: parentId, };

             // Determine ID (same as before)
             const idAttr = openingElement.attributes.find(attr => babelTypes.isJSXAttribute(attr) && attr.name.name === 'id') as babelTypes.JSXAttribute | undefined;
             if (idAttr && babelTypes.isStringLiteral(idAttr.value) && idAttr.value.value) { currentId = idAttr.value.value; }
             else { currentId = `${tagName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-${idCounter.count++}`; }
             elementObject.id = currentId;

            // Process Attributes (using generateSource for expressions)
             let attributesMap: Record<string, string> | undefined = undefined;
             openingElement.attributes.forEach((attr) => {
                 if (babelTypes.isJSXAttribute(attr)) {
                     const attrName = attr.name.name as string;
                     if (attrName === 'id') return;
                     const valueNode = attr.value;
                     let attrValueString: string = 'true'; // Default for boolean props

                     if (valueNode) {
                         if (babelTypes.isStringLiteral(valueNode)) { attrValueString = valueNode.value; }
                         else if (babelTypes.isJSXExpressionContainer(valueNode)) {
                             const exp = valueNode.expression;
                             if (babelTypes.isStringLiteral(exp) || babelTypes.isNumericLiteral(exp) || babelTypes.isBooleanLiteral(exp)) { attrValueString = String(exp.value); }
                             else if (babelTypes.isObjectExpression(exp) && attrName === 'style') { elementObject.style = transformStyleObject(exp); return; }
                             else { attrValueString = generateSource(exp); } // Generate code for other expressions
                         }
                     }

                     if (attrName === 'className') { elementObject.className = attrValueString; }
                     else if (attrName !== 'style') {
                         if (!attributesMap) attributesMap = {};
                         attributesMap[attrName] = attrValueString;
                     }
                 }
             });
              if (attributesMap && Object.keys(attributesMap).length > 0) { elementObject.attributes = attributesMap; }

            // Component Info (same as before)
              const componentInfoFromConfig = finalComponentConfig[tagName];
              let isLikelyComponent = tagName[0] === tagName[0].toUpperCase() && !tagName.includes('.');
               if (componentInfoFromConfig) { elementObject.componentInfo = { ...componentInfoFromConfig }; }
               else if (tagName.includes('.')) {
                    const baseName = tagName.split('.')[0];
                     if(finalComponentConfig[baseName]) { elementObject.componentInfo = { ...(finalComponentConfig[baseName]), isComponent: true, specificTag: tagName }; isLikelyComponent = true; }
               }
               if (!elementObject.componentInfo && isLikelyComponent) { elementObject.componentInfo = { isComponent: true, packageName: "unknown", importName: tagName, importType: "unknown" }; }

            // Process Children: Consolidate text/expressions, collect elements AND map nodes
             let aggregatedText = '';
              // Children array now holds JSXObject or MapExpressionNode
             const elementChildren: (JSXObject | MapExpressionNode)[] = [];

             node.children.forEach((child) => {
                 const transformedChild = transformNode(child, elementObject.id, idCounter);
                 if (transformedChild) {
                      // Check for intermediate text/expression first
                     if ('type' in transformedChild && (transformedChild.type === 'text' || transformedChild.type === 'expression')) {
                         aggregatedText += (aggregatedText ? ' ' : '') + transformedChild.content;
                     }
                      // Check if it's a MapExpressionNode (needs 'type' and 'arraySource')
                     else if ('type' in transformedChild && transformedChild.type === 'map') {
                         elementChildren.push(transformedChild);
                     }
                      // Check if it's a JSXObject (needs 'id')
                     else if ('id' in transformedChild) {
                         elementChildren.push(transformedChild);
                     }
                 }
             });

             if (aggregatedText) { elementObject.textContent = aggregatedText.trim(); }
             if (elementChildren.length > 0) { elementObject.children = elementChildren; }

             return elementObject;
         }

         return null; // Ignore other node types
    }

    // --- Main Function Execution ---

    if (!componentCodeString || typeof componentCodeString !== 'string') {
        console.error("parseComponentCode Error: Invalid component code string input.");
        return null;
    }
    const trimmedCode = componentCodeString.trim();
    if (!trimmedCode) {
        console.error("parseComponentCode Error: Component code string is empty.");
        return null;
    }

    try {
        // Parse the entire input string as a program/module
        const ast = babelParser.parse(trimmedCode, {
            sourceType: "module", // Assume ES module syntax
            plugins: ["jsx", "typescript"], // Enable JSX and potentially TS syntax
            errorRecovery: true,
        });

        let returnStatement: babelTypes.ReturnStatement | null = null;
        let returnStatementIndex: number = -1;
        const bodyNodes: babelTypes.Statement[] = [];

        // Find the top-level return statement (simplistic approach)
        // This assumes the input is like a function body, might need refinement for classes etc.
        ast.program.body.forEach((node, index) => {
            if (babelTypes.isReturnStatement(node)) {
                // TODO: Handle nested returns? For now, assume top-level return is the main one.
                if (!returnStatement) {
                    returnStatement = node;
                    returnStatementIndex = index;
                }
            }
        });

        if (returnStatementIndex === -1) {
            console.error("parseComponentCode Error: Could not find a top-level return statement.");
            // Option: could attempt to parse the whole thing as JSX if no return found?
             return null;
        }

        // Separate body nodes from the return statement
        const functionBodyNodes = ast.program.body.slice(0, returnStatementIndex);

        // Generate the function body string
        // Create a dummy Program node to generate code correctly
        const bodyProgram = babelTypes.program(functionBodyNodes);
        const functionBody = generateSource(bodyProgram);


        // Get the JSX node from the return statement's argument
        const jsxRootNode = returnStatement?.argument;
        let rootElementNode: babelTypes.JSXElement | null = null;

         if (babelTypes.isJSXElement(jsxRootNode)) {
              rootElementNode = jsxRootNode;
         } else if (babelTypes.isJSXFragment(jsxRootNode)) {
              // Find first element within fragment
             rootElementNode = jsxRootNode.children.find(
                  (child): child is babelTypes.JSXElement => babelTypes.isJSXElement(child)
             ) ?? null;
         }


        let jsxObjectResult: JSXObject | null = null;
        if (rootElementNode) {
            const idCounter: IdCounter = { count: 0 };
            const transformedResult = transformNode(rootElementNode, null, idCounter);
             // Ensure the final result is JSXObject or null
             if (transformedResult && 'id' in transformedResult) {
                  jsxObjectResult = transformedResult;
             } else if (transformedResult) {
                 console.warn("parseComponentCode Warning: Root JSX transformation resulted in a non-element node type.");
             }
        } else {
             console.warn("parseComponentCode Warning: No valid JSX Element found within the return statement.");
        }


        return {
            functionBody,
            jsxObject: jsxObjectResult
        };

    } catch (error: unknown) {
        console.error("parseComponentCode Error: Failed during parsing or transformation.", error);
         if (error instanceof Error && typeof (error as any).loc === 'object' && (error as any).loc !== null) {
              const loc = (error as any).loc;
              console.error(`Parsing error near Line ${loc.line}, Col ${loc.column}: ${error.message}`);
         }
        return null;
    }
}
