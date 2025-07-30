const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description: "Task ve Project yönetimi için REST API dokümantasyonu",
    },
    servers: [
      {
        url: process.env.PROJECT_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./swagger/*.js", "./swagger/models/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`🔍 Swagger docs: ${process.env.PROJECT_URL}/api-docs`);
}

module.exports = swaggerDocs;
