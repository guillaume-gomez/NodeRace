// constants.js
var Constants = (function() {
  var Constants = function() {
  };

  Constants.prototype.connection = "connection";
  Constants.prototype.closeConnection = "closeConnection";
  Constants.prototype.endGame = "endGame";
  Constants.prototype.counting = "counting";
  Constants.prototype.startGame = "startGame";
  Constants.prototype.login = "login";
  Constants.prototype.logins = "logins";
  Constants.prototype.ping = "ping";
  Constants.prototype.trackPosition = "trackPosition";
  Constants.prototype.gameDisconnect = "gameDisconnect";
  Constants.prototype.myPosition = "myPosition";
  Constants.prototype.position = "position";
  Constants.prototype.isExist = "isExist";
  Constants.prototype.closeCo = "closeCo";
  Constants.prototype.disconnection = "disconnection";
  Constants.prototype.instanceDisconnection = "instanceDisconnection";
  Constants.prototype.infoPart = "infoPart";
  Constants.prototype.id = "id";
  Constants.prototype.error = "error";
  Constants.prototype.disconnect = "disconnect";

  Constants.prototype.acceleration = "acceleration";

  Constants.prototype.switchTrack = "switchTrack";

  Constants.prototype.message = "message";
  Constants.prototype.oldMessages = "oldMessages";

  Constants.prototype.serverMessage = "serverMessage";

  return Constants;
})();

module.exports = Constants;
