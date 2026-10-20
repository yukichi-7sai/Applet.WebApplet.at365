import { createRoot, type Root } from "react-dom/client";
import {
  SettingsListTable,
  ListIcon,
} from "../../AppDock.at365/src/renderer/settings-ui/SettingsListTable";
import type { SettingDefinition } from "../../AppDock.at365/src/shared/contracts";
import manifest from "../extension.json";
import { RegisteredImagesProvider } from "../../AppDock.at365/src/renderer/settings-ui/RegisteredImagePicker";
import type { ImageLibraryApi } from "../../AppDock.at365/src/shared/registered-images";
const bridge = (window as any).appletPage;
const images: ImageLibraryApi = {
  snapshot: () => bridge.call("registeredImages.snapshot"),
  preview: (image) => bridge.call("registeredImages.preview", { image }),
  pick: (current) => bridge.call("registeredImages.pick", { current }),
  register: async () => {
    throw Error("画像の選択画面から登録してください。");
  },
  edit: async () => {
    throw Error("グループは本体の画像ライブラリーで編集してください。");
  },
  onChanged: (callback) => bridge.onChanged(callback),
};
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
    <RegisteredImagesProvider api={images}>
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
      />
    </RegisteredImagesProvider>,
  );
};
