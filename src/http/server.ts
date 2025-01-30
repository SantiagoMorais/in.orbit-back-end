import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createGoalRoute } from "./routes/create-goal";
import { getPendingGoalsRoute } from "./routes/get-pending-goals";
import { createCompletionRoute } from "./routes/create-completion";
import { getWeekSummaryRoute } from "./routes/get-week-summary";
import fastifyCors from "@fastify/cors";
import { deleteGoalRoute } from "./routes/delete-goal";
import { deleteGoalCompletionRoute } from "./routes/delete-goal-completion";
import { editGoalRoute } from "./routes/edit-goal";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { authenticateFromGithub } from "./routes/authenticate-from-github";
import fastifyJwt from "@fastify/jwt";
import { env } from "env";

const app = fastify().withTypeProvider<ZodTypeProvider>();
const port: number = 3333;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "in.orbit",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform, // Como estou usando o fastify type provider zod nas rotas, posso usá-las para gerar a documentação de forma automática.
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

// routes
app.register(createGoalRoute);
app.register(getPendingGoalsRoute);
app.register(createCompletionRoute);
app.register(getWeekSummaryRoute);
app.register(deleteGoalRoute);
app.register(deleteGoalCompletionRoute);
app.register(editGoalRoute);
app.register(authenticateFromGithub);

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${port}`);
  });
