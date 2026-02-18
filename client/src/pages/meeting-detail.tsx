import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  FileCheck,
  ListChecks,
  Eye,
  StickyNote,
  UserCheck,
  History,
  Send,
  FolderOpen,
  ShieldCheck,
  Gavel,
  ClipboardCheck,
  Scale,
  Folder,
} from "lucide-react";
import { type Meeting } from "@shared/schema";
import { format, parseISO } from "date-fns";

type LifecyclePhase = "pre-meeting" | "during-meeting" | "post-meeting";

interface LifecycleModule {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: { id: string; label: string; completed?: boolean; status?: string }[];
}

export default function MeetingDetail() {
  const [, params] = useRoute("/meetings/:id");
  const meetingId = params?.id;
  const [activePhase, setActivePhase] = useState<LifecyclePhase>("pre-meeting");

  const { data: meeting, isLoading } = useQuery<Meeting>({
    queryKey: ["/api/meetings", meetingId],
    enabled: !!meetingId,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <h2 className="text-xl font-medium mb-2">Meeting not found</h2>
          <Link href="/meetings">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Meetings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getPhaseStatus = (phase: LifecyclePhase) => {
    if (meeting.status === "completed") {
      return phase === "post-meeting" ? "current" : "completed";
    }
    if (meeting.status === "in_progress") {
      if (phase === "pre-meeting") return "completed";
      if (phase === "during-meeting") return "current";
      return "pending";
    }
    return phase === "pre-meeting" ? "current" : "pending";
  };

  const getStatusBadge = (phase: LifecyclePhase) => {
    const status = getPhaseStatus(phase);
    if (status === "completed") {
      return <Badge variant="outline" className="bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20 dark:border-green-500/30">Completed</Badge>;
    }
    if (status === "current") {
      if (phase === "pre-meeting") {
        return <Badge variant="outline" className="bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30">Preparation in Progress</Badge>;
      }
      if (phase === "during-meeting") {
        return <Badge variant="outline" className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30">Meeting In Progress</Badge>;
      }
      return <Badge variant="outline" className="bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/20 dark:border-orange-500/30">Minutes Pending</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const preMeetingModules: LifecycleModule[] = [
    {
      id: "meeting-notice",
      title: "Meeting Notice",
      icon: <Bell className="h-5 w-5" />,
      items: [
        { id: "1", label: "Date, time, venue / virtual link configured", completed: true },
        { id: "2", label: "Statutory notice tracking", completed: true },
        { id: "3", label: "Notice sent to all directors", completed: false },
      ],
    },
    {
      id: "agenda-papers",
      title: "Agenda & Papers",
      icon: <FileText className="h-5 w-5" />,
      items: [
        { id: "1", label: "Agenda approval workflow", completed: false },
        { id: "2", label: "Board papers & annexures uploaded", completed: false },
        { id: "3", label: "Version control enabled", completed: true },
        { id: "4", label: "Read receipts configured", completed: false },
      ],
    },
    {
      id: "director-preparation",
      title: "Director Preparation",
      icon: <Users className="h-5 w-5" />,
      items: [
        { id: "1", label: "Pre-reads acknowledgment", completed: false },
        { id: "2", label: "Comments / questions before meeting", completed: false },
      ],
    },
    {
      id: "declarations",
      title: "Declarations",
      icon: <ShieldCheck className="h-5 w-5" />,
      items: [
        { id: "1", label: "Conflict of interest disclosures", completed: false },
        { id: "2", label: "Attendance confirmation (RSVP)", completed: false },
      ],
    },
    {
      id: "reminders",
      title: "Reminders & Alerts",
      icon: <Bell className="h-5 w-5" />,
      items: [
        { id: "1", label: "Automated reminders to directors", completed: true },
        { id: "2", label: "24-hour reminder scheduled", completed: true },
        { id: "3", label: "1-hour reminder scheduled", completed: true },
      ],
    },
  ];

  const duringMeetingModules: LifecycleModule[] = [
    {
      id: "live-agenda",
      title: "Live Agenda View",
      icon: <ListChecks className="h-5 w-5" />,
      items: [
        { id: "1", label: "Agenda items with time tracking", status: "ready" },
        { id: "2", label: "Real-time progress indicator", status: "ready" },
      ],
    },
    {
      id: "attendance",
      title: "Attendance Tracking",
      icon: <UserCheck className="h-5 w-5" />,
      items: [
        { id: "1", label: "Roll call / quorum validation", status: "pending" },
        { id: "2", label: "Late arrivals / early departures log", status: "pending" },
      ],
    },
    {
      id: "discussion-notes",
      title: "Discussion Notes",
      icon: <StickyNote className="h-5 w-5" />,
      items: [
        { id: "1", label: "Secure note-taking (secretary only)", status: "ready" },
        { id: "2", label: "Key points capture", status: "ready" },
      ],
    },
    {
      id: "resolutions",
      title: "Resolutions",
      icon: <Gavel className="h-5 w-5" />,
      items: [
        { id: "1", label: "Draft resolution view", status: "ready" },
        { id: "2", label: "Voting (if applicable)", status: "ready" },
      ],
    },
    {
      id: "document-access",
      title: "Document Access",
      icon: <Eye className="h-5 w-5" />,
      items: [
        { id: "1", label: "View-only mode for board papers", status: "ready" },
        { id: "2", label: "Quick reference documents", status: "ready" },
      ],
    },
  ];

  const postMeetingModules: LifecycleModule[] = [
    {
      id: "minutes",
      title: "Minutes of Meeting (MoM)",
      icon: <ClipboardCheck className="h-5 w-5" />,
      items: [
        { id: "1", label: "Draft minutes", status: "pending" },
        { id: "2", label: "Review workflow", status: "pending" },
        { id: "3", label: "Approval workflow", status: "pending" },
      ],
    },
    {
      id: "action-items",
      title: "Action Items",
      icon: <ListChecks className="h-5 w-5" />,
      items: [
        { id: "1", label: "Assign owners", status: "pending" },
        { id: "2", label: "Set due dates", status: "pending" },
        { id: "3", label: "Track status", status: "pending" },
      ],
    },
    {
      id: "resolution-register",
      title: "Resolution Register",
      icon: <Scale className="h-5 w-5" />,
      items: [
        { id: "1", label: "Passed resolutions", status: "pending" },
        { id: "2", label: "Deferred resolutions", status: "pending" },
        { id: "3", label: "Rejected resolutions", status: "pending" },
      ],
    },
    {
      id: "follow-ups",
      title: "Follow-ups",
      icon: <Send className="h-5 w-5" />,
      items: [
        { id: "1", label: "Task tracking", status: "pending" },
        { id: "2", label: "Reminders", status: "pending" },
      ],
    },
    {
      id: "statutory-filings",
      title: "Statutory Filings",
      icon: <Folder className="h-5 w-5" />,
      items: [
        { id: "1", label: "MCA / regulatory filings (if applicable)", status: "pending" },
        { id: "2", label: "Compliance checklist", status: "pending" },
      ],
    },
    {
      id: "audit-trail",
      title: "Audit Trail",
      icon: <History className="h-5 w-5" />,
      items: [
        { id: "1", label: "Access logs", status: "ready" },
        { id: "2", label: "Version history", status: "ready" },
      ],
    },
  ];

  const getModules = (phase: LifecyclePhase) => {
    switch (phase) {
      case "pre-meeting":
        return preMeetingModules;
      case "during-meeting":
        return duringMeetingModules;
      case "post-meeting":
        return postMeetingModules;
    }
  };

  const calculateProgress = (modules: LifecycleModule[]) => {
    let total = 0;
    let completed = 0;
    modules.forEach((module) => {
      module.items.forEach((item) => {
        total++;
        if (item.completed) completed++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/meetings">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-medium" data-testid="text-meeting-title">{meeting.title}</h1>
          <div className="flex items-center gap-4 mt-1 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(parseISO(meeting.date), "MMMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {meeting.time}
            </span>
            {meeting.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {meeting.location}
              </span>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-sm capitalize">
          {meeting.meetingType.replace("_", " ")}
        </Badge>
      </div>

      <Card className="border-2" data-testid="card-lifecycle">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Board Meeting Lifecycle</CardTitle>
          <CardDescription>
            Track meeting preparation, execution, and follow-up in a structured 3-step journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setActivePhase("pre-meeting")}
              className={`relative p-4 rounded-lg border-2 transition-all text-left hover-elevate ${
                activePhase === "pre-meeting"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
              data-testid="tab-pre-meeting"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${activePhase === "pre-meeting" ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Pre-Meeting</h3>
                  <p className="text-xs text-muted-foreground">Preparation & Readiness</p>
                </div>
              </div>
              <div className="mt-3">
                {getStatusBadge("pre-meeting")}
              </div>
              <Progress value={calculateProgress(preMeetingModules)} className="mt-3 h-1.5" />
            </button>

            <button
              onClick={() => setActivePhase("during-meeting")}
              className={`relative p-4 rounded-lg border-2 transition-all text-left hover-elevate ${
                activePhase === "during-meeting"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
              data-testid="tab-during-meeting"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${activePhase === "during-meeting" ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">During Meeting</h3>
                  <p className="text-xs text-muted-foreground">Real-time Governance</p>
                </div>
              </div>
              <div className="mt-3">
                {getStatusBadge("during-meeting")}
              </div>
              <Progress value={0} className="mt-3 h-1.5" />
            </button>

            <button
              onClick={() => setActivePhase("post-meeting")}
              className={`relative p-4 rounded-lg border-2 transition-all text-left hover-elevate ${
                activePhase === "post-meeting"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
              data-testid="tab-post-meeting"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${activePhase === "post-meeting" ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Post-Meeting</h3>
                  <p className="text-xs text-muted-foreground">Compliance & Execution</p>
                </div>
              </div>
              <div className="mt-3">
                {getStatusBadge("post-meeting")}
              </div>
              <Progress value={0} className="mt-3 h-1.5" />
            </button>
          </div>

          <div className="border-t pt-6">
            <Accordion type="multiple" defaultValue={getModules(activePhase).map(m => m.id)} className="space-y-3">
              {getModules(activePhase).map((module) => (
                <AccordionItem
                  key={module.id}
                  value={module.id}
                  className="border rounded-lg px-4"
                  data-testid={`accordion-${module.id}`}
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {module.icon}
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {module.items.filter(i => i.completed).length} of {module.items.length} items completed
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-3 pl-12">
                      {module.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                          data-testid={`item-${module.id}-${item.id}`}
                        >
                          {activePhase === "pre-meeting" ? (
                            <>
                              <Checkbox
                                id={`${module.id}-${item.id}`}
                                checked={item.completed}
                                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                              />
                              <label
                                htmlFor={`${module.id}-${item.id}`}
                                className={`flex-1 text-sm cursor-pointer ${item.completed ? "text-muted-foreground line-through" : ""}`}
                              >
                                {item.label}
                              </label>
                              {item.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                              )}
                            </>
                          ) : (
                            <>
                              <div className={`h-2 w-2 rounded-full ${
                                item.status === "ready" ? "bg-green-500" : "bg-amber-500"
                              }`} />
                              <span className="flex-1 text-sm">{item.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {item.status === "ready" ? "Ready" : "Pending"}
                              </Badge>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-quick-actions">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" data-testid="button-upload-papers">
              <FileText className="mr-2 h-4 w-4" />
              Upload Board Papers
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-send-notice">
              <Send className="mr-2 h-4 w-4" />
              Send Meeting Notice
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-view-agenda">
              <ListChecks className="mr-2 h-4 w-4" />
              View Agenda
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-attendees">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Users className="h-4 w-4" />
              <span>0 confirmed, awaiting RSVPs</span>
            </div>
            <Button variant="outline" size="sm" className="w-full" data-testid="button-manage-attendees">
              Manage Attendees
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-documents">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Folder className="h-4 w-4" />
              <span>0 documents attached</span>
            </div>
            <Button variant="outline" size="sm" className="w-full" data-testid="button-view-documents">
              View Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
