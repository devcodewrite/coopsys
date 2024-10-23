import { useEffect, useState } from "react";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { addChangeListener, removeChangeListener } from "./DatabaseListener";
import SyncManager, { createSyncManager } from "./syncManager";

/**
 * Custom hook for managing data synchronization with network and app state tracking.
 * @param {SyncManager} syncManager - Instance of the SyncManager for handling synchronization logic.
 */
const useSync = (syncManager) => {
  const [isInternetAvailable, setInternetAvailable] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    // Subscribe to internet connectivity changes
    const netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      setInternetAvailable(state.isConnected);
    });

    // Subscribe to app state changes (e.g., active, background, inactive)
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        setAppState(nextAppState);
      }
    );

    return () => {
      // Clean up listeners on unmount
      netInfoUnsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  useEffect(() => {
    // Function to trigger sync if conditions are met
    const triggerSync = async () => {
      if (
        appState !== "active" ||
        !isInternetAvailable ||
        syncManager.isSyncing
      ) {
        console.log("Sync conditions not met. Waiting...");
        return;
      }
      await syncManager.sync();
    };

    // Add database change listener
    addChangeListener(triggerSync);

    // Cleanup listener on unmount
    return () => {
      removeChangeListener(triggerSync);
    };
  }, [appState, isInternetAvailable]);

  return {
    isInternetAvailable,
    appState,
  };
};

export default useSync;
