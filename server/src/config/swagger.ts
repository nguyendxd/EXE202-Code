import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pawmilly API",
      version: "1.0.0",
      description: "API documentation for Pawmilly website",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "../routes/*.js") // Production
      : path.join(__dirname, "../routes/*.ts"), // Development
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
