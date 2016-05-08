// constants.js
var Constants = (function() {
  var Constants = function() {
  };

  Constants.prototype.connection = "connection";
  Constants.prototype.closeConnection = "closeConnection";
  Constants.prototype.endGame = "endGame";
  Constants.prototype.counting = "counting";

  return Constants;
})();

module.exports = Constants;
