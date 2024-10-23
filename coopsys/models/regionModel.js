// models/regionModel.js
import { BaseModel } from "./baseModel";

export class RegionModel extends BaseModel {
  constructor() {
    const schema = {
      id: "INTEGER PRIMARY KEY",
      server_id: "INTEGER UNIQUE",
      name: "TEXT",
      short_name: "VARCHAR(10)",
      created_at: "TEXT",
      updated_at: "TEXT",
      deleted_at: "TEXT",
    };
    super("regions", schema);
  }

  async search(search_term) {
    return await this.db.getAllAsync(
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL AND (name LIKE '%${search_term}%' OR short_name LIKE '%${search_term}%');`,
      []
    );
  }
}
