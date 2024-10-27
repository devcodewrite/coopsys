// models/memberModel.js
import { BaseModel } from "./baseModel";

export class AccountModel extends BaseModel {
  constructor() {
    const schema = {
      id: "INTEGER PRIMARY KEY",
      server_id: "INTEGER UNIQUE",
      acnum: "VARCHAR(20)",
      photo: "TEXT",
      title: "VARCHAR(20)",
      name: "TEXT",
      given_name: "VARCHAR(60)",
      family_name: "VARCHAR(60)",
      sex: "VARCHAR(20)",
      dateofbirth: "TEXT",
      marital_status: "VARCHAR(20)",
      occupation: "TEXT",
      education: "VARCHAR(60)",
      nid_type: "VARCHAR(40)",
      nid: "VARCHAR(20)",
      primary_phone: "VARCHAR(20)",
      email: "VARCHAR(255)",
      orgid: "VARCHAR(10)",
      creator: "VARCHAR(40)",
      owner: "VARCHAR(40)",
      created_at: "TEXT",
      updated_at: "TEXT",
      deleted_at: "TEXT",
    };
    const migrations = [];
    super("accounts", schema, migrations);
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
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL AND ${conditions} AND (title LIKE '%${search_term}%' OR name LIKE '%${search_term}%' OR given_name LIKE '%${search_term}%' OR family_name LIKE '%${search_term}%' OR acnum LIKE '%${search_term}%');`,
      values
    );
  }
}
