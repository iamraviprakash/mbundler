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
    const dependencyGraph = this.createDependencyGraph();
    const outputFiles = this.bundleDependencyGraph({ graph: dependencyGraph });

    for (const outputFile of outputFiles) {
      fs.writeFileSync(
        path.join(this.outputDirPath, outputFile.name),
        outputFile.content,
        "utf-8"
      );
    }
  }

  createDependencyGraph() {
    // treat each file as module
    // start with entry file consider it as root module
    // then check what all modules its importing and then check what all modules those modules are importing and so on
    // prepare a map of all the modules and their dependencies
    const rootModule = new Module({ absoluteFilePath: this.entryFilePath });
    return rootModule;
  }

  bundleDependencyGraph({ graph }) {
    const moduleMap = this.createModuleMap({ graph });
    const moduleMapWithRuntime = this.addRuntime({ moduleMap });

    return moduleMapWithRuntime;
  }

  createModuleMap({ graph }) {}

  addRuntime({ moduleMap, entryFilePath }) {
    return ```
      const moduleMap = ${moduleMap};
      const entryFilePath = ${entryFilePath};

      const bundlerStart = ({ moduleMap, entryFilePath }) => {
        const moduleCache = {};
        function require({ modulePath }) {
          if (moduleCache[modulePath]) {
            return moduleCache[modulePath];
          }

          const exports = {};
          moduleCache[modulePath] = exports;

          moduleMap[modulePath]({ exports, require });

          return moduleCache[modulePath];
        }

        require({ modulePath: entryFilePath });
      };

      bundlerStart({ moduleMap, entryFilePath });
    ```;
  }
}

const bundler = new Bundler({
  entryFilePath: path.resolve(__dirname, "./index.js"),
  outputDirPath: "./dist",
});

bundler.initialize();
