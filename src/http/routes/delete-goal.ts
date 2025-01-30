import { deleteGoal } from "@functions/delete-goal";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authenticateUserHook } from "http/hooks/authenticate-user";
import z from "zod";

export const deleteGoalRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/delete",
    {
      onRequest: [authenticateUserHook],
      schema: {
        body: z.object({
          id: z.string(),
        }),
      },
    },
    async (request) => {
      const { id } = request.body;

      await deleteGoal({ id });
    }
  );
};
