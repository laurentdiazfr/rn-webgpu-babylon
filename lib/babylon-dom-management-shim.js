/**
 * Shim for @babylonjs/core/Misc/domManagement.js (React Native).
 * IsWindowObjectExist() and IsDocumentAvailable() return false so Babylon
 * skips window/document code (getHostWindow returns null, no addEventListener on window/document).
 */

function IsWindowObjectExist() {
    return false;
}

function IsDocumentAvailable() {
    return false;
}

function IsNavigatorAvailable() {
    return typeof navigator !== "undefined";
}

function GetDOMTextContent() {
    return "";
}

export const DomManagement = {
    IsWindowObjectExist,
    IsDocumentAvailable,
    IsNavigatorAvailable,
    GetDOMTextContent,
};

export { IsWindowObjectExist, IsDocumentAvailable, IsNavigatorAvailable, GetDOMTextContent };
