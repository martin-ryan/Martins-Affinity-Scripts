/**
 * name: Affinity_Global_Organizer
 * description: Opens a preferences dialog for the user to select custom tag colors for Text, Groups, Images, and Shapes, then formats the entire document dynamically.
 * version: 4.5.0
 * author: Martin Ryan
 */

'use strict';

// Acquire structural module handles from local codebase references aligned with wildcard declarations
const { Document } = require('./document.js');
// @ts-ignore
const { DocumentCommand, CompoundCommandBuilder } = require('./commands.js');
// @ts-ignore
const { Selection } = require('./selections.js');
// @ts-ignore
const { RGBA8 } = require('./colours.js'); 
// @ts-ignore
const { Dialog, DialogResult } = require('./dialog.js');

/**
 * Main execution entry point for the layer organizing automation system.
 */
function main() {
    const doc = Document.current;

    if (!doc) {
        alert("No document is open.");
        return;
    }

    // 1. Define available color options for the dropdown choice menus
    const colorOptions = ["Blue", "Yellow", "Green", "Red", "Orange", "Purple"];
    
    // 2. Initialize and construct the Preferences Dialog Box panel layout
    const dlg = Dialog.create("Layer Organizer Preferences");
    const col = dlg.addColumn();
    const grpColors = col.addGroup("Configure Layer Tag Colors");
    
    // Create dropdown selectors using the native addComboBox method
    const textColorChoice = grpColors.addComboBox("Text Layers Highlight", colorOptions, 0);   // Default: Blue
    const groupColorChoice = grpColors.addComboBox("Group Folders Highlight", colorOptions, 1); // Default: Yellow
    const imageColorChoice = grpColors.addComboBox("Pixel Images Highlight", colorOptions, 2);  // Default: Green
    const shapeColorChoice = grpColors.addComboBox("Vector Shapes Highlight", colorOptions, 3);  // Default: Red

    // 3. Render the modal dialog frame and await the user's confirmation window action
    if (dlg.runModal().value === DialogResult.Ok.value) {

        /**
         * Smart helper function to dynamically scan and extract the selected choice string
         * @param {any} control - The native UI control object.
         * @param {string} defaultFallback - Default value if no properties are matched.
         * @returns {string} Resolves selected option text.
         */
        function getControlValue(control, defaultFallback) {
            if (!control) return defaultFallback;
            
            // Inspect explicit element parameter options
            if (control.value !== undefined && control.value !== null) return String(control.value);
            if (control.text !== undefined && control.text !== null) return String(control.text);
            if (control.selectedValue !== undefined && control.selectedValue !== null) return String(control.selectedValue);
            
            // Check if it returns a numerical selection index instead
            if (typeof control.selectedIndex === "number" && colorOptions[control.selectedIndex]) {
                return colorOptions[control.selectedIndex];
            }
            
            // Dynamic Brute Force Probe: Look through all available string keys for a matching color name
            for (let key in control) {
                try {
                    if (typeof control[key] === "string" && colorOptions.indexOf(control[key]) !== -1) {
                        return String(control[key]);
                    }
                } catch (err) {}
            }
            
            return defaultFallback;
        }

        // Resolve the selected option string using the smart inspector helper
        const textSelectionStr  = getControlValue(textColorChoice, "Blue");
        const groupSelectionStr = getControlValue(groupColorChoice, "Yellow");
        const imageSelectionStr = getControlValue(imageColorChoice, "Green");
        const shapeSelectionStr = getControlValue(shapeColorChoice, "Red");

        console.log("User Configuration Resolved -> Text: " + textSelectionStr + ", Groups: " + groupSelectionStr + ", Images: " + imageSelectionStr + ", Shapes: " + shapeSelectionStr);

        /**
         * Internal helper dictionary function to map selected choice strings to native RGBA8 handles
         * @param {string} colorName - Name of the color option chosen.
         * @returns {any} Returns native application color resource.
         */
        function getRGBAColor(colorName) {
            switch (colorName) {
                case "Blue":   return RGBA8(0, 120, 215, 255);
                case "Yellow": return RGBA8(245, 158, 11, 255);
                case "Green":  return RGBA8(16, 185, 129, 255);
                case "Red":    return RGBA8(255, 87, 51, 255);
                case "Orange": return RGBA8(243, 114, 44, 255);
                case "Purple": return RGBA8(155, 89, 182, 255);
                default:       return RGBA8(255, 255, 255, 255); // Fallback standard White
            }
        }

        const chosenTextColor  = getRGBAColor(textSelectionStr);
        const chosenGroupColor = getRGBAColor(groupSelectionStr);
        const chosenImageColor = getRGBAColor(imageSelectionStr);
        const chosenShapeColor = getRGBAColor(shapeSelectionStr);

        try {
            // 4. Trigger the Select All operation to gather top-level structural elements
            const initBuilder = CompoundCommandBuilder.create();
            initBuilder.addCommand(DocumentCommand.createSelectAll(doc));
            /** @type {any} */ (doc).executeCommand(initBuilder.createCommand());

            if (!doc.selection || !doc.selection.nodes) {
                alert("The layer selection context could not be resolved.");
                return;
            }

            const topNodes = doc.selection.nodes.toArray();

            if (topNodes.length === 0) {
                alert("The document is currently empty!");
            } else {
                const masterBuilder = CompoundCommandBuilder.create();
                let processedCount = 0;

                /**
                 * Recursive scanner function to build our unified single transaction queue
                 * @param {any} node - The layer hierarchy node element under inspection.
                 */
                function queueNodeOperations(node) {
                    // Strict inner scope guard to verify node validation and clear 'doc possibly null' closure anomalies
                    if (!node || !doc) return;

                    const element = /** @type {any} */ (node);
                    const nodeTypeName = element.constructor ? element.constructor.name : "";
                    const singleSelection = Selection.create(doc, element);
                    
                    let layerTagColor;
                    
                    // --- EVALUATE LAYERS AND APPLY PERSONALIZED COLOR SCHEMES ---
                    if (element.textFrameInterface || nodeTypeName.indexOf("Text") !== -1 || typeof element.text !== "undefined" || element.textFrameInterface) {
                        layerTagColor = chosenTextColor;
                    } else if (nodeTypeName.indexOf("Group") !== -1 || nodeTypeName.indexOf("LayerGroup") !== -1) {
                        layerTagColor = chosenGroupColor;
                    } else if (nodeTypeName.indexOf("Raster") !== -1 || nodeTypeName.indexOf("Pixel") !== -1 || nodeTypeName.indexOf("Image") !== -1 || element.imageResourceInterface || element.pictureFrameInterface) {
                        layerTagColor = chosenImageColor;
                    } else {
                        layerTagColor = chosenShapeColor;
                    }

                    // Add selection focus and color modifications safely to our stable timeline queue
                    masterBuilder.addCommand(DocumentCommand.createSetSelection(singleSelection));
                    masterBuilder.addCommand(DocumentCommand.createSetTagColour(singleSelection, layerTagColor));
                    processedCount++;

                    // Deep Scan: Navigate recursively down using the verified group children path
                    if (nodeTypeName.indexOf("Group") !== -1 || nodeTypeName.indexOf("LayerGroup") !== -1) {
                        if (element.children && typeof element.children.toArray === "function") {
                            const childNodes = element.children.toArray();
                            
                            // Type-safe loop syntax to sidestep implicit callback typing anomalies
                            for (const childNode of childNodes) {
                                queueNodeOperations(childNode);
                            }
                        }
                    }
                }

                // Populate our master timeline command queue via structural item iteration loops
                for (const topNode of topNodes) {
                    queueNodeOperations(topNode);
                }

                // 5. Fire the entire collection timeline down to the native app engine at once
                if (processedCount > 0) {
                    /** @type {any} */ (doc).executeCommand(masterBuilder.createCommand());
                }

                // 6. Clean Up: Reset selection context back to clean slate state
                const clearBuilder = CompoundCommandBuilder.create();
                const emptySelection = Selection.create(doc, []);
                clearBuilder.addCommand(DocumentCommand.createSetSelection(emptySelection));
                /** @type {any} */ (doc).executeCommand(clearBuilder.createCommand());

                console.log("Global personalized formatting complete. Processed " + processedCount + " elements.");
            }
        } catch (error) {
            // Unify modern exception parsing type boundaries safely
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("An execution error occurred during processing: " + errorMessage);
        }
    } else {
        console.log("User closed or cancelled the layer organizer configuration panel dialog.");
    }
}

// Execute program lifecycle loop
main();
