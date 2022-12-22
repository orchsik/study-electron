## Pattern 1: Renderer to main (one-way)
To fire a one-way IPC message from a renderer process to the main process, you can use the `ipcRenderer.send` API to send a message that is then received by the `ipcMain.on` API.
You usually use this pattern to call a main process API from your web contents. We'll demonstrate this pattern by creating a simple app that can programmatically change its window title.

## Pattern 2: Renderer to main (two-way)
A common application for two-way IPC is calling a main process module from your renderer process code and waiting for a result.
This can be done by using `ipcRenderer.invoke` paired with `ipcMain.handle`.


## Pattern 3: Main to renderer
When sending a message from the main process to a renderer process, you need to specify which renderer is receiving the message.
Messages need to be sent to a renderer process via its `WebContents` instance.
This WebContents instance contains a `send` method that can be used in the same way as `ipcRenderer.send`.