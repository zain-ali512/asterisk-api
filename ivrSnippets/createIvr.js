import Client from "ari-client";
const log = console.log;

const connection = async () => {
  try {
    // Connect to asterisk
    const ari = await Client.connect("<HOST>", "<USERNAME>", "<PASSWORD>");

    // Event listeners
    ari.on("StasisStart", StasisStart);
    ari.on("StasisEnd", HangUpCall);

    // Start ARI
    ari.start("<STASIS_APP>");
    log("Connection Successful");
  } catch (e) {
    log("Connection error:", e);
  }
};

// Statis start function
const StasisStart = async (event, channel) => {
  try {
    log("Call received. Channel ID:", channel.id);

    // Answer call
    try {
      await channel.answer();
    } catch (error) {
      log("Error answering the call:", error.message);
    }
  } catch (e) {
    log("Error handling stasis event:", e);
  }
};

connection();
