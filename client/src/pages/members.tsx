import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertBoardMemberSchema, type BoardMember, type InsertBoardMember } from "@shared/schema";
import { z } from "zod";

const memberFormSchema = insertBoardMemberSchema.extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: members, isLoading } = useQuery<BoardMember[]>({
    queryKey: ["/api/members"],
  });

  const form = useForm<InsertBoardMember>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
      avatar: "",
      status: "active",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBoardMember) => {
      return apiRequest("POST", "/api/members", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Member added",
        description: "The board member has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({
        title: "Member removed",
        description: "The board member has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove member.",
        variant: "destructive",
      });
    },
  });

  const roles = ["all", "Founder & CEO", "Founder", "CTO", "CIO", "CFO", "IT Director", "Chairperson", "Vice Chair", "Director", "Secretary", "Treasurer", "Member"];

  const filteredMembers = members?.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const onSubmit = (data: InsertBoardMember) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium" data-testid="text-page-title">Board Members</h1>
          <p className="text-muted-foreground">
            Manage board members and their roles
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-member">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Board Member</DialogTitle>
              <DialogDescription>
                Add a new member to the board of directors.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Smith"
                          data-testid="input-member-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.smith@company.com"
                          data-testid="input-member-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-member-role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Founder & CEO">Founder & CEO</SelectItem>
                            <SelectItem value="Founder">Founder</SelectItem>
                            <SelectItem value="CTO">CTO</SelectItem>
                            <SelectItem value="CIO">CIO</SelectItem>
                            <SelectItem value="CFO">CFO</SelectItem>
                            <SelectItem value="IT Director">IT Director</SelectItem>
                            <SelectItem value="Chairperson">Chairperson</SelectItem>
                            <SelectItem value="Vice Chair">Vice Chair</SelectItem>
                            <SelectItem value="Director">Director</SelectItem>
                            <SelectItem value="Secretary">Secretary</SelectItem>
                            <SelectItem value="Treasurer">Treasurer</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 234 567 890"
                            data-testid="input-member-phone"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel-member"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="button-submit-member"
                  >
                    {createMutation.isPending ? "Adding..." : "Add Member"}
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
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-members"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-role-filter">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role === "all" ? "All Roles" : role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-6 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMembers && filteredMembers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="group relative p-6 border rounded-lg hover-elevate transition-colors"
                  data-testid={`member-card-${member.id}`}
                >
                  <div className="absolute right-4 top-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-member-menu-${member.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem data-testid={`button-edit-${member.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(member.id)}
                          data-testid={`button-delete-${member.id}`}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className={`h-16 w-16 ${getAvatarColor(member.name)}`}>
                      <AvatarFallback className="text-lg font-medium bg-transparent">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 font-medium text-lg">{member.name}</h3>
                    <Badge variant="secondary" className="mt-2">
                      {member.role}
                    </Badge>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate max-w-[200px]">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center justify-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-1">No members found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || roleFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Get started by adding your first board member"}
              </p>
              {!searchQuery && roleFilter === "all" && (
                <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-add-first-member">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
