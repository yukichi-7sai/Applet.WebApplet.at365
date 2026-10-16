const { getPublishDirectory } = require('../../AppDock.at365/scripts/publish-paths.cjs');
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const host = path.resolve(root, "../AppDock.at365");
const hostRequire = require("node:module").createRequire(
  path.join(host, "package.json"),
);
const packageFile = hostRequire.resolve("typescript/package.json");
const compiler = require(packageFile);
const result = require("node:child_process").spawnSync(
  process.execPath,
  [
    path.resolve(path.dirname(packageFile), compiler.bin.tsc),
    "-p",
    path.join(root, "tsconfig.json"),
  ],
  { cwd: root, stdio: "inherit", windowsHide: true },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
const destination = path.join(getPublishDirectory(root), "extensions/at365.web-applet");
fs.mkdirSync(path.join(destination, "web"), { recursive: true });
fs.writeFileSync(
  path.join(destination, "index.cjs"),
  fs
    .readFileSync(
      path.join(
        root,
        ".artifacts/compiled/Applet.WebApplet.at365/src/index.js",
      ),
      "utf8",
    )
    .replace('require("./metadata")', 'require("./metadata.cjs")'),
);
fs.copyFileSync(
  path.join(root, ".artifacts/compiled/Applet.WebApplet.at365/src/metadata.js"),
  path.join(destination, "metadata.cjs"),
);
fs.copyFileSync(
  path.join(root, "extension.json"),
  path.join(destination, "extension.json"),
);
for (const file of ["index.html", "app.js", "style.css"])
  fs.copyFileSync(
    path.join(root, "web", file),
    path.join(destination, "web", file),
  );
console.log(destination);
(async () => {
  const { pathToFileURL } = require("node:url");
  const { build } = await import(
    pathToFileURL(hostRequire.resolve("vite")).href
  );
  const { default: react } = await import(
    pathToFileURL(hostRequire.resolve("@vitejs/plugin-react")).href
  );
  await build({
    configFile: false,
    root,
    plugins: [react()],
    define: { "process.env.NODE_ENV": '"production"' },
    resolve: {
      alias: {
        "react-dom": path.join(host, "node_modules/react-dom"),
        react: path.join(host, "node_modules/react"),
      },
    },
    build: {
      outDir: path.join(destination, "web"),
      emptyOutDir: false,
      lib: {
        entry: path.join(root, "src/list-ui.tsx"),
        name: "AppletLists",
        formats: ["iife"],
        fileName: () => "lists.js",
        cssFileName: "lists",
      },
    },
  });
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
