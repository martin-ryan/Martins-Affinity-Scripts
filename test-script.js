/**
 * name: Affinity_Global_Organizer
 * description: Scans and color-codes ALL layers in the document automatically with no selection required.
 * version: 1.4.0
 * author: Martin
 */

const { Document } = require("/document");
const { DocumentCommand, CompoundCommandBuilder } = require("/commands");
const { Selection } = require("/selections");
const { RGBA8 } = require("/colours"); 

const doc = Document.current;

if (!doc) {
  alert("No document is open.");
} else {
  const builder = CompoundCommandBuilder.create();
  var layerCount = 0;

  // Reusable recursive scanner function
  function processNode(node) {
    if (!node) return;
    layerCount++;

    const singleSelection = Selection.create(doc, node);
    const nodeTypeName = node.constructor ? node.constructor.name : "";
    let layerTagColor;
    
    // --- 4-COLOR EVALUATION RULES ---
    
    // 1. Text Assets -> Blue
    if (node.isArtTextNode || nodeTypeName.indexOf("Text") !== -1 || typeof node.text !== "undefined") {
      layerTagColor = RGBA8(0, 120, 215, 255);
      console.log("Global Scan -> [" + nodeTypeName + "] -> BLUE (Text)");
      
    // 2. Group Containers -> Yellow (And recursively scan their nested children!)
    } else if (nodeTypeName.indexOf("Group") !== -1 || nodeTypeName.indexOf("LayerGroup") !== -1) {
      layerTagColor = RGBA8(245, 158, 11, 255);
      console.log("Global Scan -> [" + nodeTypeName + "] -> YELLOW (Group Container)");
      
      // Look for nested child nodes inside this group layer container
      if (node.nodes && typeof node.nodes.toArray === "function") {
        const childNodes = node.nodes.toArray();
        for (var j = 0; j < childNodes.length; j++) {
          processNode(childNodes[j]); // Recursive dive
        }
      }
      
    // 3. Pixel Images / Bitmaps -> Green
    } else if (nodeTypeName.indexOf("Raster") !== -1 || nodeTypeName.indexOf("Pixel") !== -1 || nodeTypeName.indexOf("Image") !== -1) {
      layerTagColor = RGBA8(16, 185, 129, 255);
      console.log("Global Scan -> [" + nodeTypeName + "] -> GREEN (Image)");
      
    // 4. Default Fallback (Vectors/Shapes/Artboards) -> Red
    } else {
      layerTagColor = RGBA8(255, 87, 51, 255);
      console.log("Global Scan -> [" + nodeTypeName + "] -> RED (Shape)");
    }
    
    // Queue the color change command
    builder.addCommand(DocumentCommand.createSetTagColour(singleSelection, layerTagColor));
  }

  // --- TARGET GLOBAL DOCUMENT ROOT ---
  // If the document has a root nodes tree container, scan it
  if (doc.nodes && typeof doc.nodes.toArray === "function") {
    const rootNodes = doc.nodes.toArray();
    for (var i = 0; i < rootNodes.length; i++) {
      processNode(rootNodes[i]);
    }
  } else if (doc.root && doc.root.nodes) { // Secondary fallback path for standard document trees
    const rootNodes = doc.root.nodes.toArray();
    for (var i = 0; i < rootNodes.length; i++) {
      processNode(rootNodes[i]);
    }
  } else {
    alert("Could not locate the document's global root layer tree structure.");
  }

  // Execute all changes across the document in a single command block
  if (layerCount > 0) {
    doc.executeCommand(builder.createCommand());
    console.log("Successfully formatted " + layerCount + " total layers globally.");
  }
}
