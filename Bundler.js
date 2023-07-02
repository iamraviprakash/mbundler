import path from "path";
import Module from "./Module.js";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

class Bundler {
  constructor({ entryFilePath, outputDirPath }) {
    this.entryFilePath = entryFilePath;
    this.outputDirPath = outputDirPath;
  }

  initialize() {
    this.createDependencyGraph();
  }

  createDependencyGraph() {
    // treat each file as module
    // start with entry file consider it as root module
    // then check what all modules its importing and then check what all modules those modules are importing and so on
    // prepare a map of all the modules and their dependencies
    const rootModule = new Module({ absoluteFilePath: this.entryFilePath });
    return rootModule;
  }
}

const bundler = new Bundler({
  entryFilePath: path.resolve(__dirname, "./index.js"),
  outputDirPath: "./dist",
});

bundler.initialize();
