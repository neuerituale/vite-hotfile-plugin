# vite-hot-file
The Vite Hot File Plugin creates a file (vite.hot by default) containing the development server's URL. This file is stored in the public directory and is automatically deleted when the server shuts down.

## Key Features:
✅ Generates a hotfile with the current server URL when Vite starts.  
✅ Ensures automatic cleanup on server shutdown (exit, SIGINT, SIGTERM, SIGHUP).  
✅ Customizable options (directory, filename, logging).  
✅ Prevents race conditions using fs.promises.rm() for safe file deletion.  

This plugin is useful for tools or scripts that need access to the live server URL, ensuring a smooth development experience. 🚀