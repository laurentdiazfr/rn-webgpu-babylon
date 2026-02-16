import { View, Text, StyleSheet } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "react-native-wgpu";
import type { CanvasRef, NativeCanvas } from "react-native-wgpu";

import {
    WebGPUEngine,
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Color3,
    LinesMesh,
    StandardMaterial,
    Color4,
} from "@babylonjs/core";

import { ReactNativeCanvas } from "../lib/ReactNativeCanvas";

export const BabylonCube = () => {
    const ref = useRef<CanvasRef>(null);
    const canvasWrapperRef = useRef<InstanceType<typeof ReactNativeCanvas> | null>(null);
    const [layoutReady, setLayoutReady] = useState(false);
    const [fps, setFps] = useState<number | null>(null);
    const engineRef = useRef<WebGPUEngine | null>(null);

    const onLayout = useCallback(() => {
        requestAnimationFrame(() => setLayoutReady(true));
    }, []);

    useEffect(() => {
        if (!layoutReady || !ref.current || engineRef.current) return;

        let cancelled = false;
        const context = ref.current.getContext("webgpu");
        if (!context) return;

        const canvasWrapper = new ReactNativeCanvas(
            context.canvas as unknown as NativeCanvas,
            context,
        );
        canvasWrapperRef.current = canvasWrapper;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error - WebGPUEngine expects HTMLCanvasElement
        const canvas = canvasWrapper as HTMLCanvasElement;

        const engine = new WebGPUEngine(canvas, {});
        engineRef.current = engine;
        engine.initAsync().then(() => {
            if (cancelled) return;

            const w = canvas.width;
            const h = canvas.height;
            engine.setSize(w, h);

            const scene = new Scene(engine);
            scene.clearColor = new Color4(0.2, 0.2, 0.2, 1.0);

            const light = new HemisphericLight(
                "hemi",
                new Vector3(0, 1, 0),
                scene,
            );
            light.intensity = 0.9;

            const gridSize = 10;
            const step = 0.1;
            const half = gridSize / 2;
            const lines: Vector3[][] = [];
            for (let i = -half; i <= half; i += step) {
                lines.push([new Vector3(-half, 0, i), new Vector3(half, 0, i)]);
                lines.push([new Vector3(i, 0, -half), new Vector3(i, 0, half)]);
            }
            const grid = MeshBuilder.CreateLineSystem("grid", { lines }, scene) as LinesMesh;
            grid.color = new Color3(0.6, 0.6, 0.6);

            const mesh = MeshBuilder.CreateBox("box", { size: 1 }, scene);
            const mat = new StandardMaterial("boxMat", scene);
            mat.diffuseColor = new Color3(0, 1, 0);
            mesh.material = mat;

            const camera = new ArcRotateCamera(
                "camera",
                Math.PI / 4,
                Math.PI / 3,
                5,
                new Vector3(0, 0.5, 0),
                scene,
            );
            /*
            Logically, context.present should be called after the scene is rendered but
            it creates many warnings...
             */
            scene.onBeforeRenderObservable.add(() => {
                if (cancelled) return;
                context.present();
            });

            let lastFpsUpdate = 0;
            engine.runRenderLoop(() => {
                if (cancelled) return;
                mesh.rotation.y += 0.01;
                scene.render();
                const now = Date.now();
                if (now - lastFpsUpdate >= 500) {
                    lastFpsUpdate = now;
                    setFps(Math.round(engine!.getFps()));
                }
            });

        });

        return () => {
            cancelled = true;
            canvasWrapperRef.current = null;
        };
    }, [layoutReady]);

    return (<View style={styles.container}>
        <Canvas ref={ref} style={styles.canvas} onLayout={onLayout} />
        {fps !== null && (
            <Text style={styles.fps} pointerEvents="none">
                {fps} FPS
            </Text>
        )}
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    canvas: {
        flex: 1,
    },
    fps: {
        position: "absolute",
        top: 12,
        left: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "#7f7",
        fontFamily: "monospace",
        fontSize: 14,
        borderRadius: 4,
    },
});

export default BabylonCube;