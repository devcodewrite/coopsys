import * as SecureStore from "expo-secure-store";

/**
 * SettingsModel class for managing app settings securely.
 */
class SettingsModel {
  /**
   * Retrieve a setting value by key.
   * @param {string} key - The key of the setting to retrieve.
   * @returns {Promise<string | null>} The setting value or null if not set.
   */
  async getSetting(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (error) {
      console.error(`Failed to retrieve setting for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Store a setting value by key.
   * @param {string} key - The key of the setting to set.
   * @param {string} value - The value to set for the setting.
   * @returns {Promise<void>}
   */
  async setSetting(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Failed to set setting for key "${key}":`, error);
    }
  }

  async remove(key) {
    return await SecureStore.deleteItemAsync(key); 
  }

  /**
   * Convenience method to get the last synchronization time.
   * @returns {Promise<string | null>} The last sync time in ISO format or null if not set.
   */
  async getLastSyncTime(table) {
    return this.getSetting("lastSyncTime-"+table);
  }

  /**
   * Convenience method to set the last synchronization time.
   * @param {Date} date - The date to set as the last sync time.
   * @returns {Promise<void>}
   */
  async setLastSyncTime(table,date) {
    await this.setSetting("lastSyncTime-"+table, date);
  }

  /**
   * Convenience method to get the current database version.
   * @returns {Promise<string | null>} The database version or null if not set.
   */
  async getDbVersion() {
    return this.getSetting("db_version");
  }

  /**
   * Convenience method to set the current database version.
   * @param {string} version - The version string to set.
   * @returns {Promise<void>}
   */
  async setDbVersion(version) {
    await this.setSetting("db_version", version);
  }

  /**
   * Convenience method to get the access token.
   * @returns {Promise<string | null>} The access token or null if not set.
   */
  async getAccessToken() {
    return this.getSetting("accessToken");
  }

  /**
   * Convenience method to set the access token.
   * @param {string} accessToken - The access token string to set.
   * @returns {Promise<void>}
   */
  async setAccessToken(accessToken) {
    await this.setSetting("accessToken", accessToken);
  }

  /**
   * Convenience method to get the refresh token.
   * @returns {Promise<string | null>} The refresh token or null if not set.
   */
  async getRefreshToken() {
    return this.getSetting("refreshToken");
  }

  /**
   * Convenience method to set the refresh token.
   * @param {string} refreshToken - The refresh token string to set.
   * @returns {Promise<void>}
   */
  async setRefreshToken(refreshToken) {
    await this.setSetting("refreshToken", refreshToken);
  }

  /**
   * Convenience method to get the user data.
   * @returns {Promise<string | null>} The user data or null if not set.
   */
  async getUserData() {
    return this.getSetting("userData");
  }

  /**
   * Convenience method to set the user data.
   * @param {string} userData - The user data string to set.
   * @returns {Promise<void>}
   */
  async setUserData(userData) {
    await this.setSetting("userData", userData);
  }
}

export default new SettingsModel();
