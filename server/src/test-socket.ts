import { io } from "socket.io-client";

async function main() {
  const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "তোমার-test-email@example.com",
      password: "তোমার-test-password",
    }),
  });

  const { accessToken } = await loginResponse.json();

  const validSocket = io("http://localhost:5000", {
    auth: { token: accessToken },
  });
  validSocket.on("connect", () =>
    console.log("[Valid token] Connected:", validSocket.id),
  );
  validSocket.on("connect_error", (err) =>
    console.log("[Valid token] Rejected:", err.message),
  );

  const noTokenSocket = io("http://localhost:5000", { auth: {} });
  noTokenSocket.on("connect", () =>
    console.log("[No token] Connected (unexpected!)"),
  );
  noTokenSocket.on("connect_error", (err) =>
    console.log("[No token] Rejected as expected:", err.message),
  );

  const invalidSocket = io("http://localhost:5000", {
    auth: { token: "garbage.invalid.token" },
  });
  invalidSocket.on("connect", () =>
    console.log("[Invalid token] Connected (unexpected!)"),
  );
  invalidSocket.on("connect_error", (err) =>
    console.log("[Invalid token] Rejected as expected:", err.message),
  );

  validSocket.on("task:created", (task) => console.log("task:created →", task));
  validSocket.on("task:updated", (task) => console.log("task:updated →", task));
  validSocket.on("task:deleted", (data) => console.log("task:deleted →", data));
}

main();
