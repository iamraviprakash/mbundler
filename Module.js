import path from "path";
import fs from "fs";
import babel from "@babel/core";

class Module {
  constructor({ absoluteFilePath }) {
    this.filePath = absoluteFilePath;
    this.content = fs.readFileSync(this.filePath, "utf-8");
    this.ast = babel.parseSync(this.content);
    this.dependencies = this.findDependencies();
  }

  findDependencies() {
    return this.ast.program.body
      .filter((node) => node.type === "ImportDeclaration")
      .map((node) => node.source.value)
      .map((relativeDependencyFilePath) =>
        this.getAbsolutePath({
          relativeFilePath: relativeDependencyFilePath,
        })
      )
      .map(
        (absoluteDependencyFilePath) =>
          new Module({ absoluteFilePath: absoluteDependencyFilePath })
      );
  }

  getAbsolutePath(relativeFilePath) {
    console.log({
      filePath: this.filePath,
    });
    return path.join(path.dirname(this.filePath), relativeFilePath);
  }
}

export default Module;
