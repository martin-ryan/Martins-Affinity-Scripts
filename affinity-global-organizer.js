# Affinity Global Organizer Script

/**
 * name: Affinity_Global_Organizer
 * description: Selects all layers automatically, runs deep recursive color-coding inside groups, and clears selection.
 * version: 2.1.0
 * author: Martin Ryan
 */
const { Document } = require("/document");const { DocumentCommand, CompoundCommandBuilder } = require("/commands");const { Selection } = require("/selections");const { RGBA8 } = require("/colours"); 
const doc = Document.current;
if (!doc) {
  alert("No document is open.");
} else {
  // 1. Create a master batch builder for our initial operations
  const builder = CompoundCommandBuilder.create();


  // 2. Execute a native "Select All" command to capture all top-level layers and groups
  const selectAllCmd = DocumentCommand.createSelectAll(doc);
  builder.addCommand(selectAllCmd);
  doc.executeCommand(builder.createCommand());

  // 3. Read our top-level automatic selection array
  const topNodes = doc.selection.nodes.toArray();

  if (topNodes.length === 0) {
    alert("The document is currently empty!");
  } else {
    // Create a fresh builder to store all of our explicit color tag modifications
    const colorBuilder = CompoundCommandBuilder.create();
    var processedCount = 0;

    // Recursive function to deeply scan groups and explicitly color layers individually
    function processNode(node) {
      if (!node) return;


      const singleSelection = Selection.create(doc, node);
      const nodeTypeName = node.constructor ? node.constructor.name : "";
      let layerTagColor;
      
      // --- 4-COLOR LOGIC RULES ---
      if (node.isArtTextNode || nodeTypeName.indexOf("Text") !== -1 || typeof node.text !== "undefined") {
        layerTagColor = RGBA8(0, 120, 215, 255); // Blue (Text)
        console.log("Deep Scan -> [" + nodeTypeName + "] -> BLUE (Text)");
        
      } else if (nodeTypeName.indexOf("Group") !== -1 || nodeTypeName.indexOf("LayerGroup") !== -1) {
        layerTagColor = RGBA8(245, 158, 11, 255); // Yellow/Orange (Groups)
        console.log("Deep Scan -> [" + nodeTypeName + "] -> YELLOW (Group Container)");
        
        // Deep scan trigger: drill down into this group's custom child node tree array
        if (node.nodes && typeof node.nodes.toArray === "function") {
          const childNodes = node.nodes.toArray();
          for (var j = 0; j < childNodes.length; j++) {
            processNode(childNodes[j]); // Recursive call to target child layers
          }

        }
        
      } else if (nodeTypeName.indexOf("Raster") !== -1 || nodeTypeName.indexOf("Pixel") !== -1 || nodeTypeName.indexOf("Image") !== -1) {
        layerTagColor = RGBA8(16, 185, 129, 255); // Green (Images)
        console.log("Deep Scan -> [" + nodeTypeName + "] -> GREEN (Image)");
        
      } else {
        layerTagColor = RGBA8(255, 87, 51, 255); // Red (Shapes/Vectors)
        console.log("Deep Scan -> [" + nodeTypeName + "] -> RED (Shape)");
      }

      // Explicitly push color command for this specific node to prevent visual inheritance glitches
      colorBuilder.addCommand(DocumentCommand.createSetTagColour(singleSelection, layerTagColor));
      processedCount++;
    }

    // Run the recursive engine over every node captured by the Select All operation
    for (var i = 0; i < topNodes.length; i++) {
      processNode(topNodes[i]);

    }

    // 4. Commit all explicit layer colors into document history at once
    doc.executeCommand(colorBuilder.createCommand());

    // 5. Clean Up: Clear selection so your bounding box focus resets cleanly
    const clearSelectionBuilder = CompoundCommandBuilder.create();
    const emptySelection = Selection.create(doc, []);
    clearSelectionBuilder.addCommand(DocumentCommand.createSetSelection(emptySelection));
    doc.executeCommand(clearSelectionBuilder.createCommand());

    console.log("Global deep formatting complete! Successfully categorized " + processedCount + " layers.");
  }
}


