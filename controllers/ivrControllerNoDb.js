const fs = require("fs").promises;
const path = require("path");
const filePath = path.join(__dirname, "../IVR/ivr-client.js");

const readFile = async (file) => {
  try {
    const data = await fs.readFile(file, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading file:", err);
    throw err;
  }
};

exports.getIvr = async (req, res) => {
  try {
    const data = await readFile(filePath);
    res.json({ file: data });
  } catch (err) {
    res.status(500).json({ error: "Error reading file." });
  }
};

exports.createIvr = async (req, res) => {
  const { host, username, password, stasis } = req.body;
  if (!stasis) return res.status(400).json({ error: "Define stasis app" });
  const code = await readFile(
    path.join(__dirname, "../ivrSnippets/createIvr.js")
  );
  if (!code) return res.status(400).json({ error: "Cannot read data" });
  const newCode = code
    .replace("<HOST>", host)
    .replace("<USERNAME>", username)
    .replace("<PASSWORD>", password)
    .replace("<STASIS_APP>", stasis);
  fs.writeFile(filePath, newCode, "utf8");
  res.status(200).json({ code: code });
};
