# vite hotfile plugin
The Vite Hot File Plugin creates a file (vite.hot by default) containing the development server's URL. This file is stored in the public directory and is automatically deleted when the server shuts down.

This functionality is inspired by the [laravel-vite-plugin](https://github.com/laravel/vite-plugin). Many thanks to all contributors.

## Key Features
✅ Generates a hotfile with the current server URL when Vite starts.  
✅ Ensures automatic cleanup on server shutdown (exit, SIGINT, SIGTERM, SIGHUP).  
✅ Customizable options (directory, filename, logging).

This plugin is useful for tools or scripts that need access to the live server URL, ensuring a smooth development experience. 🚀

## Installation
Using npm:
```bash
npm i vite-hotfile-plugin
```

## Example
Part of the vite.conf.js.
```js
import { defineConfig } from 'vite';
import hotfilePlugin from "vite-hotfile-plugin";
export default defineConfig(config = {
  // ... your config ... //
  
  plugins: [
    hotfilePlugin({
      publicDirectory: 'public', // relative path to the hot file (default)
      hotFileName: 'vite.hot', // name of the hot file (default)
      logging: false, // console log (default)
    })
  ],
  
  // This is only an example configuration for a server
  // server: {
  //   https: {
  //     key: `${process.env.VITE_SSL_KEY}`,
  //     cert: `${process.env.VITE_SSL_CRT}`
  //   },
  //   host: `${process.env.VITE_HOST}`,
  //   cors: true,
  // }

  // ... your config ... //
});
```

### Using in code
You can check in your code if a watch process is running and include the appropriate CSS and Javascript files.
Here is an example with php:
```php
/**
 * Get the vite watch url with port
 * @return false|string
 */
function getViteWatchUrl() {
    $file = $path_to_your_public_folder . '/vite.hot';
    return file_exists($file)
        ? file_get_contents($file)
        : ''
        ;
}

if($watchUrl = getViteWatchUrl()) {
    echo "<script type='module' src='{$watchUrl}/main.js'></script>";
} else {
    echo '<script type="module" src="/dist/main.js"></script>';
    echo '<link rel="stylesheet" type="text/css" href="/dist/main.css">';
}

```
