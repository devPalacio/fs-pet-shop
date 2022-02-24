routes = {
  "/pets": function (req, res) {
    res.end("You're SPECIAL");
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(petData));
  },

  "/non-special-message": function (req, res) {
    res.end("You're boring!");
  },
};

module.exports = routes;
