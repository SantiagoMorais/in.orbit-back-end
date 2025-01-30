import { editGoal } from "@functions/edit-goal";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const editGoalRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    "/edit-goal",
    {
      schema: {
        body: z.object({
          id: z.string(),
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
      },
    },
    async (request) => {
      const { id, desiredWeeklyFrequency, title } = request.body;

      await editGoal({ id, desiredWeeklyFrequency, title });
    }
  );
};
