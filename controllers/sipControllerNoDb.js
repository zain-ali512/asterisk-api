const fs = require("fs");
const filePath = "/etc/asterisk/sip_gui.conf";

// Parse the SIP data from the file
function parseSipDataFromFile(data) {
  const lines = data.split("\n\n");
  return lines
    .map((block) => {
      const properties = block.split("\n");
      const sip = {};
      const sipIdLine = properties[0];
      const sipIdStartIndex = sipIdLine.indexOf("[") + 1;
      const sipIdEndIndex = sipIdLine.indexOf("]");
      sip["SIP_ID"] = sipIdLine.substring(sipIdStartIndex, sipIdEndIndex);
      if (!sip["SIP_ID"]) {
        return null;
      }
      properties.slice(1).forEach((property) => {
        const [key, value] = property.split("=");
        sip[key.toLowerCase()] = value;
      });
      return sip;
    })
    .filter(Boolean); // Remove any null entries (empty blocks)
}

// Convert the SIP data to string format for writing to the file
function stringifySipDataForFile(sips) {
  return sips
    .map((sip) => {
      const properties = Object.entries(sip)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
      return `[${sip.SIP_ID}]\n${properties}\n`;
    })
    .join("\n");
}

exports.getAllSip = async (req, res) => {
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      // Parse the data from the file and respond with it
      const sips = parseSipDataFromFile(data);
      res.json(sips);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOneSip = async (req, res) => {
  const { ext_id } = req.params;
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const sips = parseSipDataFromFile(data);
      const sip = sips.find((sip) => sip.SIP_ID === ext_id);
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
  // Assuming the request body has the necessary properties for creating a new SIP entry
  const newSipData = req.body;
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      // Parse the existing data and add the new entry to it
      const sips = parseSipDataFromFile(data);
      sips.push(newSipData);
      const newData = stringifySipDataForFile(sips);

      // Write the updated data back to the file
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
  const { ext_id } = req.params;
  const updatedSipData = req.body;
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const sips = parseSipDataFromFile(data);
      const sipIndex = sips.findIndex((sip) => sip.SIP_ID === ext_id);
      if (sipIndex === -1) {
        return res.status(404).json({ error: "Sip not found" });
      }

      // Update the SIP entry in the array
      sips[sipIndex] = { SIP_ID: ext_id, ...updatedSipData };
      const newData = stringifySipDataForFile(sips);

      // Write the updated data back to the file
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
  const { ext_id } = req.params;
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data from file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const sips = parseSipDataFromFile(data);
      const sipIndex = sips.findIndex((sip) => sip.SIP_ID === ext_id);
      if (sipIndex === -1) {
        return res.status(404).json({ error: "Sip not found" });
      }

      // Remove the SIP entry from the array
      sips.splice(sipIndex, 1);
      const newData = stringifySipDataForFile(sips);

      // Write the updated data back to the file
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
