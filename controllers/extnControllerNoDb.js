const fs = require("fs");
const extensionsFile = "/etc/asterisk/extensions_gui.conf";

exports.getExtn = async (req, res) => {
  try {
    const data = await fs.promises.readFile(extensionsFile, "utf8");
    const extensions = data.split("\n");
    const filteredExtensions = extensions.filter(
      (extension) => extension.trim() !== ""
    );
    return res.status(200).json({ extensions: filteredExtensions });
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("Extensions file not found");
      return res.status(200).json({ extensions: [] });
    } else {
      console.error("Error reading extensions file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.createExtn = async (req, res) => {
  try {
    const { newExtensionsData } = req.body;
    let existingData = "";
    try {
      existingData = await fs.promises.readFile(extensionsFile, "utf8");
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error("Error reading extensions file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    const updatedData = existingData + "\n" + newExtensionsData.join("\n");
    await fs.promises.writeFile(extensionsFile, updatedData, "utf8");
    return res.status(200).json({ message: "Extensions updated successfully" });
  } catch (err) {
    console.error("Error updating extensions:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateExtn = async (req, res) => {
  try {
    const { newExtensionsData } = req.body;
    const updatedData = newExtensionsData.join("\n");
    await fs.promises.writeFile(extensionsFile, updatedData, "utf8");
    return res.status(200).json({ message: "Extensions updated successfully" });
  } catch (err) {
    console.error("Error updating extensions:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteExtn = async (req, res) => {
  try {
    await fs.promises.writeFile(extensionsFile, "", "utf8");
    return res
      .status(200)
      .json({ message: "Extensions data deleted successfully" });
  } catch (err) {
    console.error("Error deleting extensions data:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
