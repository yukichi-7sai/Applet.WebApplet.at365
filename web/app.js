const api = window.appletPage;
const $ = (selector) => document.querySelector(selector);
const form = $("#site-form");
const dialog = $("#editor");
let snapshot;
let accounts = [];
let editing = null;
let editingRevision = 0;
let editingItems = [];
let working = false;
let operations = Promise.resolve();
let discovery = 0;
const defaults = [
  {
    command: "reload",
    key: "F5",
    enabled: true,
    when: { scope: "owner", appletIds: [] },
  },
  {
    command: "back",
    key: "Alt+Left",
    enabled: true,
    when: { scope: "owner", appletIds: [] },
  },
  {
    command: "forward",
    key: "Alt+Right",
    enabled: true,
    when: { scope: "owner", appletIds: [] },
  },
];
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function button(text, action) {
  const node = element("button", text);
  node.type = "button";
  node.onclick = () => run(action);
  return node;
}
function run(action) {
  operations = operations
    .then(async () => {
      working = true;
      $("#message").textContent = "";
      try {
        await action();
      } catch (error) {
        $("#message").textContent = String(error.message ?? error);
      } finally {
        working = false;
        await refresh();
      }
    })
    .catch((error) => {
      $("#message").textContent = String(error.message ?? error);
    });
  return operations;
}
async function save(key, value, revision = snapshot.revision) {
  return api.call("settings.update", {
    key,
    value,
    expectedRevision: revision,
  });
}
async function refresh() {
  const next = await api.snapshot();
  if (snapshot && next.revision < snapshot.revision) return;
  snapshot = next;
  document.body.classList.toggle("dark", snapshot.dark);
  accounts = await api.call("webProfiles.list");
  renderSites();
  if (!$("#accounts").contains(document.activeElement)) renderAccounts();
  renderShortcuts();
}
function renderSites() {
  const items = snapshot.settings.items ?? [],
    revision = snapshot.revision;
  window.renderSettingsList("sites", "items", items, {
    onAdd: () => run(() => edit()),
    onEdit: (i) => run(() => edit(items[i])),
    onDelete: (i) => deleteSite(items[i]),
    onOrder: () => orderList("items", items),
    onToggle: (i) =>
      run(() =>
        save(
          "items",
          items.map((row, n) =>
            n === i ? { ...row, enabled: !row.enabled } : row,
          ),
          revision,
        ),
      ),
    onOpen: (i) =>
      run(async () => {
        const page = snapshot.collectionPages.find(
          (page) => page.itemId === items[i].id && page.key === "items",
        );
        if (!page) throw Error("ページの登録を待っています。");
        await api.call("pages.openItem", { id: page.id });
      }),
  });
}
function renderAccounts() {
  const target = $("#accounts");
  target.replaceChildren();
  if (!accounts.length)
    target.append(element("p", "アカウント枠がありません。"));
  for (const account of accounts) {
    const row = element("div", undefined, "row");
    const input = element("input");
    input.value = account.name;
    input.setAttribute("aria-label", `${account.name}の名前`);
    let composing = false;
    let queued = false;
    input.oncompositionstart = () => {
      composing = true;
    };
    input.oncompositionend = () => {
      composing = false;
      if (document.activeElement !== input) commit();
    };
    const commit = () => {
      if (
        composing ||
        queued ||
        !input.value.trim() ||
        input.value === account.name
      )
        return;
      queued = true;
      const name = input.value.trim();
      return run(async () => {
        try {
          await api.call("webProfiles.rename", { id: account.id, name });
          account.name = name;
        } finally {
          queued = false;
        }
      });
    };
    input.onblur = commit;
    input.onkeydown = (event) => {
      if (event.isComposing) return;
      if (event.key === "Enter") {
        event.preventDefault();
        commit();
      }
      if (event.key === "Escape") {
        input.value = account.name;
        event.preventDefault();
      }
    };
    const used = (snapshot.settings.items ?? []).filter(
      (item) => item.accountId === account.id,
    );
    const title = element("div");
    title.append(
      input,
      element(
        "small",
        used.length
          ? "使用中: " + used.map((item) => item.name).join("、")
          : "使用しているサイトはありません。",
      ),
    );
    const actions = element("div", undefined, "actions");
    const remove = button("枠を削除", () =>
      api.call("webProfiles.delete", { id: account.id }),
    );
    remove.disabled = used.length > 0;
    actions.append(
      button("ログイン情報をクリア", () =>
        api.call("webProfiles.clear", { id: account.id }),
      ),
      remove,
    );
    row.append(title, actions);
    target.append(row);
  }
}
function renderShortcuts() {
  const bindings = snapshot.settings.shortcutDefaults ?? defaults,
    revision = snapshot.revision;
  window.renderSettingsList("shortcuts", "shortcutDefaults", bindings, {
    onAdd: () => editShortcut(),
    onEdit: (i) => editShortcut(i),
    onDelete: (i) =>
      run(() =>
        save(
          "shortcutDefaults",
          bindings.filter((_, n) => n !== i),
          revision,
        ),
      ),
    onOrder: () => orderList("shortcutDefaults", bindings),
    onToggle: (i) =>
      run(() =>
        save(
          "shortcutDefaults",
          bindings.map((row, n) =>
            n === i ? { ...row, enabled: !row.enabled } : row,
          ),
          revision,
        ),
      ),
  });
}
let shortcutEdit;
function editShortcut(index = -1) {
  const before = structuredClone(
    snapshot.settings.shortcutDefaults ?? defaults,
  );
  const draft =
    index < 0
      ? {
          command: "open",
          key: "Ctrl+F5",
          enabled: true,
          when: { scope: "owner", appletIds: [] },
        }
      : before[index];
  shortcutEdit = { index, before, draft, revision: snapshot.revision };
  const form = $("#shortcut-form");
  form.reset();
  for (const key of ["command", "key"])
    form.elements.namedItem(key).value = draft[key];
  form.elements.namedItem("scope").value = draft.when?.scope ?? "owner";
  form.elements.namedItem("appletIds").value = (
    draft.when?.appletIds ?? []
  ).join("\n");
  form.elements.namedItem("enabled").checked = draft.enabled;
  $("#shortcut-title").textContent =
    index < 0 ? "割り当てを追加" : "割り当てを編集";
  $("#shortcut-error").textContent = "";
  $("#shortcut-editor").showModal();
}
let orderEdit;
function orderList(key, items) {
  orderEdit = {
    key,
    items: structuredClone(items),
    revision: snapshot.revision,
  };
  $("#order-error").textContent = "";
  renderOrder();
  $("#order-editor").showModal();
}
function renderOrder() {
  const target = $("#order-list");
  target.replaceChildren();
  let dragged;
  const move = (from, to) => {
    const [item] = orderEdit.items.splice(from, 1);
    orderEdit.items.splice(to, 0, item);
    renderOrder();
  };
  orderEdit.items.forEach((item, index) => {
    const row = element("li");
    row.draggable = true;
    row.ondragstart = () => {
      dragged = index;
    };
    row.ondragover = (e) => e.preventDefault();
    row.ondrop = (e) => {
      e.preventDefault();
      if (dragged !== undefined) move(dragged, index);
    };
    row.append(element("span", "⠿ " + (item.name ?? item.command) + " "));
    for (const [direction, label] of [
      [-1, "上へ"],
      [1, "下へ"],
    ]) {
      const b = element("button", direction < 0 ? "↑" : "↓");
      b.type = "button";
      b.setAttribute("aria-label", index + 1 + "番目を" + label);
      b.disabled =
        index + direction < 0 || index + direction >= orderEdit.items.length;
      b.onclick = () => move(index, index + direction);
      row.append(b);
    }
    target.append(row);
  });
}
let deleteEdit;
function deleteSite(item) {
  deleteEdit = {
    item,
    items: structuredClone(snapshot.settings.items ?? []),
    revision: snapshot.revision,
  };
  $("#delete-message").textContent =
    "「" + item.name + "」を削除します。アカウント枠とログイン情報は残ります。";
  $("#delete-error").textContent = "";
  $("#delete-editor").showModal();
}
function wireDialog(prefix, action) {
  const dialog = $("#" + prefix + "-editor"),
    saveButton = $("#" + prefix + "-save"),
    cancel = $("#" + prefix + "-cancel");
  cancel.onclick = () => dialog.close();
  const submit = async (event) => {
    event.preventDefault();
    if (saveButton.disabled || event.isComposing) return;
    saveButton.disabled = cancel.disabled = true;
    $("#" + prefix + "-error").textContent = "";
    try {
      await action();
      dialog.close();
      await refresh();
    } catch (error) {
      $("#" + prefix + "-error").textContent = String(error.message ?? error);
    } finally {
      saveButton.disabled = cancel.disabled = false;
    }
  };
  const form = dialog.querySelector("form");
  if (form) form.onsubmit = submit;
  else saveButton.onclick = submit;
  dialog.addEventListener("cancel", (e) => {
    if (saveButton.disabled) e.preventDefault();
  });
  dialog.addEventListener("keydown", (e) => {
    if (
      (e.isComposing || e.keyCode === 229) &&
      ["Enter", "Escape"].includes(e.key)
    )
      e.preventDefault();
  });
}
wireDialog("shortcut", async () => {
  const f = $("#shortcut-form").elements;
  const item = {
    ...shortcutEdit.draft,
    command: f.namedItem("command").value,
    key: f.namedItem("key").value.trim(),
    enabled: f.namedItem("enabled").checked,
    when: {
      scope: f.namedItem("scope").value,
      appletIds: f
        .namedItem("appletIds")
        .value.split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    },
  };
  const value =
    shortcutEdit.index < 0
      ? [...shortcutEdit.before, item]
      : shortcutEdit.before.map((row, i) =>
          i === shortcutEdit.index ? item : row,
        );
  await save("shortcutDefaults", value, shortcutEdit.revision);
});
wireDialog("order", () =>
  save(orderEdit.key, orderEdit.items, orderEdit.revision),
);
wireDialog("delete", () =>
  save(
    "items",
    deleteEdit.items.filter((row) => row.id !== deleteEdit.item.id),
    deleteEdit.revision,
  ),
);
function collect() {
  const data = new FormData(form);
  const start = new URL(String(data.get("url")).trim());
  if (
    !["https:", "http:"].includes(start.protocol) ||
    start.username ||
    start.password
  )
    throw Error("HTTP(S)のURLを指定してください。");
  const name = String(data.get("name")).trim();
  if (!name || name.length > 80 || /[\x00-\x1f\x7f]/.test(name))
    throw Error("名前は1～80文字で指定してください。");
  const allowedOrigins = String(data.get("allowedOrigins"))
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      const origin = new URL(value);
      if (
        !["https:", "http:"].includes(origin.protocol) ||
        origin.username ||
        origin.password ||
        origin.origin !== value
      )
        throw Error(
          "追加許可先はhttps://example.comのようなoriginで指定してください。",
        );
      return value;
    });
  return {
    ...editing,
    name,
    url: start.href,
    display: data.get("display"),
    navigation: data.get("navigation"),
    allowedOrigins,
    accountId: data.get("accountId"),
  };
}
async function edit(item) {
  if (!accounts.length) {
    await api.call("webProfiles.add", { name: "個人用" });
    await refresh();
  }
  editing = structuredClone(
    item ?? {
      id: `site.${crypto.randomUUID()}`,
      name: "新しいWebApplet",
      url: "https://example.com/",
      enabled: true,
      display: "page",
      navigation: "same-origin",
      allowedOrigins: [],
      accountId: accounts[0].id,
      icon: "",
    },
  );
  editingRevision = snapshot.revision;
  editingItems = structuredClone(snapshot.settings.items ?? []);
  $("#dialog-title").textContent = item ? "サイトを編集" : "サイトを追加";
  form.reset();
  $("#form-error").textContent = "";
  $("#discovery-message").textContent = "";
  const select = form.elements.namedItem("accountId");
  select.replaceChildren();
  for (const account of accounts) {
    const option = element("option", account.name);
    option.value = account.id;
    select.append(option);
  }
  for (const key of ["name", "url", "display", "navigation", "accountId"])
    form.elements.namedItem(key).value = editing[key];
  form.elements.namedItem("allowedOrigins").value =
    editing.allowedOrigins.join("\n");
  $("#icon-preview").src = editing.icon || "";
  dialog.showModal();
}
async function discover() {
  const sequence = ++discovery;
  let before;
  const inputUrl = form.elements.namedItem("url").value;
  $("#discover").disabled = true;
  try {
    before = collect();
    const result = await api.call("actions.invoke", {
      id: "discover",
      input: { url: before.url },
    });
    if (
      !dialog.open ||
      sequence !== discovery ||
      form.elements.namedItem("url").value !== inputUrl
    )
      return;
    if (result.iconBytes)
      result.icon = await api.call("images.normalize", {
        bytes: result.iconBytes,
      });
    if (
      !dialog.open ||
      sequence !== discovery ||
      form.elements.namedItem("url").value !== inputUrl
    )
      return;
    const previous = editing.imported ?? {};
    for (const key of ["name", "url", "navigation", "icon"]) {
      if (result[key] === undefined) continue;
      const current =
        key === "icon" ? editing.icon : form.elements.namedItem(key).value;
      if (current !== (key === "url" ? inputUrl : before[key])) continue;
      if (
        current === previous[key] ||
        (key === "name" && current === "新しいWebApplet") ||
        (key === "icon" && !current) ||
        (key === "url" && !previous.url) ||
        (key === "navigation" &&
          !previous.navigation &&
          current === "same-origin")
      ) {
        if (key === "icon") {
          editing.icon = result.icon;
          $("#icon-preview").src = result.icon;
        } else form.elements.namedItem(key).value = result[key];
      }
    }
    editing.imported = Object.fromEntries(
      ["name", "url", "navigation", "icon"]
        .filter((key) => result[key] !== undefined)
        .map((key) => [key, result[key]]),
    );
    $("#discovery-message").textContent = result.message;
  } catch (error) {
    $("#form-error").textContent = String(error.message ?? error);
  } finally {
    $("#discover").disabled = false;
  }
}
$("#add-account").onclick = () =>
  run(() => api.call("webProfiles.add", { name: "新しいアカウント" }));
