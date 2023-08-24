const queueHandler = async (channel, parameterValue) => {
  try {
    log("Connecting to queue");
    await channel.continueInDialplan({
      context: parameterValue,
      extension: "s",
      priority: 1,
    });
  } catch (error) {
    log("Error handling queue:", error);
  }
};
module.exports = queueHandler;
