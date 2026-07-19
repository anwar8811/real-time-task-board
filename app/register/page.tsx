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
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Create an account</h1>

          {formError && (
            <div className="alert alert-error mt-2">
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
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

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
