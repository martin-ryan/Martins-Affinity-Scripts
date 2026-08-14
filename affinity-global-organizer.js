/**
 * name: Affinity_Global_Organizer
 * description: Selects all layers automatically, recursively scans group folder contents using the verified children collection, and applies 4-color layer tag organization.
 * version: 3.1.0
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
  // 1. Create an initial builder to trigger the Select All command
  const initBuilder = CompoundCommandBuilder.create();
  initBuilder.addCommand(DocumentCommand.createSelectAll(doc));
  doc.executeCommand(initBuilder.createCommand());

  // 2. Read the top-level layers captured by the Select All operation
  const topNodes = doc.selection.nodes.toArray();

  if (topNodes.length === 0) {
    alert("The document is currently empty!");
  } else {
    // 3. Create a single master builder to batch all selections and color applications
    const masterBuilder = CompoundCommandBuilder.create();
    var processedCount = 0;

    // Recursive function to safely traverse the layer tree and build the command queue
    function queueNodeOperations(node) {
      if (!node) return;

      const nodeTypeName = node.constructor ? node.constructor.name : "";
      const singleSelection = Selection.create(doc, node);
      
      let layerTagColor;
      var shouldColor = true;
      
      // --- 4-COLOR LOGIC RULES ---
      if (node.isArtTextNode || nodeTypeName.indexOf("Text") !== -1 || typeof node.text !== "undefined") {
        layerTagColor = RGBA8(0, 120, 215, 255); // Blue (Text)
        console.log("Queueing BLUE for text node: [" + nodeTypeName + "]");
      } else if (nodeTypeName.indexOf("Group") !== -1 || nodeTypeName.indexOf("LayerGroup") !== -1) {
        // Group folder container gets marked Yellow/Amber to organize the parent layer block
        layerTagColor = RGBA8(245, 158, 11, 255); 
        console.log("Queueing YELLOW for group folder: [" + nodeTypeName + "]");
      } else if (nodeTypeName.indexOf("Raster") !== -1 || nodeTypeName.indexOf("Pixel") !== -1 || nodeTypeName.indexOf("Image") !== -1) {
        layerTagColor = RGBA8(16, 185, 129, 255); // Green (Images)
        console.log("Queueing GREEN for image node: [" + nodeTypeName + "]");
      } else {
        layerTagColor = RGBA8(255, 87, 51, 255); // Red (Shapes/Vectors)
        console.log("Queueing RED for shape node: [" + nodeTypeName + "]");
      }

      // Append sequential operations directly to the master queue blueprint
      masterBuilder.addCommand(DocumentCommand.createSetSelection(singleSelection));
      masterBuilder.addCommand(DocumentCommand.createSetTagColour(singleSelection, layerTagColor));
      processedCount++;

      // SUCCESS BRIDGE: If a group folder is encountered, use the verified 'children' array wrapper to scan nested sub-layers
      if (nodeTypeName.indexOf("Group") !== -1 || nodeTypeName.indexOf("LayerGroup") !== -1) {
        if (node.children && typeof node.children.toArray === "function") {
          const childNodes = node.children.toArray();
          console.log("  > Group container has " + childNodes.length + " nested elements. Diving inside...");
          for (var j = 0; j < childNodes.length; j++) {
            queueNodeOperations(childNodes[j]); // Recursive call to process nested shapes/text
          }
        }
      }
    }

    // Build the master command list across all top-level elements
    for (var i = 0; i < topNodes.length; i++) {
      queueNodeOperations(topNodes[i]);
    }

    // 4. Commit the entire sequential pipeline to the document history at once
    if (processedCount > 0) {
      doc.executeCommand(masterBuilder.createCommand());
    }

    // 5. Clean Up: Reset selection context back to clean slate state
    const clearBuilder = CompoundCommandBuilder.create();
    const emptySelection = Selection.create(doc, []);
    clearBuilder.addCommand(DocumentCommand.createSetSelection(emptySelection));
    doc.executeCommand(clearBuilder.createCommand());

    console.log("Global deferred batch formatting complete. Processed " + processedCount + " elements.");
  }
}
