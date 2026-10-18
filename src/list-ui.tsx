import { createRoot, type Root } from "react-dom/client";
import {
  SettingsListTable,
  ListIcon,
} from "../../AppDock.at365/src/renderer/settings-ui/SettingsListTable";
import type { SettingDefinition } from "../../AppDock.at365/src/shared/contracts";
import manifest from "../extension.json";
const roots = new Map<string, Root>();
(window as any).renderSettingsList = (
  target: string,
  key: string,
  entries: Record<string, unknown>[],
  callbacks: any,
) => {
  let root = roots.get(target);
  if (!root) {
    root = createRoot(document.getElementById(target)!);
    roots.set(target, root);
  }
  const definition = manifest.settings.find(
    (field) => field.key === key,
  ) as SettingDefinition;
  root.render(
    <SettingsListTable
      definition={definition}
      entries={entries}
      {...callbacks}
      extra={
        key === "items"
          ? (entry, index) => (
              <button
                type="button"
                className="settings-list-icon"
                title="開く"
                aria-label={`${entry.name}を開く`}
                disabled={!entry.enabled}
                onClick={() => callbacks.onOpen(index)}
              >
                <ListIcon kind="open" />
              </button>
            )
          : undefined
      }
    />,
  );
};
