import { db } from "./client";

export async function migrate() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      participant_id TEXT NOT NULL,
      last_message TEXT,
      last_message_at TEXT,
      last_message_status TEXT,
      last_message_sender_id TEXT,
      unread_count INTEGER DEFAULT 0
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      message_id TEXT NOT NULL,
      chat_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      delivered_at TEXT,
      seen_at TEXT,
      status TEXT
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      profile_photo TEXT,
      phone_number TEXT NOT NULL UNIQUE,
      avatar_index INTEGER
    );
  `);
  console.log(`Migration completed`)
}

// export async function dropUsersTable() {
//   const db = await SQLite.openDatabaseAsync('chat.db');

//   await db.execAsync(`
//     DROP TABLE IF EXISTS users;
//   `);

//   console.log('users table dropped');
// }