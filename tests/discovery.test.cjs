const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  onPageAction,
} = require("../publish/extensions/at365.web-applet/index.cjs");
test("discovery uses anonymous bounded same-origin requests and validates redirects", async (t) => {
  const original = global.fetch;
  t.after(() => {
    global.fetch = original;
  });
  const calls = [];
  global.fetch = async (value, options) => {
    const url = String(value);
    calls.push(url);
    assert.equal(options.credentials, "omit");
    assert.equal(options.redirect, "manual");
    assert.ok(options.signal);
    if (url.endsWith("/"))
      return new Response('<link rel="manifest" href="/manifest.json">');
    if (url.endsWith("/manifest.json"))
      return new Response(
        JSON.stringify({
          short_name: "Test",
          start_url: "/start",
          appdock: { navigation: "none" },
        }),
      );
    throw Error("unexpected");
  };
  const result = await onPageAction("discover", {
    url: "https://example.test/",
  });
  assert.equal(result.name, "Test");
  assert.equal(result.url, "https://example.test/start");
  assert.equal(result.navigation, "none");
  assert.equal(calls.length, 2);
  global.fetch = async (value) => {
    calls.push(String(value));
    return new Response("", {
      status: 302,
      headers: { location: "https://outside.test/" },
    });
  };
  calls.length = 0;
  const blocked = await onPageAction("discover", {
    url: "https://example.test/",
  });
  assert.equal(blocked.name, undefined);
  assert.deepEqual(calls, ["https://example.test/"]);
  global.fetch = async () => new Response("x".repeat(256001));
  const oversized = await onPageAction("discover", {
    url: "https://example.test/",
  });
  assert.equal(oversized.name, undefined);
  await assert.rejects(
    onPageAction("discover", { url: "https://user:secret@example.test/" }),
  );
});
