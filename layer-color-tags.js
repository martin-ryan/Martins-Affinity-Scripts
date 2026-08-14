/**
 * name: Auto_Color_Layers
 * description: Automatically tags text layers blue and other shapes green.
 * version: 1.0.0
 */

const { Document } = require("/document");
const { DocumentCommand, CompoundCommandBuilder } = require("/commands");
const { Selection } = require("/selections");

const doc = Document.current;

if (!doc) {
  alert("No document is open.");
} else {
  const selectedNodes = doc.selection.nodes.toArray();

  if (selectedNodes.length === 0) {
    alert("Select a few layers first!");
  } else {
    const builder = CompoundCommandBuilder.create();

    // Loop through every highlighted layer
    for (var i = 0; i < selectedNodes.length; i++) {
      const node = selectedNodes[i];
      const singleSelection = Selection.create(doc, node);
      
      // Check if it's a text layer using the native flag we found earlier
      if (node.isArtTextNode) {
        // Tag color 5 is usually Blue in Affinity
        builder.addCommand(DocumentCommand.createSetTagColour(singleSelection, 5));
      } else {
        // Tag color 4 is usually Green
        builder.addCommand(DocumentCommand.createSetTagColour(singleSelection, 4));
      }
    }

    doc.executeCommand(builder.createCommand());
    console.log("Layers automatically color-coded!");
  }
}
