import React, { useMemo, useRef } from "react";
import { Points, Point } from "@react-three/drei";
import { useFrame } from "@react-three/fiber"

import * as THREE from 'three';

export default function Fireflies() {
    const count = 40; // Number of fireflies
    const velocities = useRef(
        new Array(count).fill(0).map(() => Math.random() * 0.0008 - 0.0001)
    )
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)
        const timeOffsets = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 3
            // positions[i * 3 + 1] = Math.pow(Math.random(), 2) * 1000
            positions[i * 3 + 1] = Math.random(-0.5) * 10
            positions[i * 3 + 2] = (Math.random() - 0.3) * 1

            // colors - yellow-orange-red
            let r = 0.5 + Math.random() * 1.4
            let g = 0.5 + Math.random() * 1.7
            let b = 0.5 + Math.random() * 1.7

            colors[i * 3] = r * 70
            colors[i * 3 + 1] = g * 50
            colors[i * 3 + 2] = b * 5
            sizes[i] = 10.0

            timeOffsets[i] = Math.random() * 2 * Math.PI
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        )
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
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

            sizes[i] = 0.01 + 0.03 * Math.sin(0.1 * i + elapsedTime)

            colors[i * 3 + 0] = 2.5 + 0.5 * Math.sin(elapsedTime + i * 0.1)
        }
        geometry.attributes.position.needsUpdate = true
        geometry.attributes.size.needsUpdate = true
        geometry.attributes.color.needsUpdate = true
    })


    return (
        <>

            <points geometry={geometry}>
                <bufferAttribute
                    attach={"geometry-color"}
                    array={geometry.color}
                    count={count}
                    itemSize={3}
                // normalized
                />
                {/* </bufferGeometry> */}
                <pointsMaterial
                    vertexColors
                    transparent
                    alphaTest={0.5}
                    normalized
                    size={0.018}
                    sizeAttenuation

                />
            </points>
        </>
    );
};
