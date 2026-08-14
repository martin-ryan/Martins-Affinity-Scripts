# Affinity Global Organizer Script

/**
 * name: Affinity_Global_Organizer
 * description: Selects all layers automatically, color-codes individual sub-layers, and clears parent group overrides.
 * version: 2.2.0
 * author: Martin Ryan
 */
const { Document } = require("/document");const { DocumentCommand, CompoundCommandBuilder } = require("/commands");const { Selection } = require("/selections");const { RGBA8 } = require("/colours"); 
const doc = Document.current;
if (!doc) {
  alert("No document is open.");
} else {
  // 1. Create a master batch builder for our initial operations
  const builder = CompoundCommandBuilder.create();


  // 2. Execute a native "Select All" command to capture every layer and nested sub-layer across the entire file
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

    // Loop through every layer and sub-layer now captured in our global selection
    for (var i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      const singleSelection = Selection.create(doc, node);

      const nodeTypeName = node.constructor ? node.constructor.name : "";
      
      let layerTagColor;
      
      // --- 4-COLOR LOGIC RULES WITH GROUP INHERITANCE FIX ---
      if (node.isArtTextNode || nodeTypeName.indexOf("Text") !== -1 || typeof node.text !== "undefined") {
        layerTagColor = RGBA8(0, 120, 215, 255); // Blue (Text)
        colorBuilder.addCommand(DocumentCommand.createSetTagColour(singleSelection, layerTagColor));
        processedCount++;
        console.log("Layer " + (i + 1) + " [" + nodeTypeName + "] -> Tagging BLUE (Text)");
        
      } else if (nodeTypeName.indexOf("Group") !== -1 || nodeTypeName.indexOf("LayerGroup") !== -1) {
        // Crucial Fix: We do NOT assign a color tag command to the group folder container itself.
        // Leaving the group folder untagged prevents Affinity from forcing a blanket orange highlight 
        // over the group block, allowing all nested sub-layers to display their true individual colors cleanly!
        console.log("Layer " + (i + 1) + " [" + nodeTypeName + "] -> Leaving Group Folder Clear to avoid child tint overrides.");
        
      } else if (nodeTypeName.indexOf("Raster") !== -1 || nodeTypeName.indexOf("Pixel") !== -1 || nodeTypeName.indexOf("Image") !== -1) {
        layerTagColor = RGBA8(16, 185, 129, 255); // Green (Images)

        colorBuilder.addCommand(DocumentCommand.createSetTagColour(singleSelection, layerTagColor));
        processedCount++;
        console.log("Layer " + (i + 1) + " [" + nodeTypeName + "] -> Tagging GREEN (Image)");
        
      } else {
        layerTagColor = RGBA8(255, 87, 51, 255); // Red (Shapes/Vectors)
        colorBuilder.addCommand(DocumentCommand.createSetTagColour(singleSelection, layerTagColor));
        processedCount++;
        console.log("Layer " + (i + 1) + " [" + nodeTypeName + "] -> Tagging RED (Shape)");
      }
    }

    // 4. Commit all explicit layer colors into document history at once
    if (processedCount > 0) {
      doc.executeCommand(colorBuilder.createCommand());
    }

    // 5. Clean Up: Clear selection so your workspace bounding boxes stay exactly how you left them
    const clearSelectionBuilder = CompoundCommandBuilder.create();

    const emptySelection = Selection.create(doc, []);
    clearSelectionBuilder.addCommand(DocumentCommand.createSetSelection(emptySelection));
    doc.executeCommand(clearSelectionBuilder.createCommand());

    console.log("Global formatting complete! Successfully categorized " + processedCount + " individual layers.");
  }
}


