import OpenAI from "openai";
import { HttpsProxyAgent } from 'https-proxy-agent';
import { type Page, TaskMessage, TaskResult } from "./types";
import { prompt } from "./prompt";
import { createActions } from "./createActions";

const defaultDebug = process.env.AUTO_PLAYWRIGHT_DEBUG === "true";

export const completeTask = async (
  page: Page,
  task: TaskMessage
): Promise<TaskResult> => {
  const openai = new OpenAI({
    apiKey: task.options?.openaiApiKey,
    baseURL: task.options?.openaiBaseUrl,
    defaultQuery: task.options?.openaiDefaultQuery,
    defaultHeaders: task.options?.openaiDefaultHeaders,
    httpAgent: task.options?.openaiProxy && new HttpsProxyAgent(task.options?.openaiProxy),
  });

  let lastFunctionResult: null | { errorMessage: string } | { query: string } =
    null;

  const actions = createActions(page);

  const debug = task.options?.debug ?? defaultDebug;

  const runner = openai.beta.chat.completions
    .runTools({
      model: task.options?.model ?? "gpt-4-1106-preview",
      messages: [{ role: "user", content: prompt(task) }],
      tools: Object.values(actions).map((action) => ({
        type: "function",
        function: action,
      })),
    })
    .on("message", (message) => {
      if (debug) {
        console.log("> message", message);
      }

      if (message.role === "assistant") {
        if (message.tool_calls && message.tool_calls.length > 0) {
          for (const tool_call of message.tool_calls) {
            if (tool_call.function.name.startsWith("result")) {
              lastFunctionResult = JSON.parse(tool_call.function.arguments);
              break;
            }
          }
        } else if (message.function_call?.name.startsWith("result")) {
          lastFunctionResult = JSON.parse(message.function_call.arguments);
        }
      }
    });

  const finalContent = await runner.finalContent();

  if (debug) {
    console.log("> finalContent", finalContent);
  }

  if (!lastFunctionResult) {
    throw new Error("Expected to have result");
  }

  if (debug) {
    console.log("> lastFunctionResult", lastFunctionResult);
  }

  return lastFunctionResult;
};
