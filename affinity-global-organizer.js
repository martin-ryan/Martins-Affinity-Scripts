/**
 * name: Affinity_Global_Organizer
 * description: Selects all layers automatically, runs deep color-coding, and clears selection.
 * version: 2.0.0
 * author: Martin Ryan
 */

const { Document } = require("/document");
const { DocumentCommand, CompoundCommandBuilder } = require("/commands");
const { Selection } = require("/selections");
const { RGBA8 } = require("/colours"); 

const doc = Document.current;

if (!doc) {
  alert("No document is open.");
} else {
  // 1. Create a master batch builder for our operations
  const builder = CompoundCommandBuilder.create();

  // 2. Execute a native "Select All" command to capture every layer in the document
  const selectAllCmd = DocumentCommand.createSelectAll(doc);
  builder.addCommand(selectAllCmd);
  doc.executeCommand(builder.createCommand());

  // 3. Read our new comprehensive automatic selection array
  const allNodes = doc.selection.nodes.toArray();

  if (allNodes.length === 0) {
    alert("The document is currently empty!");
  } else {
    // Create a fresh builder to store all of our color tag modifications
    const colorBuilder = CompoundCommandBuilder.create();
    var processedCount = 0;

    // Loop through every layer now captured in our global selection
    for (var i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      const singleSelection = Selection.create(doc, node);
      const nodeTypeName = node.constructor ? node.constructor.name : "";
      
      let layerTagColor;
      
      // --- 4-COLOR LOGIC RULES ---
      if (node.isArtTextNode || nodeTypeName.indexOf("Text") !== -1 || typeof node.text !== "undefined") {
        layerTagColor = RGBA8(0, 120, 215, 255); // Blue (Text)
      } else if (nodeTypeName.indexOf("Group") !== -1 || nodeTypeName.indexOf("LayerGroup") !== -1) {
        layerTagColor = RGBA8(245, 158, 11, 255); // Yellow (Groups)
      } else if (nodeTypeName.indexOf("Raster") !== -1 || nodeTypeName.indexOf("Pixel") !== -1 || nodeTypeName.indexOf("Image") !== -1) {
        layerTagColor = RGBA8(16, 185, 129, 255); // Green (Images)
      } else {
        layerTagColor = RGBA8(255, 87, 51, 255); // Red (Shapes/Vectors)
      }

      colorBuilder.addCommand(DocumentCommand.createSetTagColour(singleSelection, layerTagColor));
      processedCount++;
    }

    // 4. Commit all layer colors into document history at once
    doc.executeCommand(colorBuilder.createCommand());

    // 5. Clean Up: Clear selection so your workspace stays exactly how you left it
    const clearSelectionBuilder = CompoundCommandBuilder.create();
    // Passing an empty selection array or null resets the focus bounding boxes
    const emptySelection = Selection.create(doc, []);
    clearSelectionBuilder.addCommand(DocumentCommand.createSetSelection(emptySelection));
    doc.executeCommand(clearSelectionBuilder.createCommand());

    console.log("Global formatting complete! Successfully categorized " + processedCount + " layers.");
  }
}
