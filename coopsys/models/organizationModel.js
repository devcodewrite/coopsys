// models/officeModel.js
import { BaseModel } from "./baseModel";

export class OrganizationModel extends BaseModel {
  constructor() {
    const schema = {
      orgid: "VARCHAR(10) PRIMARY KEY",
      server_id: "INTEGER UNIQUE",
      name: "VARCHAR(40)",
      creator: "VARCHAR(40)",
      owner: "VARCHAR(40)",
      created_at: "TEXT",
      updated_at: "TEXT",
      deleted_at: "TEXT",
    };
    super("organizations", schema);
  }

  async search(search_term, where = {}) {
    let values = [],
      conditions = 1;
    if (where && Object.keys(where).length > 0) {
      values = Object.values(where);
      const columns = Object.keys(where);

      conditions = columns.map((col) => `${col}=?`).join(" AND ");
    }

    return await this.db.getAllAsync(
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL AND ${conditions} AND name LIKE '%${search_term}%';`,
      values
    );
  }
}
