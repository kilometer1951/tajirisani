var authFunctions = {};

//capitalize first words
authFunctions.capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

authFunctions.removeWhiteSpace = function(string) {
  return string.replace(/\s+/g, "");
};

module.exports = authFunctions;
