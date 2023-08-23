const Client = require("ari-client");
const CallFlows = require("./models/callFlowsModel");
const log = console.log;
const ivrHandler = require("./ivrPlayers/ivrHandler");
const queueHandler = require("./callQueues/queueHandler");

const connection = async () => {
  try {
    const ari = await Client.connect(
      "http://localhost:9088",
      "asterisk",
      "asterisk"
    );
    ari.on("StasisStart", handleStasisStart);
    ari.start("ivr-by-zain");
    log("Connection Successful");
  } catch (error) {
    log("Connection error:", error);
  }
};

const handleStasisStart = async (event, channel) => {
  try {
    log("Call received. Channel ID:", channel.id);

    const destinationNumber = channel.dialplan.exten;
    log("Destination Number:", destinationNumber);

    const item = await dbCheck(destinationNumber);

    if (item) {
      const functionName = item.function;
      const parameterValue = item.parameter;
      log("Function:", functionName);
      log("Parameter:", parameterValue);

      if (functionName === "IVR") {
        ivrHandler(channel, parameterValue);
      } else if (functionName === "DIAL") {
        queueHandler(channel, parameterValue);
      } else {
        log("No function provided against the dialed number.");
      }
    } else {
      log("Number not found in database.");
    }
  } catch (error) {
    log("Error handling stasis event:", error);
  }
};

const dbCheck = async (destinationNumber) => {
  try {
    const item = await CallFlows.findOne({
      where: {
        numbers: destinationNumber,
      },
    });
    return item;
  } catch (error) {
    console.error("Error retrieving items:", error);
    throw error;
  }
};

connection();
