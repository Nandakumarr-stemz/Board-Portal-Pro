import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMeetingSchema,
  insertBoardMemberSchema,
  insertDocumentSchema,
  insertActionItemSchema,
  insertAgendaItemSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Meetings API
  app.get("/api/meetings", async (req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meetings" });
    }
  });

  app.get("/api/meetings/:id", async (req, res) => {
    try {
      const meeting = await storage.getMeeting(req.params.id);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meeting" });
    }
  });

  app.post("/api/meetings", async (req, res) => {
    try {
      const parsed = insertMeetingSchema.parse(req.body);
      const meeting = await storage.createMeeting(parsed);
      res.status(201).json(meeting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create meeting" });
    }
  });

  app.patch("/api/meetings/:id", async (req, res) => {
    try {
      const meeting = await storage.updateMeeting(req.params.id, req.body);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update meeting" });
    }
  });

  app.delete("/api/meetings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMeeting(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete meeting" });
    }
  });

  // Board Members API
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch member" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const parsed = insertBoardMemberSchema.parse(req.body);
      const member = await storage.createMember(parsed);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create member" });
    }
  });

  app.patch("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.updateMember(req.params.id, req.body);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to update member" });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMember(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete member" });
    }
  });

  // Documents API
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const parsed = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(parsed);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDocument(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  // Action Items API
  app.get("/api/action-items", async (req, res) => {
    try {
      const actionItems = await storage.getActionItems();
      res.json(actionItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch action items" });
    }
  });

  app.get("/api/action-items/:id", async (req, res) => {
    try {
      const actionItem = await storage.getActionItem(req.params.id);
      if (!actionItem) {
        return res.status(404).json({ error: "Action item not found" });
      }
      res.json(actionItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch action item" });
    }
  });

  app.post("/api/action-items", async (req, res) => {
    try {
      const parsed = insertActionItemSchema.parse(req.body);
      const actionItem = await storage.createActionItem(parsed);
      res.status(201).json(actionItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create action item" });
    }
  });

  app.patch("/api/action-items/:id", async (req, res) => {
    try {
      const actionItem = await storage.updateActionItem(req.params.id, req.body);
      if (!actionItem) {
        return res.status(404).json({ error: "Action item not found" });
      }
      res.json(actionItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update action item" });
    }
  });

  app.delete("/api/action-items/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteActionItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Action item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete action item" });
    }
  });

  // Agenda Items API
  app.get("/api/meetings/:meetingId/agenda", async (req, res) => {
    try {
      const agendaItems = await storage.getAgendaItems(req.params.meetingId);
      res.json(agendaItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agenda items" });
    }
  });

  app.post("/api/agenda-items", async (req, res) => {
    try {
      const parsed = insertAgendaItemSchema.parse(req.body);
      const agendaItem = await storage.createAgendaItem(parsed);
      res.status(201).json(agendaItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create agenda item" });
    }
  });

  app.delete("/api/agenda-items/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAgendaItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Agenda item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete agenda item" });
    }
  });

  return httpServer;
}
