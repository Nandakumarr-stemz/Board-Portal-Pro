import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import type {
  ActionItem,
  BoardMember,
  Document,
  Meeting,
} from "@shared/schema";
import { format, formatDistanceToNow, isPast, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "scheduled":
      return "secondary";
    case "in_progress":
      return "default";
    case "completed":
      return "outline";
    default:
      return "secondary";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Dashboard() {
  const navigate = useNavigate();

  const handleNav = (url: string) => {
    navigate(url);
  };

  const { data: meetings, isLoading: meetingsLoading } = useQuery<Meeting[]>({
    queryKey: ["/api/meetings"],
  });

  const { data: actionItems, isLoading: actionItemsLoading } = useQuery<
    ActionItem[]
  >({
    queryKey: ["/api/action-items"],
  });

  const { data: members, isLoading: membersLoading } = useQuery<BoardMember[]>({
    queryKey: ["/api/members"],
  });

  const { data: documents, isLoading: documentsLoading } = useQuery<Document[]>(
    {
      queryKey: ["/api/documents"],
    },
  );

  const upcomingMeetings = meetings
    ?.filter((m) => m.status !== "completed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const nextMeeting = upcomingMeetings?.[0];

  const pendingActions = actionItems
    ?.filter((a) => a.status === "pending")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 5);

  const recentDocuments = documents?.slice(0, 4);

  const stats = [
    {
      title: "Upcoming Meetings",
      value: meetings?.filter((m) => m.status === "scheduled").length || 0,
      icon: Calendar,
      iconColor: "text-white",
      bgGradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
    },
    {
      title: "Pending Actions",
      value: actionItems?.filter((a) => a.status === "pending").length || 0,
      icon: AlertCircle,
      iconColor: "text-white",
      bgGradient: "bg-gradient-to-br from-orange-400 to-pink-500",
    },
    {
      title: "Board Members",
      value: members?.filter((m) => m.status === "active").length || 0,
      icon: Users,
      iconColor: "text-white",
      bgGradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
    },
    {
      title: "Total Documents",
      value: documents?.length || 0,
      icon: FileText,
      iconColor: "text-white",
      bgGradient: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium" data-testid="text-page-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to Stemz BoardSync. Here's an overview of your board
          activities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`${stat.bgGradient} border-0 text-white shadow-lg`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-white/80">{stat.title}</p>
                  {meetingsLoading ||
                  actionItemsLoading ||
                  membersLoading ||
                  documentsLoading ? (
                    <Skeleton className="h-8 w-12 bg-white/20" />
                  ) : (
                    <p
                      className="text-3xl font-semibold"
                      data-testid={`stat-${stat.title.toLowerCase().replace(" ", "-")}`}
                    >
                      {stat.value}
                    </p>
                  )}
                </div>
                <div className={`${stat.iconColor} opacity-90`}>
                  <stat.icon className="h-10 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {nextMeeting && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                <CardTitle className="text-lg font-medium">
                  Next Meeting
                </CardTitle>
                <Badge variant={getStatusBadgeVariant(nextMeeting.status)}>
                  {nextMeeting.status.replace("_", " ")}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3
                    className="text-xl font-medium"
                    data-testid="text-next-meeting-title"
                  >
                    {nextMeeting.title}
                  </h3>
                  {nextMeeting.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {nextMeeting.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(parseISO(nextMeeting.date), "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{nextMeeting.time}</span>
                  </div>
                  {nextMeeting.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{nextMeeting.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    // href={`/meetings/${nextMeeting.id}`}
                    onClick={() => navigate(`/meetings/${nextMeeting.id}`)}
                  >
                    <Button data-testid="button-view-meeting">
                      View Meeting Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
              <CardTitle className="text-lg font-medium">
                Upcoming Meetings
              </CardTitle>
              <span onClick={() => navigate(`/meetings`)}>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-view-all-meetings"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </span>
            </CardHeader>
            <CardContent>
              {meetingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingMeetings && upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <Button
                      key={meeting.id}
                      // href={`/meetings/${meeting.id}`}
                      onClick={() => navigate(`/meetings/${meeting?.id}`)}
                      className="block"
                    >
                      <div
                        className="flex items-center gap-4 rounded-lg p-3 hover-elevate active-elevate-2 transition-colors"
                        data-testid={`meeting-row-${meeting.id}`}
                      >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {meeting.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(meeting.date), "MMM d")} at{" "}
                            {meeting.time}
                          </p>
                        </div>
                        <Badge
                          variant={getStatusBadgeVariant(meeting.status)}
                          className="flex-shrink-0"
                        >
                          {meeting.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No upcoming meetings</p>
                  <span onClick={() => navigate("/meetings")}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      data-testid="button-schedule-meeting"
                    >
                      Schedule a Meeting
                    </Button>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
              <CardTitle className="text-lg font-medium">
                Recent Documents
              </CardTitle>
              <span onClick={() => navigate(`/documents`)}>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-view-all-documents"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </span>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <Skeleton className="h-10 w-10 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentDocuments && recentDocuments.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {recentDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                      data-testid={`document-card-${doc.id}`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">
                          {doc.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} · {doc.size}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No documents uploaded</p>
                  <span onClick={() => navigate(`/documents`)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      data-testid="button-upload-document"
                    >
                      Upload Document
                    </Button>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
              <CardTitle className="text-lg font-medium">
                Action Items
              </CardTitle>
              <span onClick={() => navigate(`/action-items`)}>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-view-all-actions"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </span>
            </CardHeader>
            <CardContent>
              {actionItemsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-4 w-4 rounded-full mt-1" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingActions && pendingActions.length > 0 ? (
                <div className="space-y-3">
                  {pendingActions.map((action) => {
                    const isOverdue = isPast(parseISO(action.dueDate));
                    return (
                      <div
                        key={action.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover-elevate"
                        data-testid={`action-item-${action.id}`}
                      >
                        <div
                          className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${getPriorityColor(action.priority)}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">
                            {action.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${isOverdue ? "text-red-500" : "text-muted-foreground"}`}
                          >
                            Due{" "}
                            {formatDistanceToNow(parseISO(action.dueDate), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No pending action items
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
              <CardTitle className="text-lg font-medium">
                Board Members
              </CardTitle>
              <span onClick={() => navigate(`/members`)}>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-view-all-members"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </span>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : members && members.length > 0 ? (
                <div className="space-y-3">
                  {members.slice(0, 5).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3"
                      data-testid={`member-row-${member.id}`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-muted text-sm">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No board members
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
