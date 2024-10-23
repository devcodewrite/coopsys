// models/memberModel.js
import { BaseModel } from "./baseModel";

export class MemberModel extends BaseModel {
  constructor() {
    const schema = {
      id: "INTEGER PRIMARY KEY",
      server_id: "INTEGER UNIQUE",
      name: "TEXT",
      email: "TEXT",
      updated_at: "TEXT",
      deleted_at: "TEXT",
    };
    const migrations = [{ version: 10, changes: 'ADD COLUMN status TEXT DEFAULT "pending"' }];
    super("members", schema, migrations);
  }
}
