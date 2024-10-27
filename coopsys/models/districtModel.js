// models/districtModel.js

import { BaseModel } from "./baseModel";

export class DistrictModel extends BaseModel {
  constructor() {
    const schema = {
      id: "INTEGER PRIMARY KEY",
      server_id: "INTEGER UNIQUE",
      name: "TEXT",
      capital: "TEXT",
      category:
        "TEXT CHECK (category IN ('Metropolitan','Municipal', 'District'))",
      region_id: "INTEGER",
      created_at: "TEXT",
      updated_at: "TEXT",
      deleted_at: "TEXT",
    };
    // const migrations = [
    //   {
    //     version: 14,
    //     changes:
    //     `ALTER TABLE districts ADD COLUMN capital TEXT;
    //      ALTER TABLE districts ADD COLUMN category TEXT CHECK (category IN ('Municipal', 'District'));`,
    //   },
    // ];
    super("districts", schema);
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
