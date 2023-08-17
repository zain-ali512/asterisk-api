const Client = require("ari-client");
const CallFlows = require("./models/callFlowsModel");
const log = console.log;

const connection = async () => {
  try {
    // Connect to asterisk
    const ari = await Client.connect(
      "http://localhost:9088",
      "asterisk",
      "asterisk"
    );

    // Event listeners
    ari.on("StasisStart", StasisStart);

    // Start ARI
    ari.start("ivr-by-zain");
    log("Connection Successful");
  } catch (e) {
    log("Connection error:", e);
  }
};

// Statis start function
const StasisStart = async (event, channel) => {
  try {
    log("Call received. Channel ID:", channel.id);

    // Extract number
    const destinationNumber = channel.dialplan.exten;
    log("Destination Number:", destinationNumber);

    // Function Check
    let item = await dbCheck(destinationNumber);

    if (item) {
      const { func, param } = item;
      //const functionName = item.function;
      //const parameterValue = item.parameter;
      log("Function:", func);
      log("Parameter:", param);
    } else {
      log("Number not found in database.");
    }
  } catch (e) {
    log("Error handling stasis event:", e);
  }
};

// Get function from database
const dbCheck = async (destinationNumber) => {
  try {
    const items = await CallFlows.findOne({
      where: {
        numbers: destinationNumber,
      },
    });
    return items;
  } catch (error) {
    console.error("Error retrieving items:", error);
    throw error;
  }
};
connection();
