// SyncManager.js
import * as SQLite from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";

import api from "../apis/api"; // Import your Axios instance
import settingModel from "../models/settingModel";

const DB_VERSION = process.env.EXPO_PUBLIC_DB_VERSION ?? 1;

export class SyncManager {
  constructor(apiEndpoint = null, tables = []) {
    this.apiEndpoint = apiEndpoint;
    this.tables = tables; // Store the table-model mappings here
    this.db = null;
    this.isSyncing = false;
    this.retryDelay = 5000; // Start with a 5-second delay for retry
    this.maxRetryDelay = 180000; // Max retry delay of 3 minutes (3*60*1000ms)
    this.retryTimeout = null;
  }

  // Initialize the SQLite database and models
  async init() {
    this.db = await SQLite.openDatabaseAsync("app_6.db");

    // Manage database versioning
    const storedVersion = parseInt(await settingModel.getDbVersion(), 10) ?? 0;

    if (storedVersion < DB_VERSION) {
      await this.migrateDatabase(storedVersion);
    }

    // Initialize tables and models
    await this.createTables();
  }

  // Create tables for all registered models dynamically based on their schema
  async createTables() {
    for (const table in this.tables) {
      if (!this.tables[table].db) this.tables[table].db = this.db; // Attach the database instance to each model
      await this.tables[table].createTable();
    }
  }

  // Handle database migrations based on version
  async migrateDatabase(oldVersion) {
    if (oldVersion < 1) {
      console.log("Migrating database to version 1...");
    }
    if (oldVersion < DB_VERSION && DB_VERSION > 1) {
      console.log(`Migrating database to version ${DB_VERSION}...`);
      //do migration

      for (const table in this.tables) {
        if (!this.tables[table].db) this.tables[table].db = this.db; // Attach the database instance to each model
        await this.tables[table].migrateTable(DB_VERSION);
        settingModel.setLastSyncTime(table, "1970-01-01T00:00:00.000Z");
      }
    }
    await settingModel.setDbVersion(DB_VERSION.toString());
  }

  // Sync logic for all tables
  async sync() {
    if (this.isSyncing) {
      console.log("Sync already in progress...");
      return;
    }
    this.isSyncing = true;

    try {
      // Sync each table individually
      for (const table in this.tables) {
        // Get the last sync time
        const lastSyncTime =
          (await settingModel.getLastSyncTime(table)) ||
          "1970-01-01T00:00:00.000Z";

        console.log(`syncing table: ${table}`);
        await this.syncTable(table, lastSyncTime);

        // Update the last sync time after successful sync
        const currentTime = new Date().toISOString();
        await settingModel.setLastSyncTime(table, currentTime);
      }

      // Reset retry delay after successful sync
      this.retryDelay = 5000;
    } catch (error) {
      console.error("Sync Error: ", error);
      // Schedule a retry for the sync if it fails
      this.scheduleRetry();
    } finally {
      this.isSyncing = false; // Ensure isSyncing is reset
    }
  }
  // Sync a single table
  async syncTable(table, lastSyncTime) {
    const model = this.tables[table];
    try {
      console.log("syncing at:", lastSyncTime);
      // Fetch updates from the server
      const response = await api.get(`${this.apiEndpoint}${table}/sync-pull`, {
        params: { lastSyncTime },
      });
      const { updated, deleted } = response?.data;
      const error = "sync pull endpoint not properly set.";

      if (!updated || !deleted) throw error;
      const changes = [].concat(updated, deleted);

      // Save server changes to local SQLite
      await model.saveServerChanges(changes);

      // Fetch and push local changes
      const modifiedRecords = await model.getModifiedRecords(lastSyncTime);
      const deletedRecords = await model.getDeletedRecords();

      if (modifiedRecords.length > 0 || deletedRecords.length > 0) {
        const changes = {
          updated: modifiedRecords,
          deleted: deletedRecords,
        };

        api
          .post(`${this.apiEndpoint}${table}/sync-push`, changes)
          .then(
            (result) => {
              console.log("result", result);
            },
            (reason) => {
              console.log("Request Rejected:", reason);
            }
          )
          .catch((error) => {
            if (error.code === "ECONNABORTED") {
              console.log("Request timeout error:", error.message);
              throw error;
            } else {
              console.log("An error occurred:", error.message);
            }
          });
      }
    } catch (error) {
      console.error(`Sync Error for table ${table}:`, error);
      throw error;
    }
  }

  // Check for internet connectivity before syncing
  async isOnline() {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  }

  // Schedule a retry with exponential backoff
  async scheduleRetry() {
    // Clear any previous retry timeout to avoid multiple retries
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    // Check if the device is online before scheduling the retry
    const online = await this.isOnline();
    if (!online) {
      console.log("No internet connection, retry will not be scheduled.");
      return;
    }

    console.log(
      `Scheduling sync retry in ${this.retryDelay / 1000} seconds...`
    );

    this.retryTimeout = setTimeout(() => {
      this.sync();
      // Incrementally increase the retry delay up to the maximum
      this.retryDelay = Math.min(this.retryDelay * 3, this.maxRetryDelay);
    }, this.retryDelay);
  }
}

// Create a reusable sync manager factory function that accepts tables and models
export const createSyncManager = async (apiEndpoint, tableModels) => {
  const manager = new SyncManager(apiEndpoint, tableModels);
  await manager.init();
  return manager;
};
