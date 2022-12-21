## PROCESS-SPECIFIC CONTROL FLOW
Checking against Node's process.platform variable can help you to run code conditionally on certain platforms.
Note that there are only three possible platforms that Electron can run in: win32 (Windows), linux (Linux), and darwin (macOS).

## Using Preload Scripts
A preload script contains code that runs before your web page is loaded into the browser window.
It has access to both DOM APIs and Node.js environment, and is often used to expose privileged APIs to the renderer via the contextBridge API.

Because the main and renderer processes have very different responsibilities,
Electron apps often use the preload script to set up inter-process communication (IPC) interfaces to pass arbitrary messages between the two kinds of processes.