import bodyParser from 'body-parser';
import express, { Request as ExRequest, Response as ExResponse } from 'express';
import swaggerUi from 'swagger-ui-express';

import { RegisterRoutes } from './generated/routes';
import spec from './generated/swagger.json';

const port = process.env.OPEN_API_SERVICE_PORT;

export const app = express();

app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);
app.use(bodyParser.json());

app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
	return res.send(swaggerUi.generateHTML(spec));
});

app.use('/spec', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
	return res.send(spec);
});

RegisterRoutes(app);

app.listen(port, () =>
	console.log(`OpenAPI service listening on http://localhost:${port}/docs`),
);
