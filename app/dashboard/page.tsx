"use client";

import { useEffect, useState, SubmitEvent } from "react";
import { api } from "@/lib/axios";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadTasks() {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch {
      setFormError("Unable to load tasks.");
    } finally {
      setIsLoadingTasks(false);
    }
  }

  useEffect(() => {
    const run = async () => {
      await loadTasks();
    };
    run();
  }, []);

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

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200 px-4 py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Create a new task</h2>

            {formError && (
              <div className="alert alert-error mt-2">
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
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

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">Your Tasks</h1>

          {isLoadingTasks ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-base-content/70">
              No tasks yet — create your first one above.
            </p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="card bg-base-100 shadow">
                <div className="card-body py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{task.title}</h3>
                    <span className="badge badge-outline">{task.status}</span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-base-content/70">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
