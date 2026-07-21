import Link from "next/link";

const FEATURES = [
  {
    title: "Real-time Collaboration",
    description:
      "Every task update, status change, and reassignment appears instantly for everyone watching — no refresh needed.",
    icon: (
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    title: "Role-Based Access",
    description:
      "Admins see the whole board; everyone else sees exactly what belongs to them. Access rules enforced end to end.",
    icon: (
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    ),
  },
  {
    title: "AI-Powered Summaries",
    description:
      "Let Claude summarize your board, highlight blockers, and suggest next steps — coming soon.",
    icon: (
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.99-2.386l-.548-.547z" />
    ),
  },
  {
    title: "Secure by Design",
    description:
      "JWT access + refresh tokens, httpOnly cookies, and audited role checks protect every request and socket event.",
    icon: (
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    ),
  },
];

export default function Home() {
  return (
    <>
      <section className="hero bg-base-200 py-20">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Manage tasks together, in real time.
            </h1>
            <p className="py-6 text-lg text-base-content/70">
              A collaborative task board with live updates, role-based
              permissions, and AI-assisted summaries — built for teams that
              move fast.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register" className="btn btn-primary btn-lg">
                Get Started — It&apos;s Free
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Everything your team needs</h2>
          <p className="mt-2 text-base-content/70">
            Built on Next.js, Socket.io, and Prisma — designed to scale with
            your team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="card bg-base-100 shadow-md transition-shadow hover:shadow-xl"
            >
              <div className="card-body">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="card-title mt-3 text-lg">{feature.title}</h3>
                <p className="text-sm text-base-content/70">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-base-200 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">
          <h2 className="text-2xl font-bold">Ready to try it out?</h2>
          <p className="text-base-content/70">
            Create a free account and start collaborating on your first task
            board in under a minute.
          </p>
          <Link href="/register" className="btn btn-primary">
            Create your account
          </Link>
        </div>
      </section>
    </>
  );
}
