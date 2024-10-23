// models/officeModel.js
import { BaseModel } from "./baseModel";

export class OfficeModel extends BaseModel {
  constructor() {
    const schema = {
      id: "INTEGER PRIMARY KEY",
      server_id: "INTEGER UNIQUE",
      off_code: "VARCHAR(10)",
      name: "VARCHAR(40)",
      region_id: "INTEGER",
      district_id: "INTEGER",
      orgid: "VARCHAR(10)",
      creator: "VARCHAR(40)",
      owner: "VARCHAR(40)",
      created_at: "TEXT",
      updated_at: "TEXT",
      deleted_at: "TEXT",
    };
    super("offices", schema);
  }

  async search(search_term, where = {}) {
    let values = [],
      conditions = 1;
    if (where && where.length > 0) {
      values = Object.values(where);
      const columns = Object.keys(where);

      conditions = columns.map((col) => `${col}=?`).join(" AND ");
    }

    return await this.db.getAllAsync(
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL AND ${conditions} AND (name LIKE '%${search_term}%' OR off_code LIKE '%${search_term}%');`,
      values
    );
  }
}
