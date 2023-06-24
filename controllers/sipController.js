const { Sip } = require("../models/sipModel");
const fs = require("fs");
const filePath = "/etc/asterisk/sip_gui.conf";

exports.getAllExtn = async (req, res) => {
  try {
    const extensions = await Sip.findAll();
    res.json(extensions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOneExtn = async (req, res) => {
  const { ext_id } = req.params;
  try {
    const extension = await Sip.findByPk(ext_id);
    if (!extension) {
      return res.status(404).json({ error: "Extension not found" });
    }
    res.json(extension);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createExtn = async (req, res) => {
  const {
    SIP_ID,
    DISALLOW,
    HOST,
    ALLOW,
    TYPE,
    SECRET,
    DTMFMODE,
    QUALIFY,
    CANREINVITE,
    INSECURE,
    NAT,
    DIRECTMEDIA,
    DIRECTRTPSETUP,
    CONTEXT,
  } = req.body;
  try {
    const newExtension = await Sip.create({
      SIP_ID,
      DISALLOW,
      HOST,
      ALLOW,
      TYPE,
      SECRET,
      DTMFMODE,
      QUALIFY,
      CANREINVITE,
      INSECURE,
      NAT,
      DIRECTMEDIA,
      DIRECTRTPSETUP,
      CONTEXT,
    });
    const newData = `[${newExtension.SIP_ID}]\ndisallow=${newExtension.DISALLOW}\nhost=${newExtension.HOST}\nallow=${newExtension.ALLOW}\ntype=${newExtension.TYPE}\nsecret=${newExtension.SECRET}\ndtmfmode=${newExtension.DTMFMODE}\nqualify=${newExtension.QUALIFY}\ncanreinvite=${newExtension.CANREINVITE}\ninsecure=${newExtension.INSECURE}\nnat=${newExtension.NAT}\ndirectmedia=${newExtension.DIRECTMEDIA}\ndirectrtpsetup=${newExtension.DIRECTRTPSETUP}\ncontext=${newExtension.CONTEXT}\n\n`;
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
  const {
    DISALLOW,
    HOST,
    ALLOW,
    TYPE,
    SECRET,
    DTMFMODE,
    QUALIFY,
    CANREINVITE,
    INSECURE,
    NAT,
    DIRECTMEDIA,
    DIRECTRTPSETUP,
    CONTEXT,
  } = req.body;
  try {
    const extension = await Sip.findByPk(ext_id);
    if (!extension) {
      return res.status(404).json({ error: "Extension not found" });
    }
    await extension.update({
      DISALLOW,
      HOST,
      ALLOW,
      TYPE,
      SECRET,
      DTMFMODE,
      QUALIFY,
      CANREINVITE,
      INSECURE,
      NAT,
      DIRECTMEDIA,
      DIRECTRTPSETUP,
      CONTEXT,
    });
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const lines = data.split("\n");
      const index = lines.findIndex((line) =>
        line.startsWith(`[${extension.SIP_ID}]`)
      );
      if (index === -1) {
        console.error("Extension data not found in file.");
        return res.status(500).json({ error: "Internal server error" });
      }
      lines[index + 1] = `disallow=${DISALLOW}`;
      lines[index + 2] = `host=${HOST}`;
      lines[index + 3] = `allow=${ALLOW}`;
      lines[index + 4] = `type=${TYPE}`;
      lines[index + 5] = `secret=${SECRET}`;
      lines[index + 6] = `dtmfmode=${DTMFMODE}`;
      lines[index + 7] = `qualify=${QUALIFY}`;
      lines[index + 8] = `canreinvite=${CANREINVITE}`;
      lines[index + 9] = `insecure=${INSECURE}`;
      lines[index + 10] = `nat=${NAT}`;
      lines[index + 11] = `directmedia=${DIRECTMEDIA}`;
      lines[index + 12] = `directrtpsetup=${DIRECTRTPSETUP}`;
      lines[index + 13] = `context=${CONTEXT}`;
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
    const extension = await Sip.findByPk(ext_id);
    if (!extension) {
      return res.status(404).json({ error: "Extension not found" });
    }
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const newData = data.replace(
        `[${extension.SIP_ID}]\ndisallow=${extension.DISALLOW}\nhost=${extension.HOST}\nallow=${extension.ALLOW}\ntype=${extension.TYPE}\nsecret=${extension.SECRET}\ndtmfmode=${extension.DTMFMODE}\nqualify=${extension.QUALIFY}\ncanreinvite=${extension.CANREINVITE}\ninsecure=${extension.INSECURE}\nnat=${extension.NAT}\ndirectmedia=${extension.DIRECTMEDIA}\ndirectrtpsetup=${extension.DIRECTRTPSETUP}\ncontext=${extension.CONTEXT}\n\n`,
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
