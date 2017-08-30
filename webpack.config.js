var path = require("path")

module.exports = {
  entry: {
    app: ["./renderer.js"]
  },
  output: {
    path: path.resolve(__dirname, "/"),
    publicPath: "/",
    filename: "renderer.js"
  }
};