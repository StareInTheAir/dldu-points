# Development environment setup instructions

These instructions will help you setup the development tools necessary to make changes to the source code and test them quickly.

## Necessary tools

This repository is setup to use the [development container features](https://code.visualstudio.com/docs/remote/containers) of Visual Studio Code.

In short, you need to install:

- [VS Code](https://code.visualstudio.com/)
- The VS Code [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Docker Desktop](https://docs.docker.com/desktop/) (on Windows or macOS)

The VS Code extension marketplace page contains [more detailed install instructions](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers#installation).

Open the cloned repository in VS Code and it will offer you to reopen the folder in a development container. The extension will handle the rest of the setup process.

## API key

A Google Cloud Platform API key is required to access data from Google Sheets. To prevent targeted attacks, no API key is part of the source code. For development, create a file named `api.key` in the repository root directory and make this API key the content of that file:

```
AIzaSyAqL193sdtj8fQpeHyoXIg0DOWiI6ujdSU
```

This API key only works, when the application is run on `localhost:3000`. This is the default while developing.

You can also create your own key by following the instructions in [BUILD.md](BUILD.md#api-key).

## npm scripts

Open the terminal inside VS Code using the `View` → `Terminal` action from the menu bar. This terminal runs in the development Docker container. `npm` and all dependencies are already installed in this terminal.

### `npm run dev`

Starts the application in development mode. The dev container extension automatically creates a port forwarding to the container and you can navigate to `http://localhost:3000` on your local machine to see the application running. Changes to the source code will be injected live into the running application. No manual reloads are required.

### `npm run lint`

Runs all ts-standard code checks.

### `npm run build`

Builds the application. Output is available in the `dist` folder.


## Browser dev tools

The [Vue devtools browser extension](https://devtools.vuejs.org/guide/installation.html) can be used to view a lot of the internals of dldu-points.

To open the Vue devtools, open the default browser devtools with `F12` and select the new Vue tab on the right.
