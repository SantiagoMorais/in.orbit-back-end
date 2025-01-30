import { getWeekSummary } from "@functions/get-week-summary";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authenticateUserHook } from "http/hooks/authenticate-user";
import z from "zod";

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/summary",
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ["goals"],
        description: "Get week goals",
        response: {
          200: z.object({
            summary: z.object({
              completed: z.number(),
              total: z.number(),
              goalsPerDay: z.record(
                z.string(),
                z.array(
                  z.object({
                    id: z.string(),
                    title: z.string(),
                    completedAt: z.string(),
                  })
                )
              ),
            }),
          }),
        },
      },
    },
    async (request) => {
      const userId = request.user.sub;
      const { summary } = await getWeekSummary({
        userId,
      });

      return { summary };
    }
  );
};
