const fs = require("fs");
const filePath = "/etc/asterisk/sip_gui.conf";

const parseSipDataFromFile = (data) => {
  const lines = data.split("\n\n");
  return lines
    .map((block) => {
      const properties = block.trim().split("\n");
      const sip = {};
      const sipIdLine = properties[0];
      const sipIdStartIndex = sipIdLine.indexOf("[") + 1;
      const sipIdEndIndex = sipIdLine.indexOf("]");
      const sipId = sipIdLine.substring(sipIdStartIndex, sipIdEndIndex);
      if (!sipId) {
        return null;
      }
      properties.slice(1).forEach((property) => {
        const [key, value] = property.split("=");
        if (key.trim() && value !== undefined) {
          sip[key.trim().toLowerCase()] = value.trim();
        }
      });
      return sip;
    })
    .filter(Boolean);
};

const stringifySipDataForFile = (sips) => {
  return sips
    .map((sip) => {
      const properties = Object.entries(sip)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
      return `[${sip.SIP_ID}]\n${properties}\n`;
    })
    .join("\n");
};

exports.getAllSip = async (req, res) => {
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const sips = parseSipDataFromFile(data);
      res.json(sips);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOneSip = async (req, res) => {
  const { sip_id } = req.params;
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const sips = parseSipDataFromFile(data);
      const sip = sips.find((sip) => sip.sip_id === sip_id);
      if (!sip) {
        return res.status(404).json({ error: "Sip not found" });
      }
      res.json(sip);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createSip = async (req, res) => {
  const newSipData = req.body;
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const sips = parseSipDataFromFile(data);
      for (const key in newSipData) {
        if (newSipData.hasOwnProperty(key) && newSipData[key] === undefined) {
          delete newSipData[key];
        }
      }
      const existingSip = sips.find((sip) => sip.sip_id === newSipData.sip_id);
      if (existingSip) {
        return res.status(400).json({ error: "SIP ID already exists" });
      }
      sips.push(newSipData);
      const newData = stringifySipDataForFile(sips);
      fs.writeFile(filePath, newData, (err) => {
        if (err) {
          console.error("Error writing data to file:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        console.log("Data appended to file successfully.");
        res.status(201).json(newSipData);
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateSip = async (req, res) => {
  const { sip_id } = req.params;
  const updatedSipData = req.body;
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const sips = parseSipDataFromFile(data);
      const sipIndex = sips.findIndex((sip) => sip.sip_id === sip_id);
      if (sipIndex === -1) {
        return res.status(404).json({ error: "Sip not found" });
      }
      sips[sipIndex] = { ...sips[sipIndex], ...updatedSipData };
      const newData = stringifySipDataForFile(sips);
      fs.writeFile(filePath, newData, (err) => {
        if (err) {
          console.error("Error writing data to file:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        console.log("Data updated in file successfully.");
        res.json(sips[sipIndex]);
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteSip = async (req, res) => {
  const { sip_id } = req.params;
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const sips = parseSipDataFromFile(data);
      const sipIndex = sips.findIndex((sip) => sip.sip_id === sip_id);
      if (sipIndex === -1) {
        return res.status(404).json({ error: "Sip not found" });
      }
      sips.splice(sipIndex, 1);
      const newData = stringifySipDataForFile(sips);
      fs.writeFile(filePath, newData, (err) => {
        if (err) {
          console.error("Error writing data to file:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        console.log("Data removed from file successfully.");
        res.json({ message: "Sip deleted successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
