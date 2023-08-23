const ivrHandler = (channel, parameterValue) => {
  const player = require(`./${parameterValue}`);
  log("Playing IVR:", parameterValue);
  player(channel);
};
module.exports = ivrHandler;
