"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Pawmilly API",
            version: "1.0.0",
            description: "API documentation for Pawmilly website",
            contact: {
                name: "Support",
                email: "support@pawmilly.com",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
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
        servers: [
            {
                url: `${process.env.API_URL || 'http://localhost:3000'}/api`,
                description: "Development server",
            },
            {
                url: "https://pawmilly.site/api",
                description: "Production server",
            },
        ],
    },
    apis: [
        path_1.default.join(__dirname, "../routes/*.ts"),
        path_1.default.join(__dirname, "../controllers/*.ts"),
    ],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log(`Swagger Docs available at ${process.env.API_URL || 'http://localhost:3000'}/api-docs`);
};
exports.setupSwagger = setupSwagger;
