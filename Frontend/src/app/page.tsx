"use client";

import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

export default function Home() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/all?page=${page}&search=${encodeURIComponent(
          search
        )}&status=${statusFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(res.data.tasks || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [page, search, statusFilter, token]);

  const handleAddTask = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/post`,
        { title: newTitle, description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Task added");
      setNewTitle("");
      setNewDescription("");
      setIsAddDialogOpen(false);
      fetchTasks();
    } catch {
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/updateStatus/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchTasks();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status || "pending");
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    if (!editTitle.trim() || !editDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/update/${editingTask._id}`,
        { title: editTitle, description: editDescription, status: editStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Task updated");
      setIsEditDialogOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="flex-1 container mx-auto p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border rounded-lg p-4 bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            <div className="flex-1 min-w-[250px] max-w-lg">
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select onValueChange={(value) => setStatusFilter(value)} value={statusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Task
              </Button>
            </div>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center text-zinc-500 dark:text-zinc-400">No tasks found</div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Table className="border rounded-lg overflow-hidden dark:border-zinc-700">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(val) => updateStatus(task._id, val)}
                        value={task.status}
                        disabled={task.status === "completed"}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="pending" disabled={task.status !== "pending"}>Pending</SelectItem>
                            <SelectItem value="in-progress" disabled={task.status === "in-progress" || task.status === "completed"}>In Progress</SelectItem>
                            <SelectItem value="completed" disabled={task.status === "completed"}>Completed</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(task)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteTask(task._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-zinc-600 dark:text-zinc-300">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>

        <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl">Add New Task</AlertDialogTitle>
              <AlertDialogDescription>Enter the details of your task below.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="title" className="mb-2">Title</Label>
                <Input id="title" placeholder="Enter task title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="description" className="mb-2">Description</Label>
                <Textarea id="description" placeholder="Enter task description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAddTask} disabled={newDescription === "" || newTitle === ""}>
                Add Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl">Edit Task</AlertDialogTitle>
              <AlertDialogDescription>Update the details of the task below.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="edit-title" className="mb-2">Title</Label>
                <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="edit-description" className="mb-2">Description</Label>
                <Textarea id="edit-description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div>
                <Label className="mb-2">Status</Label>
                <Select onValueChange={(val) => setEditStatus(val)} value={editStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="pending" disabled={editStatus !== "pending"}>Pending</SelectItem>
                      <SelectItem value="in-progress" disabled={editStatus === "in-progress" || editStatus === "completed"}>In Progress</SelectItem>
                      <SelectItem value="completed" disabled={editStatus === "completed"}>Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingTask(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleUpdateTask} disabled={editTitle === "" || editDescription === ""}>
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
