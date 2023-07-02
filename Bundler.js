import path from "path";
import Module from "./Module.js";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

class Bundler {
  constructor({ entryFilePath, outputDirPath }) {
    this.entryFilePath = entryFilePath;
    this.outputDirPath = outputDirPath;
  }
}

const bundler = new Bundler({
  entryFilePath: path.resolve(__dirname, "./index.js"),
  outputDirPath: "./dist",
});

bundler.initialize();
