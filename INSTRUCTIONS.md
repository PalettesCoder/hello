# How to Test the PWA Functionality

To test the Progressive Web App (PWA) functionality, you need to serve the website using a local web server.

## 1. Serve the website

A simple way to do this is using the `http.server` module in Python.

1. Open a terminal or command prompt in the project's root directory (the one containing `index.html`).
2. Run the following command:

   ```bash
   python -m http.server
   ```

   If you have an older version of Python (Python 2), the command is:

   ```bash
   python -m SimpleHTTPServer
   ```

If you don't have Python installed, you can use other tools like `npx http-server` (if you have Node.js) or install a simple web server application.

## 2. Access the website

Once the server is running, open your web browser (preferably a modern one like Chrome, Firefox, or Edge) and navigate to:

[https://localhost:8000](https://localhost:8000)

## 3. Test the PWA features

### Check Service Worker Installation

1. Open the browser's developer tools (usually by pressing `F12` or `Ctrl+Shift+I`).
2. Go to the **Application** tab.
3. On the left menu, click on **Service Workers**.
4. You should see a service worker registered for your site. Its status should be "activated and is running".

### Test Offline Functionality

1. In the **Service Workers** tab in the developer tools, check the **Offline** checkbox. This will simulate being offline.
2. Refresh the page (`Ctrl+R` or `Cmd+R`).
3. The website should still load correctly, serving all the files from the cache.

### Check the Web App Manifest and Installability

1. In the **Application** tab, click on **Manifest**.
2. You should see the details you provided in `manifest.json` (e.g., "Harsha's Portfolio", icons).
3. After interacting with the site for a bit, you should see an **install icon** appear in the browser's address bar.
4. Click this icon to "install" the website as a standalone application on your desktop or mobile device.

### Test the Offline Indicator

1.  Toggle the **Offline** checkbox in the developer tools on and off.
2.  You should see the "You are currently offline" banner appear at the bottom of the page when you go offline and disappear when you go back online.

By following these steps, you can verify that the website is now a fully functional Progressive Web App.
