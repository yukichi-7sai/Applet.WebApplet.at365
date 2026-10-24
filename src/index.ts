import { manifestDefaults } from "./metadata";

export async function activate() {}

function url(value: unknown) {
  if (
    typeof value !== "string" ||
    value.length > 4096 ||
    /[\x00-\x20\x7f]/.test(value)
  )
    throw Error("URLを確認してください。");
  const parsed = new URL(value);
  if (
    !["https:", "http:"].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password
  )
    throw Error("HTTP(S)のURLを指定してください。");
  return parsed;
}

async function resource(raw: string, origin: string, limit: number) {
  let current = url(raw);
  const signal = AbortSignal.timeout(5000);
  for (let redirect = 0; redirect <= 3; redirect++) {
    if (current.origin !== origin)
      throw Error("別originへの取得は許可されていません。");
    const response = await fetch(current, {
      redirect: "manual",
      credentials: "omit",
      signal,
    });
    if (response.status >= 300 && response.status < 400) {
      await response.body?.cancel();
      const location = response.headers.get("location");
      if (!location) throw Error("転送先がありません。");
      current = url(new URL(location, current).href);
      continue;
    }
    if (!response.ok || !response.body) throw Error("取得できませんでした。");
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      for (;;) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.length;
        if (size > limit) throw Error("取得上限を超えています。");
        chunks.push(part.value);
      }
    } finally {
      await reader.cancel();
    }
    return { bytes: Buffer.concat(chunks), url: current.href };
  }
  throw Error("転送が多すぎます。");
}

export async function onPageAction(
  action: string,
  input: Record<string, unknown>,
) {
  if (action !== "discover") throw Error("操作がありません。");
  const start = url(input.url);
  try {
    const html = await resource(start.href, start.origin, 256000);
    let manifestUrl: string | undefined;
    for (const tag of html.bytes
      .toString("utf8")
      .match(/<link\b[^>]{0,2048}>/gi) ?? []) {
      const attrs = Object.fromEntries(
        [
          ...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g),
        ].map((m) => [m[1].toLowerCase(), m[2] ?? m[3] ?? m[4]]),
      );
      if (
        (attrs.rel ?? "").toLowerCase().split(/\s+/).includes("manifest") &&
        attrs.href
      ) {
        manifestUrl = new URL(attrs.href.replaceAll("&amp;", "&"), html.url)
          .href;
        break;
      }
    }
    const resourceResult = await resource(
      manifestUrl ?? new URL("/.well-known/appdock.json", start).href,
      start.origin,
      64000,
    );
    const manifest = JSON.parse(resourceResult.bytes.toString("utf8"));
    const defaults = manifestDefaults(manifest, resourceResult.url, start.href);
    const { iconUrl, ...values } = defaults;
    const result: Record<string, unknown> = {
      ...values,
      message: "Web側の推奨設定を読み込みました。",
    };
    if (iconUrl) {
      try {
        const image = await resource(iconUrl, start.origin, 256000);
        const bytes = image.bytes;
        const png =
          bytes.length >= 24 &&
          bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
        const jpeg =
          bytes.length >= 3 &&
          bytes[0] === 255 &&
          bytes[1] === 216 &&
          bytes[2] === 255;
        if (png || jpeg) result.imageBytes = [...bytes];
      } catch {
        /* Optional icon failure does not discard validated metadata. */
      }
    }
    return result;
  } catch {
    return {
      message: "Web側の設定JSONを取得できませんでした。手動で設定できます。",
    };
  }
}
