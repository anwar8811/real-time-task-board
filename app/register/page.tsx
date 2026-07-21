"use client";

import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { api } from "@/lib/axios";

interface FieldErrors {
  name?: string[];
  email?: string[];
  password?: string[];
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);

    try {
      await api.post("/auth/register", { name, email, password });
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 400 && data?.errors) {
          setFieldErrors(data.errors);
        } else if (status === 409) {
          setFormError(
            data?.message ?? "An account with this email already exists.",
          );
        } else {
          setFormError("Something went wrong. Please try again.");
        }
      } else {
        setFormError("Unable to reach the server. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-base-200 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </span>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-base-content/60">
            Start collaborating on your first task board in under a minute.
          </p>
        </div>

        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            {formError && (
              <div className="alert alert-error">
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Name</legend>
                <input
                  type="text"
                  className={`input w-full ${fieldErrors.name ? "input-error" : ""}`}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
                {fieldErrors.name?.map((msg) => (
                  <p key={msg} className="fieldset-label text-error">
                    {msg}
                  </p>
                ))}
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Email</legend>
                <input
                  type="email"
                  className={`input w-full ${fieldErrors.email ? "input-error" : ""}`}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
                {fieldErrors.email?.map((msg) => (
                  <p key={msg} className="fieldset-label text-error">
                    {msg}
                  </p>
                ))}
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input
                  type="password"
                  className={`input w-full ${fieldErrors.password ? "input-error" : ""}`}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                />
                {fieldErrors.password?.map((msg) => (
                  <p key={msg} className="fieldset-label text-error">
                    {msg}
                  </p>
                ))}
              </fieldset>

              <button
                type="submit"
                className="btn btn-primary mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="link link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
