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
        url: `http://localhost:${process.env.PORT}`,
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
  apis: ["./routes/*.js", "./models/*.js"], // yorumları buradan tarar
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`🔍 Swagger docs: http://localhost:${process.env.PORT}/api-docs`);
}

module.exports = swaggerDocs;
