# Speechy Browser Extension

Speechy uses AI based analysis to provide feedback and recommendations to passively improve your English speech.

### Build Extensions to the `/dist` repo

```bash
$ npm install
$ npx chromane build
```

### Launch Dev process that watches for changes and generates the `/extension` folder with an installable extension

```bash
$ npx chromane watch
```

### Installing developer versions on Chrome

1. Go to your [Chrome Extension Tab](chrome://extensions/)

2. Make sure developer mode is enabled

3. Click "Load unpacked extension..." Be sure to select the entire folder containing the `manifest.json` file from `/extension` or `/dist` ( not `/src` )