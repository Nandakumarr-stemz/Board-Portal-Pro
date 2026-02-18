import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertActionItemSchema,
  type ActionItem,
  type BoardMember,
  type InsertActionItem,
} from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow, isPast, parseISO } from "date-fns";
import {
  AlertCircle,
  CheckSquare,
  Clock,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const actionItemFormSchema = insertActionItemSchema.extend({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return <Badge variant="secondary">Medium</Badge>;
    case "low":
      return <Badge variant="outline">Low</Badge>;
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "in_progress":
      return <Badge variant="default">In Progress</Badge>;
    case "completed":
      return <Badge variant="outline">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
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

export default function ActionItems() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: actionItems, isLoading } = useQuery<ActionItem[]>({
    queryKey: ["/api/action-items"],
  });

  const { data: members } = useQuery<BoardMember[]>({
    queryKey: ["/api/members"],
  });

  const form = useForm<InsertActionItem>({
    resolver: zodResolver(actionItemFormSchema),
    defaultValues: {
      title: "",
      description: "",
      assigneeId: undefined,
      dueDate: "",
      priority: "medium",
      status: "pending",
      meetingId: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertActionItem) => {
      return apiRequest("POST", "/api/action-items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/action-items"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Action item created",
        description: "The action item has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create action item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/action-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/action-items"] });
      toast({
        title: "Action item deleted",
        description: "The action item has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete action item.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/action-items/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/action-items"] });
      toast({
        title: "Status updated",
        description: "The action item status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  const filteredActionItems = actionItems?.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || item.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getAssigneeName = (assigneeId: string | null) => {
    if (!assigneeId || !members) return null;
    const member = members.find((m) => m.id === assigneeId);
    return member?.name;
  };

  const onSubmit = (data: InsertActionItem) => {
    createMutation.mutate(data);
  };

  const toggleComplete = (item: ActionItem) => {
    const newStatus = item.status === "completed" ? "pending" : "completed";
    updateStatusMutation.mutate({ id: item.id, status: newStatus });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium" data-testid="text-page-title">
            Action Items
          </h1>
          <p className="text-muted-foreground">
            Track and manage board action items and tasks
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-action">
              <Plus className="mr-2 h-4 w-4" />
              New Action Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Action Item</DialogTitle>
              <DialogDescription>
                Add a new task or action item for the board.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Review quarterly financials"
                          data-testid="input-action-title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional details about the action item..."
                          className="resize-none"
                          data-testid="input-action-description"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            data-testid="input-action-due-date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-action-priority">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-action-assignee">
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {members?.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel-action"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="button-submit-action"
                  >
                    {createMutation.isPending
                      ? "Creating..."
                      : "Create Action Item"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search action items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-actions"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-[140px]"
                  data-testid="select-status-filter"
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger
                  className="w-[140px]"
                  data-testid="select-priority-filter"
                >
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : filteredActionItems && filteredActionItems.length > 0 ? (
            <div className="space-y-3">
              {filteredActionItems.map((item: any) => {
                const isOverdue =
                  item.status !== "completed" && isPast(parseISO(item.dueDate));
                const assigneeName = getAssigneeName(item?.assigneeId);

                return (
                  <div
                    key={item.id}
                    className={`group flex items-start gap-4 p-4 border rounded-lg hover-elevate transition-colors ${
                      item.status === "completed" ? "opacity-60" : ""
                    }`}
                    data-testid={`action-item-${item.id}`}
                  >
                    <Checkbox
                      checked={item.status === "completed"}
                      onCheckedChange={() => toggleComplete(item)}
                      className="mt-1"
                      data-testid={`checkbox-action-${item.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              item.status === "completed"
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                            <div
                              className={`flex items-center gap-1 ${
                                isOverdue
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {isOverdue ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                              <span>
                                {isOverdue
                                  ? `Overdue by ${formatDistanceToNow(parseISO(item.dueDate))}`
                                  : `Due ${format(parseISO(item.dueDate), "MMM d, yyyy")}`}
                              </span>
                            </div>
                            {assigneeName && (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs bg-muted">
                                    {getInitials(assigneeName)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-muted-foreground">
                                  {assigneeName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                data-testid={`button-action-menu-${item.id}`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                data-testid={`button-edit-${item.id}`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteMutation.mutate(item.id)}
                                data-testid={`button-delete-${item.id}`}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-1">
                No action items found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ||
                statusFilter !== "all" ||
                priorityFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first action item"}
              </p>
              {!searchQuery &&
                statusFilter === "all" &&
                priorityFilter === "all" && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    data-testid="button-create-first-action"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Action Item
                  </Button>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
