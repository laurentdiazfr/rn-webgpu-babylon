const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const BABYLON_DOM_SHIM = path.join(__dirname, "lib/babylon-dom-management-shim.js");

// These are all positive changes that enforce a more standard WebGPU-compatible three.js build.
config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Redirect Babylon domManagement to our shim (IsWindowObjectExist / IsDocumentAvailable → false).
    const fromBabylon = context.originModulePath?.includes("babylonjs");
    const isDomManagement =
        moduleName?.includes("domManagement") ||
        moduleName?.endsWith("domManagement.js") ||
        moduleName?.endsWith("domManagement");
    if (fromBabylon && isDomManagement) {
        return { type: "sourceFile", filePath: BABYLON_DOM_SHIM };
    }

    const result = context.resolveRequest(context, moduleName, platform);
    const filePath = result?.filePath ?? result?.resolution?.filePath;
    if (filePath?.includes("babylonjs") && filePath?.includes("domManagement")) {
        return { type: "sourceFile", filePath: BABYLON_DOM_SHIM };
    }
    return result;
};

module.exports = config;
