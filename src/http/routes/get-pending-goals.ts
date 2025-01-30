import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "@functions/get-week-pending-goals";
import z from "zod";
import { authenticateUserHook } from "http/hooks/authenticate-user";

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/pending-goals",
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ["goals"],
        description: "Get pending goals",
        response: {
          200: z.object({
            pendingGoals: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                desiredWeeklyFrequency: z.number().min(1).max(7),
                completionCount: z.number(),
              })
            ),
          }),
        },
      },
    },
    async () => {
      const { pendingGoals } = await getWeekPendingGoals();

      return { pendingGoals };
    }
  );
};
