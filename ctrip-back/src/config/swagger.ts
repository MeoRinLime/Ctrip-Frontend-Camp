import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const setupSwagger = (app: Express): void => {  
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Ctrip Travel Diary API',
        version: '1.0.0',
        description: 'API documentation for Ctrip Travel Diary backend service',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{
        bearerAuth: [],
      }],
    },
    apis: [
      './src/routes/*.ts', 
      './src/models/*.ts',
      './dist/routes/*.js', 
      './dist/models/*.js'
    ],
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
