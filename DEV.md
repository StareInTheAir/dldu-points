# Development environment setup instructions

These instructions will help you setup the development tools necessary to make changes to the source code and test them quickly.

## Necessary tools

You need to install:

- [VS Code](https://code.visualstudio.com/)
- The VS Code [Vue - Official (Volar) extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- [pnpm](https://pnpm.io/installation)

After cloning the repository, install and activate the correct Node.js version using nvm, then install dependencies:

```sh
nvm install
nvm use
pnpm install
```

The repository includes an `.nvmrc` file that pins the required Node.js version.

## API key

A Google Cloud Platform API key is required to access data from Google Sheets. To prevent targeted attacks, no API key is part of the source code. For development, create a file named `api.key` in the repository root directory and make this API key the content of that file:

```
AIzaSyA0HixV4dH5WdpOdFOSPfCbQLnmOTJvkXM
```

This API key only works, when the application is run on `localhost:5173`. This is the default while developing.

You can also create your own key by following the instructions in [BUILD.md](BUILD.md#api-key).

## pnpm scripts

Open the terminal inside VS Code using the `View` → `Terminal` action from the menu bar.

### `pnpm run dev`

Starts the application in development mode. Navigate to `http://localhost:5173` to see the application running. Changes to the source code will be injected live into the running application. No manual reloads are required.

### `pnpm run lint`

Runs all eslint code checks.

### `pnpm run build`

Builds the application. Output is available in the `dist` folder.

## Browser dev tools

The [Vue devtools browser extension](https://devtools.vuejs.org/guide/installation.html) can be used to view a lot of the internals of dldu-points.

To open the Vue devtools, open the default browser devtools with `F12` and select the new Vue tab on the right.
