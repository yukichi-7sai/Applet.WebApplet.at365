const fs = require("node:fs"),
  path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  getPublishDirectory,
} = require("../../AppDock.at365/scripts/publish-paths.cjs");
const root = path.resolve(__dirname, ".."),
  host = path.resolve(root, "../AppDock.at365");
const hostRequire = require("node:module").createRequire(
  path.join(host, "package.json"),
);
const compilerFile = hostRequire.resolve("typescript/package.json"),
  compiler = require(compilerFile);
const result = spawnSync(
  process.execPath,
  [
    path.resolve(path.dirname(compilerFile), compiler.bin.tsc),
    "-p",
    path.join(root, "tsconfig.json"),
  ],
  { cwd: root, stdio: "inherit", windowsHide: true },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
const destination = path.join(
  getPublishDirectory(root),
  "extensions/at365.web-applet",
);
fs.mkdirSync(path.join(destination, "licenses"), { recursive: true });
const compiled = path.join(
  root,
  ".artifacts/compiled/Applet.WebApplet.at365/src",
);
fs.writeFileSync(
  path.join(destination, "index.cjs"),
  fs
    .readFileSync(path.join(compiled, "index.js"), "utf8")
    .replace('require("./metadata")', 'require("./metadata.cjs")'),
);
fs.copyFileSync(
  path.join(compiled, "metadata.js"),
  path.join(destination, "metadata.cjs"),
);
fs.copyFileSync(
  path.join(root, "extension.json"),
  path.join(destination, "extension.json"),
);
fs.copyFileSync(
  path.join(root, "LICENSE"),
  path.join(destination, "licenses/applet-webapplet.txt"),
);
// Only obsolete generated manager assets are removed; unknown files are retained.
for (const relative of [
  "web/index.html",
  "web/app.js",
  "web/style.css",
  "web/lists.js",
  "web/lists.css",
  "licenses/fluid-functionalism.txt",
]) {
  const target = path.resolve(destination, relative);
  if (!target.startsWith(path.resolve(destination) + path.sep))
    throw Error("Invalid generated asset path");
  for (
    let current = path.dirname(target);
    current.length >= destination.length;
    current = path.dirname(current)
  ) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink())
      throw Error("Generated asset directory must not be a link");
    if (current === destination) break;
  }
  if (fs.existsSync(target)) fs.unlinkSync(target);
}
const oldWeb = path.join(destination, "web");
if (fs.existsSync(oldWeb) && fs.readdirSync(oldWeb).length === 0)
  fs.rmdirSync(oldWeb);
console.log(destination);
