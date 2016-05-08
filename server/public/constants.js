// constants.js
var Constants = (function() {
  var Constants = function() {
  };

  Constants.prototype.connection = "connection";
  Constants.prototype.closeConnection = "closeConnection";
  Constants.prototype.endGame = "endGame";
  Constants.prototype.counting = "counting";
  Constants.prototype.startGame = "startGame";
  Constants.prototype.logins = "logins";

  return Constants;
})();

module.exports = Constants;
