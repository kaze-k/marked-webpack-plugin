import path from "path"
import MarkedWebpackPlugin from "../dist"

const isProduction = process.env.NODE_ENV == "production"

const config = {
  entry: path.resolve(__dirname, "./index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new MarkedWebpackPlugin({
      input: path.resolve(__dirname, "./CHANGELOG.md"),
      // input: path.resolve(__dirname, "./CHANGELOGS.md"),
      output: "CHANGELOG.html",
    })
  ],
}

export default () => {
  if (isProduction) {
    config.mode = "production"
  } else {
    config.mode = "development"
  }
  return config
}