$("#cancel").onclick = () => {
  discovery++;
  dialog.close();
};
$("#discover").onclick = discover;
$("#icon").onchange = async () => {
  try {
    const file = $("#icon").files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024)
      throw Error("画像は4MB以下にしてください。");
    editing.icon = await api.call("images.normalize", {
      bytes: [...new Uint8Array(await file.arrayBuffer())],
    });
    $("#icon-preview").src = editing.icon;
  } catch (error) {
    $("#form-error").textContent = String(error.message ?? error);
  }
};
form.onsubmit = async (event) => {
  event.preventDefault();
  if ($("#save").disabled) return;
  $("#save").disabled = true;
  $("#cancel").disabled = true;
  $("#form-error").textContent = "";
  try {
    const item = collect();
    const value = editingItems.some((row) => row.id === item.id)
      ? editingItems.map((row) => (row.id === item.id ? item : row))
      : [...editingItems, item];
    await save("items", value, editingRevision);
    discovery++;
    dialog.close();
    await refresh();
  } catch (error) {
    $("#form-error").textContent = String(error.message ?? error);
  } finally {
    $("#save").disabled = false;
    $("#cancel").disabled = false;
  }
};
dialog.addEventListener("cancel", (event) => {
  if ($("#save").disabled) event.preventDefault();
  else discovery++;
});
let pendingRefresh = false;
api.onChanged(() => {
  if (pendingRefresh || working) return;
  pendingRefresh = true;
  queueMicrotask(async () => {
    pendingRefresh = false;
    try {
      await refresh();
    } catch (error) {
      $("#message").textContent = String(error.message ?? error);
    }
  });
});
refresh().catch((error) => {
  $("#message").textContent = String(error.message ?? error);
});
