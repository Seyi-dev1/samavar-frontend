import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const chats = sqliteTable("chats", {
  id: text("id").primaryKey(),
  participantId: text("participant_id").notNull(),
  lastMessage: text("last_message"),
  lastMessageAt: text("last_message_at"),
  lastMessageStatus: text("last_message_status"),
  lastMessageSenderId: text("last_message_sender_id"),
  unreadCount: integer("unread_count").default(0),
});

export const messages = sqliteTable("messages", {
  messageId: text("message_id").notNull(),
  chatId: text("chat_id").notNull(),
  senderId: text("sender_id").notNull(),
  receiverId: text("receiver_id").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
  deliveredAt: text("delivered_at"),
  seenAt: text("seen_at"),
  type: text("type").notNull(),
  status: text("status"),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  profilePhoto: text('profile_photo'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phoneNumber: text('phone_number').notNull().unique(),
  avatarIndex: integer('avatar_index'),
});