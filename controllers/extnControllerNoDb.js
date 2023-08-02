const fs = require("fs");
const extensionsFile = "/etc/asterisk/extensions_gui.conf";

const readExtensionsFile = () => {
  const content = fs.readFileSync(extensionsFile, "utf-8");
  const lines = content.split(/\r?\n/);
  const extensionsData = {};
  let currentContext = null;
  lines.forEach((line) => {
    line = line.trim();
    if (line === "" || line.startsWith(";")) {
      return;
    }
    if (line.startsWith("[") && line.endsWith("]")) {
      currentContext = line.slice(1, -1);
      if (!extensionsData[currentContext]) {
        extensionsData[currentContext] = [];
      }
      return;
    }
    if (currentContext) {
      const parts = line.split(",");
      const exten = parts[0].trim().split("=>")[1].trim();
      const existingIndex = extensionsData[currentContext].findIndex(
        (ext) =>
          ext.startsWith(`exten => ${exten},`) ||
          ext.startsWith(`same => ${exten},`)
      );
      if (existingIndex !== -1) {
        const existingExtensionParts =
          extensionsData[currentContext][existingIndex].split(",");
        extensionsData[currentContext][
          existingIndex
        ] = `same => ${existingExtensionParts[1].trim()},n,${existingExtensionParts[2].trim()}`;
      } else {
        extensionsData[currentContext].push(line);
      }
    }
  });

  return extensionsData;
};

// Helper function to write the data structure back to the extensions.conf file
function writeExtensionsFile(dataStructure) {
  let content = "";

  for (const context in dataStructure) {
    content += `[${context}]\n`;
    for (const extension of dataStructure[context]) {
      content += `${extension}\n`;
    }
    content += "\n"; // Add an empty line between contexts
  }

  fs.writeFileSync(extensionsFile, content, "utf-8");
}

// Controller function to get all contexts/extensions
exports.getAllExtensions = (req, res) => {
  try {
    const extensionsData = readExtensionsFile();
    res.json(extensionsData);
  } catch (error) {
    res.status(500).json({ error: "Error reading extensions.conf file" });
  }
};

// Controller function to add a new context/extension
exports.addExtension = (req, res) => {
  try {
    const { context, exten, priority, func, params } = req.body;

    if (!context || !exten || !priority || !func) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse request body and add the new context/extension to the data structure
    const newExtension = `exten => ${exten},${priority},${func}(${
      params || ""
    })`;

    const extensionsData = readExtensionsFile();
    if (!extensionsData[context]) {
      extensionsData[context] = [];
    }

    // Handle duplicate extensions
    const existingExtensionIndex = extensionsData[context].findIndex(
      (extension) => {
        const parts = extension.split(",");
        const existingExten = parts[0].trim().split("=>")[1].trim();
        return existingExten === exten;
      }
    );

    if (existingExtensionIndex !== -1) {
      // Update the existing extension line
      const existingExtensionParts =
        extensionsData[context][existingExtensionIndex].split(",");
      extensionsData[context][
        existingExtensionIndex
      ] = `same => ${existingExtensionParts[1].trim()},n,${existingExtensionParts[2].trim()}`;
    } else {
      // Add the new extension line to the current context
      extensionsData[context].push(newExtension);
    }

    writeExtensionsFile(extensionsData);
    res.json({ message: "New context/extension added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error writing to extensions.conf file" });
  }
};

// Controller function to update an existing context/extension
exports.updateExtension = (req, res) => {
  try {
    const { context, extension } = req.params;
    const { exten, priority, func, params } = req.body;

    if (!exten || !priority || !func) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse request body and update the context/extension in the data structure
    const updatedExtension = `exten => ${exten},${priority},${func}(${
      params || ""
    })`;

    const extensionsData = readExtensionsFile();
    if (!extensionsData[context]) {
      return res.status(404).json({ error: "Context not found" });
    }

    const existingExtensionIndex = extensionsData[context].findIndex(
      (ext) =>
        ext.startsWith(`exten => ${extension},`) ||
        ext.startsWith(`same => ${extension},`)
    );

    if (existingExtensionIndex === -1) {
      return res.status(404).json({ error: "Extension not found" });
    }

    extensionsData[context][existingExtensionIndex] = updatedExtension;
    writeExtensionsFile(extensionsData);
    res.json({ message: "Context/extension updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error writing to extensions.conf file" });
  }
};

// Controller function to delete a specific extension from a context
exports.deleteExtension = (req, res) => {
  try {
    const { context, extension } = req.params;

    // Parse request parameters and remove the specified extension from the context
    const extensionsData = readExtensionsFile();
    if (!extensionsData[context]) {
      return res.status(404).json({ error: "Context not found" });
    }

    // Find the index of the extension to be deleted
    const extensionIndex = extensionsData[context].findIndex(
      (ext) =>
        ext.startsWith(`exten => ${extension},`) ||
        ext.startsWith(`same => ${extension},`)
    );

    if (extensionIndex === -1) {
      return res.status(404).json({ error: "Extension not found" });
    }

    // Remove the extension from the context
    extensionsData[context].splice(extensionIndex, 1);

    writeExtensionsFile(extensionsData);
    res.json({ message: "Extension deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error writing to extensions.conf file" });
  }
};

// Controller function to delete an entire context and its extensions
exports.deleteContext = (req, res) => {
  try {
    const { context } = req.params;

    // Parse request parameters and remove the entire context and its extensions
    const extensionsData = readExtensionsFile();
    if (!extensionsData[context]) {
      return res.status(404).json({ error: "Context not found" });
    }

    delete extensionsData[context]; // Delete the entire context and its extensions

    writeExtensionsFile(extensionsData);
    res.json({
      message: "Context and all its extensions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Error writing to extensions.conf file" });
  }
};

// Controller function to get one extension from a context
exports.getOneExtension = (req, res) => {
  try {
    const { context, extension } = req.params;

    // Parse request parameters and retrieve the specified extension from the context
    const extensionsData = readExtensionsFile();
    if (!extensionsData[context]) {
      return res.status(404).json({ error: "Context not found" });
    }

    // Find the index of the requested extension
    const extensionIndex = extensionsData[context].findIndex(
      (ext) =>
        ext.startsWith(`exten => ${extension},`) ||
        ext.startsWith(`same => ${extension},`)
    );

    if (extensionIndex === -1) {
      return res.status(404).json({ error: "Extension not found" });
    }

    // Get the extension details from the context
    const extensionDetails = extensionsData[context][extensionIndex];
    res.json({ extension: extensionDetails });
  } catch (error) {
    res.status(500).json({ error: "Error reading extensions.conf file" });
  }
};
