// models/baseModel.js

import EventEmitter from "../db/EventEmitter";

export class BaseModel {
  constructor(tableName, schema, migrations = []) {
    this.tableName = tableName;
    this.schema = schema;
    this.db = null;
    this.migrations = migrations;
  }

  // Attach the SQLite database instance dynamically
  setDatabase(db) {
    this.db = db;
  }

  // Generate the SQL schema string based on the schema definition
  getSchemaString() {
    const columns = Object.entries(this.schema).map(
      ([column, type]) => `${column} ${type}`
    );
    return `(${columns.join(", ")})`;
  }

  // Generate the SQL schema string based on the schema definition
  getMigrationSchema(version) {
    for (const i in this.migrations) {
      const schema = this.migrations[i];
      if (parseInt(schema.version) === parseInt(version)) return schema.changes;
    }
    return null;
  }

  // Create the table with the given schema
  async createTable() {
    if (!this.checkDb()) return;

    const schemaString = this.getSchemaString();
    await this.db.execAsync(
      `PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS ${this.tableName} ${schemaString};`
    );
  }

  // Migrate the table with the given schema
  async migrateTable(version) {
    if (!this.checkDb()) return;
    const schemaString = this.getMigrationSchema(version);
    if (schemaString) {
      await this.db.execAsync(`${schemaString};`);
      console.log(`${this.tableName} migrated to ${version}`);
    }
  }

  // Fetch modified records locally since the last sync
  async getModifiedRecords(lastSyncTime) {
    if (!this.checkDb()) return;

    return await this.db.getAllAsync(
      `SELECT * FROM ${this.tableName} WHERE updated_at > ? AND deleted_at IS NULL`,
      [lastSyncTime]
    );
  }

  // Fetch all records locally
  async getAllRecords() {
    if (!this.checkDb()) return;

    return await this.db.getAllAsync(
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL`,
      []
    );
  }

  // Fetch locally deleted_at records (soft deleted_at)
  async getDeletedRecords(lastSyncTime, columns = ["id", "deleted_at"]) {
    if (!this.checkDb()) return;
    const select = columns.join(",");

    return await this.db.getAllAsync(
      `SELECT ${select} FROM ${this.tableName} WHERE deleted_at > ? AND deleted_at IS NOT NULL`,
      [lastSyncTime]
    );
  }

  // Fetch records locally where value matches columns
  async getRecordByColumns(whereCond = null) {
    if (!this.checkDb()) return;

    let conditions = "1",
      values = [];
    if (whereCond) {
      const columns = Object.entries(whereCond).map(
        ([column, value]) => `${column} = ?`
      );
      const where = `(${columns.join(" AND ")})`;
      values = Object.values(whereCond);
      conditions = `${where}`;
    }

    return await this.db.getAllAsync(
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL AND ${conditions}`,
      values
    );
  }

  async getOneByColumns(whereCond = null) {
    if (!this.checkDb()) return;

    let conditions = "1",
      values = [];
    if (whereCond) {
      const columns = Object.entries(whereCond).map(
        ([column, value]) => `${column} = ?`
      );
      const where = `(${columns.join(" AND ")})`;
      values = Object.values(whereCond);
      conditions = `${where}`;
    }

    return await this.db.getFirstAsync(
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL AND ${conditions}`,
      values
    );
  }

  // Update records locally where values
  async saveRecord(data) {
    if (!this.checkDb() || !data) return;
    return this.saveServerChanges([data]);
  }

  // Delete records locally where values
  async removeRecords(whereCond) {
    if (!this.checkDb()) return;

    if (!whereCond) return;

    columns = Object.entries(whereCond).map(
      ([column, value]) => `${column} = ?`
    );
    const where = `(${columns.join(" AND ")})`;
    const values = Object.values(whereCond);

    await this.db.getAllAsync(
      `DELETE FROM ${this.tableName} WHERE 1 AND ${where}`,
      [values]
    );
    EventEmitter.emit("db-change", { action: "delete" });
  }

  // Delete records locally where values
  async removeAllRecords() {
    if (!this.checkDb()) return;
    await this.db.getAllAsync(`DELETE FROM ${this.tableName} WHERE 1`, []);
    EventEmitter.emit("db-change", { action: "delete" });
  }

  // Save or update server records locally
  async saveServerChanges(serverData) {
    if (!this.checkDb()) return;

    if (typeof serverData !== "object") {
      console.log(
        "serverData should be an 'object' but '" +
          typeof serverData +
          "' provided."
      );
      return;
    }
    if (serverData.length === 0) return;

    //get schema columns
    const schemaColumns = Object.entries(this.schema).map(
      ([column, type]) => `${column}`
    );

    const serverColumns = Object.keys(serverData[0]).filter((col) =>
      schemaColumns.includes(col)
    );

    const columns = serverColumns.join(", ");
    const placeholders = serverColumns.map(() => "?").join(", ");

    for (const record of serverData) {
      const values = Object.values(record);

      await this.db.runAsync(
        `INSERT OR REPLACE INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
        values
      );
    }
    EventEmitter.emit("db-change", { action: "save" });
  }

  async saveChanges(serverData) {
    if (!this.checkDb()) return;

    if (typeof serverData !== "object") {
      console.log(
        "serverData should be an 'object' but '" +
          typeof serverData +
          "' provided."
      );
      return;
    }
    if (serverData.length === 0) return;

    //get schema columns
    const schemaColumns = Object.entries(this.schema).map(
      ([column, type]) => `${column}`
    );

    const serverColumns = Object.keys(serverData[0]).filter((col) =>
      schemaColumns.includes(col)
    );
    const columns = serverColumns.join(", ");
    const placeholders = serverColumns.map(() => "?").join(", ");

    for (const record of serverData) {
      const values = Object.values(record);

      await this.db.runAsync(
        `INSERT OR REPLACE INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
        values
      );
    }
  }

  checkDb() {
    if (this.db) return true;
    console.error(
      "DB instance not attached: use model.setDatabase(db) to attach an instance."
    );
    return false;
  }
}
