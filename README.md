# Babylon.js with react-native-wgpu

A minimal demo running Babylon.js on React Native via WebGPU using [react-native-wgpu](https://github.com/wcandillon/react-native-webgpu).

You should see a green cube rotating on a grid. Moving the camera is not working yet.

---

## How to run

**Prerequisites:** [Expo environment setup](https://docs.expo.dev/tutorial/create-your-first-app/) (Node, iOS/Android tooling).

```bash
git clone https://github.com/laurentdiazfr/rn-webgpu-babylon
cd rn-webgpu-babylon
npm install
npx expo prebuild
npx expo run:android   # or: npx expo run:ios
```

---

## Notes

- **DOM / `window`** — If `window` is defined, Babylon.js expects `window.addEventListener`. React Native doesn’t provide it. This project avoids that by replacing Babylon’s `domManagement.js` with `babylon-dom-management-shim.js` in the Metro config. An alternative is to extend `window` with `addEventListener` (as Babylon Native does).

- **`context.present()`** — Calling `context.present()` in the render loop right after `scene.render()` causes issues. It’s done instead in an observer; `onBeforeRenderObservable` is the only place that works without WebGPU warnings.

- **Inputs** — With no real `window`, inputs don’t work and the camera doesn’t move. Work in progress: injecting input via the same mechanism as Babylon Native (`_native.DeviceInputSystem`). A separate demo will be added if a proper solution is found.
