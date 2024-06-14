import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 90000,
  webServer: {
    command: "pnpm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
  },
});
