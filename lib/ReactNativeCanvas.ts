// https://github.com/wcandillon/react-native-webgpu/blob/578ad989b4326724702b14245d5c82622849ee23/apps/example/src/ThreeJS/components/makeWebGPURenderer.ts#L1
import type { NativeCanvas } from "react-native-wgpu";

export class ReactNativeCanvas {
    constructor(private canvas: NativeCanvas, private _context: any) { }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    set width(width: number) {
        this.canvas.width = width;
    }

    set height(height: number) {
        this.canvas.height = height;
    }

    get clientWidth() {
        return this.canvas.width;
    }

    get clientHeight() {
        return this.canvas.height;
    }

    set clientWidth(width: number) {
        this.canvas.width = width;
    }

    set clientHeight(height: number) {
        this.canvas.height = height;
    }

    getContext(type: string): any {
        return this._context;
    }
    addEventListener(_type: string, _listener: EventListener) {
        // TODO
    }

    removeEventListener(_type: string, _listener: EventListener) {
        // TODO
    }

    dispatchEvent(_event: Event) {
        // TODO
    }

    setPointerCapture() {
        // TODO
    }

    releasePointerCapture() {
        // TODO
    }
}