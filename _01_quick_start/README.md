## Package and distribute your application
1. Add Electron Forge as a development dependency of your app, and use its import command to set up Forge's scaffolding:
  ```bash
  npm install --save-dev @electron-forge/cli
  npx electron-forge import
  ```
2. Create a distributable using Forge's make command:
  ```bash
  npm run make
  ```