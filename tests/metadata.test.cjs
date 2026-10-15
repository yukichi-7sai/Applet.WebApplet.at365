const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  manifestDefaults,
} = require("../publish/extensions/at365.web-applet/metadata.cjs");
const account = { id: "account.fixture" };
const item = { url: "https://app.example.com/start" };
test("Remote manifest defaults cannot set account, commands, arbitrary permissions or broaden origins", () => {
  const raw = {
    name: "アプリ",
    start_url: "/app/",
    icons: [{ src: "/icon.png" }],
    appdock: {
      schemaVersion: 1,
      navigation: "any",
      accountId: account.id,
      commands: ["run.exe"],
    },
    extensions: { "at365.gmail": { enabled: false } },
  };
  const defaults = manifestDefaults(
    raw,
    "https://app.example.com/manifest.json",
    item.url,
  );
  assert.equal(defaults.name, "アプリ");
  assert.equal(defaults.url, "https://app.example.com/app/");
  assert.equal(defaults.iconUrl, "https://app.example.com/icon.png");
  assert.equal(defaults.navigation, undefined);
  assert.equal(defaults.accountId, undefined);
  assert.equal(defaults.extensions, undefined);
  assert.throws(() =>
    manifestDefaults(raw, "https://other.example.com/manifest.json", item.url),
  );
  assert.equal(
    manifestDefaults(
      { ...raw, start_url: "https://other.example.com/" },
      "https://app.example.com/manifest.json",
      item.url,
    ).url,
    undefined,
  );
  assert.equal(
    manifestDefaults(
      { ...raw, appdock: { schemaVersion: 1, navigation: "none" } },
      "https://app.example.com/m",
      item.url,
    ).navigation,
    "none",
  );
  assert.throws(() =>
    manifestDefaults(
      { ...raw, appdock: { schemaVersion: 99 } },
      "https://app.example.com/m",
      item.url,
    ),
  );
});
