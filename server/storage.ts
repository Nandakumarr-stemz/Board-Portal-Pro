import {
  type User,
  type InsertUser,
  type BoardMember,
  type InsertBoardMember,
  type Meeting,
  type InsertMeeting,
  type Document,
  type InsertDocument,
  type ActionItem,
  type InsertActionItem,
  type AgendaItem,
  type InsertAgendaItem,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Board Members
  getMembers(): Promise<BoardMember[]>;
  getMember(id: string): Promise<BoardMember | undefined>;
  createMember(member: InsertBoardMember): Promise<BoardMember>;
  updateMember(id: string, member: Partial<InsertBoardMember>): Promise<BoardMember | undefined>;
  deleteMember(id: string): Promise<boolean>;

  // Meetings
  getMeetings(): Promise<Meeting[]>;
  getMeeting(id: string): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: string, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: string): Promise<boolean>;

  // Documents
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: string): Promise<boolean>;

  // Action Items
  getActionItems(): Promise<ActionItem[]>;
  getActionItem(id: string): Promise<ActionItem | undefined>;
  createActionItem(actionItem: InsertActionItem): Promise<ActionItem>;
  updateActionItem(id: string, actionItem: Partial<InsertActionItem>): Promise<ActionItem | undefined>;
  deleteActionItem(id: string): Promise<boolean>;

  // Agenda Items
  getAgendaItems(meetingId: string): Promise<AgendaItem[]>;
  createAgendaItem(agendaItem: InsertAgendaItem): Promise<AgendaItem>;
  deleteAgendaItem(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private boardMembers: Map<string, BoardMember> = new Map();
  private meetings: Map<string, Meeting> = new Map();
  private documents: Map<string, Document> = new Map();
  private actionItems: Map<string, ActionItem> = new Map();
  private agendaItems: Map<string, AgendaItem> = new Map();

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...insertUser,
    };
    this.users.set(user.id, user);
    return user;
  }

  // Board Members
  async getMembers(): Promise<BoardMember[]> {
    return Array.from(this.boardMembers.values());
  }

  async getMember(id: string): Promise<BoardMember | undefined> {
    return this.boardMembers.get(id);
  }

  async createMember(member: InsertBoardMember): Promise<BoardMember> {
    const newMember: BoardMember = {
      id: this.generateId(),
      ...member,
    };
    this.boardMembers.set(newMember.id, newMember);
    return newMember;
  }

  async updateMember(id: string, member: Partial<InsertBoardMember>): Promise<BoardMember | undefined> {
    const existing = this.boardMembers.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...member };
    this.boardMembers.set(id, updated);
    return updated;
  }

  async deleteMember(id: string): Promise<boolean> {
    return this.boardMembers.delete(id);
  }

  // Meetings
  async getMeetings(): Promise<Meeting[]> {
    return Array.from(this.meetings.values());
  }

  async getMeeting(id: string): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const newMeeting: Meeting = {
      id: this.generateId(),
      ...meeting,
    };
    this.meetings.set(newMeeting.id, newMeeting);
    return newMeeting;
  }

  async updateMeeting(id: string, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const existing = this.meetings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...meeting };
    this.meetings.set(id, updated);
    return updated;
  }

  async deleteMeeting(id: string): Promise<boolean> {
    return this.meetings.delete(id);
  }

  // Documents
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const newDocument: Document = {
      id: this.generateId(),
      ...document,
    };
    this.documents.set(newDocument.id, newDocument);
    return newDocument;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Action Items
  async getActionItems(): Promise<ActionItem[]> {
    return Array.from(this.actionItems.values());
  }

  async getActionItem(id: string): Promise<ActionItem | undefined> {
    return this.actionItems.get(id);
  }

  async createActionItem(actionItem: InsertActionItem): Promise<ActionItem> {
    const newActionItem: ActionItem = {
      id: this.generateId(),
      ...actionItem,
    };
    this.actionItems.set(newActionItem.id, newActionItem);
    return newActionItem;
  }

  async updateActionItem(id: string, actionItem: Partial<InsertActionItem>): Promise<ActionItem | undefined> {
    const existing = this.actionItems.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...actionItem };
    this.actionItems.set(id, updated);
    return updated;
  }

  async deleteActionItem(id: string): Promise<boolean> {
    return this.actionItems.delete(id);
  }

  // Agenda Items
  async getAgendaItems(meetingId: string): Promise<AgendaItem[]> {
    return Array.from(this.agendaItems.values()).filter(item => item.meetingId === meetingId);
  }

  async createAgendaItem(agendaItem: InsertAgendaItem): Promise<AgendaItem> {
    const newAgendaItem: AgendaItem = {
      id: this.generateId(),
      ...agendaItem,
    };
    this.agendaItems.set(newAgendaItem.id, newAgendaItem);
    return newAgendaItem;
  }

  async deleteAgendaItem(id: string): Promise<boolean> {
    return this.agendaItems.delete(id);
  }
}

export const storage = new DatabaseStorage();
