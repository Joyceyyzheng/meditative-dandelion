import React, { useMemo, useRef } from "react";
import { Points, Point } from "@react-three/drei";
import { useFrame } from "@react-three/fiber"

import * as THREE from 'three';

export default function Fireflies() {
    const count = 60; // Number of fireflies
    const velocities = useRef(
        new Array(count).fill(0).map(() => Math.random() * 0.0008 - 0.0001)
    )
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)
        const timeOffsets = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 5
            // positions[i * 3 + 1] = Math.pow(Math.random(), 2) * 1000
            positions[i * 3 + 1] = Math.random(-0.5) * 6
            positions[i * 3 + 2] = (Math.random() - 0.8) * 2

            // colors - yellow-orange-red
            let r = 0.5 + Math.random() * 1.4
            let g = 0.5 + Math.random() * 1.7
            let b = 0.5 + Math.random() * 1.7

            colors[i * 3] = r * 70
            colors[i * 3 + 1] = g * 50
            colors[i * 3 + 2] = b * 5
            sizes[i] = 0.1

            timeOffsets[i] = Math.random() * 2 * Math.PI
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        )
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 0.1))
        geometry.setAttribute(
            "timeOffset",
            new THREE.BufferAttribute(timeOffsets, 1)
        )

        return geometry
    }, [])


    useFrame(({ clock }) => {

        const elapsedTime = clock.getElapsedTime()

        const positions = geometry.attributes.position.array
        const sizes = geometry.attributes.size.array
        const colors = geometry.attributes.color.array

        for (let i = 0; i < count; i++) {
            positions[i * 3] += Math.sin(elapsedTime + i) * velocities.current[i]

            positions[i * 3 + 1] =
                Math.sin(elapsedTime * 0.06 + i * 0.5) * 0.5 + velocities.current[i]
            positions[i * 3 + 2] +=
                Math.cos(elapsedTime + i) * velocities.current[i] * 0.1

            sizes[i] = 0.005 + 0.02 * Math.sin(0.05 * i + elapsedTime)

            colors[i * 3 + 0] = 2.5 + 0.5 * Math.sin(elapsedTime + i * 0.1)
        }
        geometry.attributes.position.needsUpdate = true
        geometry.attributes.size.needsUpdate = true
        geometry.attributes.color.needsUpdate = true
    })

    const texture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;

        const ctx = canvas.getContext("2d");
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        return new THREE.CanvasTexture(canvas);
    }, []);


    return (
        <>

            <points geometry={geometry}>
                <bufferAttribute
                    attach={"geometry-color"}
                    array={geometry.color}
                    count={count}
                    itemSize={1}
                // normalized
                />
                {/* </bufferGeometry> */}
                <pointsMaterial
                    map={texture}
                    vertexColors
                    transparent
                    alphaTest={0.5}
                    normalized
                    size={0.035}
                    sizeAttenuation

                />
            </points>
        </>
    );
};
