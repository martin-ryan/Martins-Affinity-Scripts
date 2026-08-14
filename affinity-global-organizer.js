/**
 * name: Affinity_Global_Organizer
 * description: Opens a preferences dialog for the user to select custom tag colors for Text, Groups, Images, and Shapes, then formats the entire document dynamically.
 * version: 4.5.0
 * author: Martin Ryan
 */

const { Document } = require("/document");
const { DocumentCommand, CompoundCommandBuilder } = require("/commands");
const { Selection } = require("/selections");
const { RGBA8 } = require("/colours"); 
const { Dialog, DialogResult } = require("/dialog");

const doc = Document.current;

if (!doc) {
  alert("No document is open.");
} else {
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

    // Smart helper function to dynamically scan and extract the selected choice string
    function getControlValue(control, defaultFallback) {
      if (!control) return defaultFallback;
      
      // Try common property variants
      if (control.value !== undefined && control.value !== null) return control.value;
      if (control.text !== undefined && control.text !== null) return control.text;
      if (control.selectedValue !== undefined && control.selectedValue !== null) return control.selectedValue;
      
      // Check if it returns a numerical selection index instead
      if (typeof control.selectedIndex === "number" && colorOptions[control.selectedIndex]) {
        return colorOptions[control.selectedIndex];
      }
      
      // Dynamic Brute Force Probe: Look through all available string keys for a matching color name
      // This is the specific loop that successfully extracted your menu choices previously
      for (let key in control) {
        try {
          if (typeof control[key] === "string" && colorOptions.indexOf(control[key]) !== -1) {
            return control[key];
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

    // Internal helper dictionary function to map selected choice strings to native RGBA8 handles
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

    // 4. Trigger the Select All operation to gather top-level structural elements
    const initBuilder = CompoundCommandBuilder.create();
    initBuilder.addCommand(DocumentCommand.createSelectAll(doc));
    doc.executeCommand(initBuilder.createCommand());

    const topNodes = doc.selection.nodes.toArray();

    if (topNodes.length === 0) {
      alert("The document is currently empty!");
    } else {
      const masterBuilder = CompoundCommandBuilder.create();
      var processedCount = 0;

      // Recursive scanner function to build our unified single transaction queue
      function queueNodeOperations(node) {
        if (!node) return;

        const nodeTypeName = node.constructor ? node.constructor.name : "";
        const singleSelection = Selection.create(doc, node);
        
        let layerTagColor;
        
        // --- EVALUATE LAYERS AND APPLY PERSONALIZED COLOR SCHEMES ---
        if (node.isArtTextNode || nodeTypeName.indexOf("Text") !== -1 || typeof node.text !== "undefined") {
          layerTagColor = chosenTextColor;
        } else if (nodeTypeName.indexOf("Group") !== -1 || nodeTypeName.indexOf("LayerGroup") !== -1) {
          layerTagColor = chosenGroupColor;
        } else if (nodeTypeName.indexOf("Raster") !== -1 || nodeTypeName.indexOf("Pixel") !== -1 || nodeTypeName.indexOf("Image") !== -1) {
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
          if (node.children && typeof node.children.toArray === "function") {
            const childNodes = node.children.toArray();
            for (var j = 0; j < childNodes.length; j++) {
              queueNodeOperations(childNodes[j]);
            }
          }
        }
      }

      // Populate our master timeline command queue
      for (var i = 0; i < topNodes.length; i++) {
        queueNodeOperations(topNodes[i]);
      }

      // 5. Fire the entire collection timeline down to the native app engine at once
      if (processedCount > 0) {
        doc.executeCommand(masterBuilder.createCommand());
      }

      // 6. Clean Up: Reset selection context back to clean slate state
      const clearBuilder = CompoundCommandBuilder.create();
      const emptySelection = Selection.create(doc, []);
      clearBuilder.addCommand(DocumentCommand.createSetSelection(emptySelection));
      doc.executeCommand(clearBuilder.createCommand());

      console.log("Global personalized formatting complete. Processed " + processedCount + " elements.");
    }
  } else {
    console.log("User closed or cancelled the layer organizer configuration panel dialog.");
  }
}
