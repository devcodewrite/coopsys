// models/officeModel.js
import { BaseModel } from "./baseModel";

export class AssociationModel extends BaseModel {
  constructor() {
    const schema = {
      id: "INTEGER PRIMARY KEY",
      server_id: "INTEGER UNIQUE",
      assoc_code:  "VARCHAR(10)",
      name: "VARCHAR(40)",
      office_id: "INTEGER",
      community_id: "INTEGER",
      orgid: "VARCHAR(10)",
      creator: "VARCHAR(40)",
      owner: "VARCHAR(40)",
      created_at: "TEXT",
      updated_at: "TEXT",
      deleted_at: "TEXT",
    };
    super("associations", schema);
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
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL AND ${conditions} AND (name LIKE '%${search_term}%' OR assoc_code LIKE '%${search_term}%');`,
      values
    );
  }
}
