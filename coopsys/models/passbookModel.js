// models/officeModel.js
import { BaseModel } from "./baseModel";

export class PassbookModel extends BaseModel {
  constructor() {
    const schema = {
      id: "INTEGER PRIMARY KEY",
      server_id: "INTEGER UNIQUE",
      pbnum: "VARCHAR(10)",
      acnum: "VARCHAR(20)",
      account_id: "INTEGER",
      association_id: "INTEGER",
      assoc_code:  "VARCHAR(10)",
      office_id: "INTEGER",
      orgid: "VARCHAR(10)",
      creator: "VARCHAR(40)",
      owner: "VARCHAR(40)",
      created_at: "TEXT",
      updated_at: "TEXT",
      deleted_at: "TEXT",
    };
    super("passbooks", schema);
  }

  async search(search_term, where = {}) {
    let values = [],
      conditions = 1;
    if (where &&  Object.keys(where).length > 0) {
      values = Object.values(where);
      const columns = Object.keys(where);
      conditions = columns.map((col) => `${col}=?`).join(" AND ");
    }

    return await this.db.getAllAsync(
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL AND ${conditions} AND (pbnum LIKE '%${search_term}%' OR acnum LIKE '%${search_term}%');`,
      values
    );
  }
}
