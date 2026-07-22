const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free";

export async function summarizeTaskWithAI(
  title: string,
  description: string | null,
): Promise<string> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: 100,
        messages: [
          {
            role: "system",
            content:
              "You summarize task descriptions in one short, clear sentence for a task management app. Do not add extra commentary.",
          },
          {
            role: "user",
            content: `Title: ${title}\nDescription: ${description || "No description provided."}`,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error("AI_REQUEST_FAILED");
  }

  const data = await response.json();
  const summary = data.choices?.[0]?.message?.content?.trim();

  if (!summary) {
    throw new Error("AI_REQUEST_FAILED");
  }

  return summary;
}
