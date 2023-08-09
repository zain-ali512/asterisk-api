let userInput = false;
let userInputWaiting = true;

CheckUserInput(channel);

DtmfInput(channel, async (digit) => {
  log("DTMF received, User pressed:", digit);
  log("Channel ID:", channel.id);
  userInput = false;
  switch (digit) {
    case 1:
      await Submenu(channel, "eng");
      break;
    case 2:
      await Submenu(channel, "urdu");
      break;
    default:
      await InvalidOption(channel);
      break;
  }
});

const InvalidOption = async (channel) => {
  await channel.play({
    media: "sound:/var/lib/asterisk/sounds/you-dialed-wrong-number",
  });
  await StasisStart(null, channel);
};

const DtmfInput = async (channel, callback) => {
  const DtmfReceived = async (event) => {
    userInput = true;
    userInputWaiting = false;
    const digit = parseInt(event.digit);
    channel.removeListener("ChannelDtmfReceived", DtmfReceived);
    await callback(digit);
    userInputWaiting = true;
  };
  channel.on("ChannelDtmfReceived", DtmfReceived);
};

// Wait for user input
const CheckUserInput = (channel) => {
  setTimeout(() => {
    if (userInput == false) {
      log("Waiting for user input");
      userInput = true;
      let count = 0;
      const intervalId = setInterval(() => {
        count++;
        console.log("Attempt:", count);
        if (userInputWaiting) {
          playSound(channel);
        }
        if (count === 3) {
          clearInterval(intervalId);
          if (userInputWaiting) {
            HangUpCall(channel);
          }
        }
      }, 5000);
    }
  }, 5000);
};
const playSound = async (channel) => {
  try {
    log("Playing try again sound");
    await channel.play({
      media: "sound:/var/lib/asterisk/sounds/pls-try-again",
    });
  } catch (e) {}
};
