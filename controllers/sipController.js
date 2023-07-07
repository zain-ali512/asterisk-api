const { Sip } = require("../models/sipModel");
const fs = require("fs");
const filePath = "/etc/asterisk/sip_gui.conf";

exports.getAllSip = async (req, res) => {
  try {
    const sips = await Sip.findAll();
    res.json(sips);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOneSip = async (req, res) => {
  const { ext_id } = req.params;
  try {
    const sip = await Sip.findByPk(ext_id);
    if (!sip) {
      return res.status(404).json({ error: "Sip not found" });
    }
    res.json(sip);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createSip = async (req, res) => {
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
    const newSip = await Sip.create({
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
    const newData = `[${newSip.SIP_ID}]\ndisallow=${newSip.DISALLOW}\nhost=${newSip.HOST}\nallow=${newSip.ALLOW}\ntype=${newSip.TYPE}\nsecret=${newSip.SECRET}\ndtmfmode=${newSip.DTMFMODE}\nqualify=${newSip.QUALIFY}\ncanreinvite=${newSip.CANREINVITE}\ninsecure=${newSip.INSECURE}\nnat=${newSip.NAT}\ndirectmedia=${newSip.DIRECTMEDIA}\ndirectrtpsetup=${newSip.DIRECTRTPSETUP}\ncontext=${newSip.CONTEXT}\n\n`;
    fs.appendFile(filePath, newData, (err) => {
      if (err) {
        console.error("Error appending data to file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      console.log("Data appended to file successfully.");
    });

    res.status(201).json(newSip);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateSip = async (req, res) => {
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
    const sip = await Sip.findByPk(ext_id);
    if (!sip) {
      return res.status(404).json({ error: "Sip not found" });
    }
    await sip.update({
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
        line.startsWith(`[${sip.SIP_ID}]`)
      );
      if (index === -1) {
        console.error("Sip data not found in file.");
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
    res.json(sip);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteSip = async (req, res) => {
  const { ext_id } = req.params;
  try {
    const sip = await Sip.findByPk(ext_id);
    if (!sip) {
      return res.status(404).json({ error: "Sip not found" });
    }
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const newData = data.replace(
        `[${sip.SIP_ID}]\ndisallow=${sip.DISALLOW}\nhost=${sip.HOST}\nallow=${sip.ALLOW}\ntype=${sip.TYPE}\nsecret=${sip.SECRET}\ndtmfmode=${sip.DTMFMODE}\nqualify=${sip.QUALIFY}\ncanreinvite=${sip.CANREINVITE}\ninsecure=${sip.INSECURE}\nnat=${sip.NAT}\ndirectmedia=${sip.DIRECTMEDIA}\ndirectrtpsetup=${sip.DIRECTRTPSETUP}\ncontext=${sip.CONTEXT}\n\n`,
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
    await sip.destroy();
    res.json({ message: "Sip deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
