import { deleteGoalCompletion } from "@functions/delete-goal-completion";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const deleteGoalCompletionRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/delete-completion",
    {
      schema: {
        body: z.object({
          id: z.string(),
        }),
      },
    },
    async (request) => {
      const { id } = request.body;

      await deleteGoalCompletion({ id });
    }
  );
};
