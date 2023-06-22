const { Extension } = require("../models/extensionsModel");
const fs = require("fs");
const filePath = "/etc/asterisk/sip_gui.conf";

exports.getAllExtn = async (req, res) => {
  try {
    const extensions = await Extension.findAll();
    res.json(extensions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOneExtn = async (req, res) => {
  const { ext_id } = req.params;
  try {
    const extension = await Extension.findByPk(ext_id);
    if (!extension) {
      return res.status(404).json({ error: "Extension not found" });
    }
    res.json(extension);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createExtn = async (req, res) => {
  const { EXT_ID, TYPE, HOST, SECRET, CONTEXT } = req.body;
  try {
    const newExtension = await Extension.create({
      EXT_ID,
      TYPE,
      HOST,
      SECRET,
      CONTEXT,
    });
    const newData = `[${newExtension.EXT_ID}]\ntype=${newExtension.TYPE}\nhost=${newExtension.HOST}\nsecret=${newExtension.SECRET}\ncontext=${newExtension.CONTEXT}\n\n`;
    fs.appendFile(filePath, newData, (err) => {
      if (err) {
        console.error("Error appending data to file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      console.log("Data appended to file successfully.");
    });

    res.status(201).json(newExtension);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateExtn = async (req, res) => {
  const { ext_id } = req.params;
  const { TYPE, HOST, SECRET, CONTEXT } = req.body;
  try {
    const extension = await Extension.findByPk(ext_id);
    if (!extension) {
      return res.status(404).json({ error: "Extension not found" });
    }
    await extension.update({ TYPE, HOST, SECRET, CONTEXT });
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const lines = data.split("\n");
      const index = lines.findIndex((line) =>
        line.startsWith(`[${extension.EXT_ID}]`)
      );
      if (index === -1) {
        console.error("Extension data not found in file.");
        return res.status(500).json({ error: "Internal server error" });
      }
      lines[index + 1] = `type=${TYPE}`;
      lines[index + 2] = `host=${HOST}`;
      lines[index + 3] = `secret=${SECRET}`;
      lines[index + 4] = `context=${CONTEXT}`;
      const newData = lines.join("\n");
      fs.writeFile(filePath, newData, (err) => {
        if (err) {
          console.error("Error writing data to file:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        console.log("Data updated in file successfully.");
      });
    });
    res.json(extension);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteExtn = async (req, res) => {
  const { ext_id } = req.params;
  try {
    const extension = await Extension.findByPk(ext_id);
    if (!extension) {
      return res.status(404).json({ error: "Extension not found" });
    }
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const newData = data.replace(
        `[${extension.EXT_ID}]\ntype=${extension.TYPE}\nhost=${extension.HOST}\nsecret=${extension.SECRET}\ncontext=${extension.CONTEXT}\n\n`,
        ""
      );
      fs.writeFile(filePath, newData, (err) => {
        if (err) {
          console.error("Error writing data to file:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        console.log("Data removed from file successfully.");
      });
    });
    await extension.destroy();
    res.json({ message: "Extension deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
