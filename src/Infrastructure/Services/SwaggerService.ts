import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export class SwaggerService {
    private specs: any;
    constructor() {
        this.specs = swaggerJSDoc({
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'API Clientes CRUD',
                    version: '1.0.0',
                    description: 'Documentación de la API de Gestión de Clientes',
                    contact: {
                        name: 'Soporte',
                        email: 'soporte@api.com'
                    }
                },
                servers: [
                    {
                        url: 'http://localhost:80',
                        description: 'Servidor de desarrollo'
                    }
                ],
                components: {
                    securitySchemes: {
                        BearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                            description: 'Token JWT para autenticación'
                        }
                    }
                }
            },
            // Rutas correctas a tus archivos
            apis: ['./src/Presentation/Routes/*.ts', './src/Presentation/Controllers/*.ts']
        });
    }

    initialize(app: any) {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.specs));
    }
}