import express from 'express';
import bodyParser from 'body-parser';

import routes from './routes.js';
import swagger from './docs/swagger.js';
import startSession from './session.js';

const app = express();
const port = process.argv[2] === '--port' ? process.argv[3] : 3000;

app.use(bodyParser.json());

// Setup swagger docs UI
app.use('/docs', swagger.ui.serve, swagger.middleware);
function docsPath(req) {
	return `${req.protocol}://${req.hostname}${port !== '80' ? `:${port}` : ''}/docs`;
}

// Add handlers for all supported routes
for (const route of routes) {
	app.post(`/api${route.path}`, route.handler);
	app.get(`/api${route.path}`, (req, res) => {
		res.status(400).send({
			error: `This endpoint only supports POST requests. See docs for more info.`,
			status: 400,
			docs: docsPath(req)
		})
	});
}

// Add a catch-all handler for when a route that doesn't exist is requested
app.get('*', (req, res) => {
	res.status(404).send({
		error: `Endpoint does not exist. See docs for documentation.`,
		status: 404,
		supportedEndpoints: routes.map(route => `/api${route.path}`),
		docs: docsPath(req)
	});
});

// Start the server
app.listen(port, () => {
	console.group('Starting D&D Session...');
	startSession();
	console.groupEnd();

	console.info(`Server is listening at http://localhost:${port}`);
});
