import fs from 'fs';
import path from 'path';

export default function viteHotfilePlugin(options = {}) {
	const resolvedOptions = {
		publicDirectory: 'public', // Default directory
		hotFileName: 'vite.hot', // Default file name
		logging: true, // Optional logging
		...options,
	};

	// Create the absolute path to the hotfile
	const hotFilePath = path.resolve(
		process.cwd(),
		resolvedOptions.publicDirectory,
		resolvedOptions.hotFileName
	);

	// Function to create the hotfile
	const createHotFile = (url) => {
		try {
			fs.mkdirSync(path.dirname(hotFilePath), { recursive: true });
			fs.writeFileSync(hotFilePath, url);

			if (resolvedOptions.logging) {
				console.log(`[vite-plugin-hot-file] Hotfile created: ${hotFilePath}`);
			}
		} catch (e) {
			console.error(`[vite-plugin-hot-file] Error creating hotfile:`, e);
		}
	};

	// Function to delete the hotfile
	const cleanupHotFile = () => {
		if (fs.existsSync(hotFilePath)) {
			fs.rmSync(hotFilePath);
		}
	};

	return {
		name: 'vite-plugin-hot-file',

		configureServer(server) {
			server.httpServer?.once('listening', () => {
				const address = server.httpServer.address();
				const protocol = server.config.server.https ? 'https' : 'http';

				let host =
					typeof server.config.server.host === 'string' && server.config.server.host !== '0.0.0.0'
						? server.config.server.host
						: 'localhost';

				const port = typeof address === 'object' ? address.port : server.config.server.port;
				const url = `${protocol}://${host}:${port}`;

				createHotFile(url);
			});

			// Cleanup when the server shuts down
			process.on('exit', cleanupHotFile);
			['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((signal) => {
				process.on(signal, () => {
					cleanupHotFile();
					process.exit();
				});
			});
		},
	};
}
