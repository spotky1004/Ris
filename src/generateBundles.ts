import fs from "fs";
import path from "path";
import getPath from "./util/getPath.js";

const { __dirname } = getPath(import.meta.url);

function mkdir(dirPath: string) {
  const dirExists = fs.existsSync(dirPath);
  if (dirExists) return;
  fs.mkdirSync(dirPath);
}
function clearDir(dirPath: string) {
  const dirExists = fs.existsSync(dirPath);
  if (!dirExists) return;
  for (const file of fs.readdirSync(dirPath)) {
    fs.unlinkSync(path.join(dirPath, file));
  }
}

function createBundle(bundleName: string) {
  const dataPath = path.join(__dirname, "../src/data/" + `${bundleName}s`);
  const bundlesPath = path.join(__dirname, "../src/bundles");
  const bundlePath = path.join(bundlesPath, "./" + bundleName);
  
  mkdir(bundlePath);
  clearDir(bundlePath);

  const dataSectionFolders = fs.readdirSync(dataPath).filter(f => !f.endsWith(".ts"));
  const sectionDatas: [path: string, name: string][] = [];
  for (const section of dataSectionFolders) {
    const dataSectionPath = path.join(dataPath, section);
    
    let content = "";
    for (const file of fs.readdirSync(dataSectionPath)) {
      const filePath = path.join(dataSectionPath, file);
      let importName = file.slice(0, -3);
      importName = importName[0].toUpperCase() + importName.slice(1);
      const importLine = `export { default as ${importName} } from "${path.relative(bundlePath, filePath.slice(0, -3) + ".js").replace(/\\/g, "/")}";`;
      content += importLine + "\n";
    }
    const dataSectionFilePath = path.join(bundlePath, section + ".ts");
    fs.writeFileSync(dataSectionFilePath, content);
    sectionDatas.push([dataSectionFilePath, section]);
  }

  const bundleFilePath = path.join(bundlesPath, bundleName + ".ts");
  let bundleImportContent = "";
  let bundleExportContent = "export default {\n";
  for (const [filePath, name] of sectionDatas) {
    bundleImportContent += `import * as ${name} from "${"./" + path.relative(bundlesPath, filePath.slice(0, -3) + ".js").replace(/\\/g, "/")}";\n`;
    bundleExportContent += `  ${name},\n`;
  }
  bundleExportContent += `};\n`;
  let bundleContent = bundleImportContent + "\n" + bundleExportContent;
  fs.writeFileSync(bundleFilePath, bundleContent);
}

createBundle("item");
createBundle("placeable");
