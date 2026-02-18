import { z } from "zod";

// Users
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & { id: string };

// Board Members
export const insertBoardMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  status: z.string().default("active"),
});

export type InsertBoardMember = z.infer<typeof insertBoardMemberSchema>;
export type BoardMember = InsertBoardMember & { id: string };

// Meetings
export const insertMeetingSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  time: z.string(),
  location: z.string().optional(),
  status: z.string().default("scheduled"),
  meetingType: z.string().default("regular"),
});

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = InsertMeeting & { id: string };

// Agenda Items
export const insertAgendaItemSchema = z.object({
  meetingId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  duration: z.number().default(15),
  order: z.number().default(0),
  presenter: z.string().optional(),
});

export type InsertAgendaItem = z.infer<typeof insertAgendaItemSchema>;
export type AgendaItem = InsertAgendaItem & { id: string };

// Documents
export const insertDocumentSchema = z.object({
  title: z.string(),
  type: z.string(),
  category: z.string(),
  uploadedBy: z.string(),
  uploadedAt: z.string(),
  size: z.string(),
  meetingId: z.string().optional(),
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = InsertDocument & { id: string };

// Action Items
export const insertActionItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string(),
  priority: z.string().default("medium"),
  status: z.string().default("pending"),
  meetingId: z.string().optional(),
});

export type InsertActionItem = z.infer<typeof insertActionItemSchema>;
export type ActionItem = InsertActionItem & { id: string };
