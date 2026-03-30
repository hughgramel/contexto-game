import { configureObservablePersistence } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

let isConfigured = false;

export function ensureLocalPersistenceConfigured(): void {
  if (isConfigured) {
    return;
  }

  // Keep local persistence setup in one place so future stores share the same path.
  configureObservablePersistence({
    pluginLocal: ObservablePersistLocalStorage,
  });

  isConfigured = true;
}
