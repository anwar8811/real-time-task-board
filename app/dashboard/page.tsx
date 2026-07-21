"use client";

import { useEffect, useState, SubmitEvent, useCallback } from "react";
import { api } from "@/lib/axios";
import { useSocket } from "@/components/SocketProvider";
import { useAuth } from "@/components/AuthProvider";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_BADGE_CLASS: Record<Task["status"], string> = {
  PENDING: "badge-warning",
  IN_PROGRESS: "badge-info",
  COMPLETED: "badge-success",
};

const STATUS_LABEL: Record<Task["status"], string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default function DashboardPage() {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Task["status"]>("");

  const loadTasks = useCallback(async () => {
    try {
      const response = await api.get("/tasks", {
        params: {
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        },
      });
      setTasks(response.data.tasks);
    } catch {
      setFormError("Unable to load tasks.");
    } finally {
      setIsLoadingTasks(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const run = async () => {
        await loadTasks();
      };
      run();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [loadTasks]);

  useEffect(() => {
    if (!socket) return;

    function matchesFilters(task: Task) {
      if (statusFilter && task.status !== statusFilter) return false;
      if (
        searchTerm &&
        !task.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    }

    function handleTaskCreated(newTask: Task) {
      if (!matchesFilters(newTask)) return;
      setTasks((prev) => {
        if (prev.some((t) => t.id === newTask.id)) return prev;
        return [newTask, ...prev];
      });
    }

    function handleTaskUpdated(updatedTask: Task) {
      setTasks((prev) => {
        const isVisibleToMe =
          user?.role === "ADMIN" || updatedTask.ownerId === user?.id;
        const existingIndex = prev.findIndex((t) => t.id === updatedTask.id);

        if (!isVisibleToMe || !matchesFilters(updatedTask)) {
          if (existingIndex === -1) return prev;
          return prev.filter((t) => t.id !== updatedTask.id);
        }

        if (existingIndex === -1) {
          return [updatedTask, ...prev];
        }

        const next = [...prev];
        next[existingIndex] = updatedTask;
        return next;
      });
    }

    function handleTaskDeleted({ id }: { id: string }) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }

    socket.on("task:created", handleTaskCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("task:deleted", handleTaskDeleted);

    return () => {
      socket.off("task:created", handleTaskCreated);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("task:deleted", handleTaskDeleted);
    };
  }, [socket, user, statusFilter, searchTerm]);

  async function handleCreate(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await api.post("/tasks", {
        title,
        description: description || undefined,
      });
      setTitle("");
      setDescription("");
      await loadTasks();
    } catch {
      setFormError("Unable to create task. Please check your input.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(taskId: string, status: Task["status"]) {
    setActionError(null);
    setPendingTaskId(taskId);
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      await loadTasks();
    } catch {
      setActionError("Unable to update task status.");
    } finally {
      setPendingTaskId(null);
    }
  }

  async function handleDelete(taskId: string) {
    setActionError(null);
    setPendingTaskId(taskId);
    try {
      await api.delete(`/tasks/${taskId}`);
      await loadTasks();
    } catch {
      setActionError("Unable to delete task.");
    } finally {
      setPendingTaskId(null);
    }
  }

  return (
    <main className="flex-1 bg-base-200 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Tasks</h1>
          <p className="text-sm text-base-content/60">
            Everything assigned to you updates here in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <div className="card h-fit bg-base-100 shadow-xl lg:sticky lg:top-20">
            <div className="card-body">
              <h2 className="card-title text-base">Create a new task</h2>

              {formError && (
                <div className="alert alert-error">
                  <span>{formError}</span>
                </div>
              )}

              <form
                onSubmit={handleCreate}
                className="flex flex-col gap-4 mt-2"
              >
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Title</legend>
                  <input
                    type="text"
                    className="input w-full"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="What needs to be done?"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Description (optional)
                  </legend>
                  <textarea
                    className="textarea w-full"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Add more detail..."
                  />
                </fieldset>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Add Task"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {actionError && (
              <div className="alert alert-error">
                <span>{actionError}</span>
              </div>
            )}

            <div className="card bg-base-100 shadow-sm">
              <div className="card-body flex-col gap-2 p-4 sm:flex-row">
                <input
                  type="text"
                  className="input input-sm flex-1"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <select
                  className="select select-sm"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as typeof statusFilter)
                  }
                >
                  <option value="">All statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            {isLoadingTasks ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body items-center py-12 text-center">
                  <p className="font-medium">No tasks yet</p>
                  <p className="text-sm text-base-content/60">
                    Create your first task using the form on the left.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <div key={task.id} className="card bg-base-100 shadow-sm">
                    <div className="card-body gap-2 py-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <span
                              className={`badge badge-sm ${STATUS_BADGE_CLASS[task.status]}`}
                            >
                              {STATUS_LABEL[task.status]}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-base-content/70">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            className="select select-sm"
                            value={task.status}
                            disabled={pendingTaskId === task.id}
                            onChange={(event) =>
                              handleStatusChange(
                                task.id,
                                event.target.value as Task["status"],
                              )
                            }
                          >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                          <button
                            type="button"
                            className="btn btn-sm btn-error btn-outline"
                            disabled={pendingTaskId === task.id}
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
