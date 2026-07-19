"use client";

import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { api } from "@/lib/axios";
import { useAuth } from "@/components/AuthProvider";

interface FieldErrors {
  email?: string[];
  password?: string[];
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refreshUser } = useAuth();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);

    try {
      await api.post("/auth/login", { email, password });
      await refreshUser();
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 400 && data?.errors) {
          setFieldErrors(data.errors);
        } else if (status === 401) {
          setFormError(data?.message ?? "Invalid email or password.");
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
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Log in</h1>

          {formError && (
            <div className="alert alert-error mt-2">
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
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
                placeholder="Your password"
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
                "Log in"
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            New here?{" "}
            <Link href="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
