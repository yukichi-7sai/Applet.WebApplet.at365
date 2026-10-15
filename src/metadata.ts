const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
function webUrl(value: string) {
  const u = new URL(value);
  if (!["http:", "https:"].includes(u.protocol) || u.username || u.password)
    throw Error("Invalid URL");
  return u.href;
}
function webProfileName(value: unknown) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > 80 ||
    /[\x00-\x1f\x7f]/.test(value)
  )
    throw Error("Invalid name");
  return value.trim();
}
/** Remote JSON supplies a bounded set of defaults, never host settings or permissions. */
export function manifestDefaults(
  raw: unknown,
  manifestUrl: string,
  pageUrl: string,
): { name?: string; url?: string; navigation?: string; source?: string } & {
  iconUrl?: string;
} {
  if (!object(raw))
    throw Error("Web側の設定JSONがオブジェクトではありません。");
  const origin = new URL(pageUrl).origin;
  if (new URL(webUrl(manifestUrl)).origin !== origin)
    throw Error("設定JSONは同じoriginから取得してください。");
  const sameUrl = (v: unknown) => {
    if (typeof v !== "string") return undefined;
    const u = new URL(v, manifestUrl);
    return webUrl(u.href) && u.origin === origin ? u.href : undefined;
  };
  const result: {
    name?: string;
    url?: string;
    navigation?: string;
    source?: string;
  } & { iconUrl?: string } = {
    source: manifestUrl,
  };
  if (typeof raw.short_name === "string" || typeof raw.name === "string")
    result.name = webProfileName(raw.short_name ?? raw.name);
  result.url = sameUrl(raw.start_url);
  if (Array.isArray(raw.icons))
    for (const i of raw.icons) {
      if (object(i)) {
        const u = sameUrl(i.src);
        if (u) {
          result.iconUrl = u;
          break;
        }
      }
    }
  if (object(raw.appdock)) {
    if (
      raw.appdock.schemaVersion !== undefined &&
      raw.appdock.schemaVersion !== 1
    )
      throw Error("Web側の設定JSONの版に対応していません。");
    if (["none", "same-origin"].includes(String(raw.appdock.navigation)))
      result.navigation = raw.appdock.navigation as "none" | "same-origin";
  }
  return result;
}
