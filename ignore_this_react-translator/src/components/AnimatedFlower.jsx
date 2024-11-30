import { React, useRef, useEffect, useState, Suspense } from "react"
import * as THREE from "three"
import { useThree, useFrame, useLoader } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import useStore from "../store"

//this script is for step-by-step triggering of animations
function Model() {
    const flowerRef = useRef()
    const test_model = useLoader(GLTFLoader, `../models/dandelion_keyframetest_02.glb`)
    const { nodes, animations } = useGLTF(`../models/dandelion_keyframetest_02.glb`)

    const { actions } = useAnimations(test_model.animations, test_model.scene);
    const mixer = useRef(new THREE.AnimationMixer(null));


    const desiredDuration = 139; // total duration in seconds for all animations
    const actualDuration = animations.reduce((acc, anim) => acc + anim.duration, 0); // sum of all animation durations

    const playbackSpeed = desiredDuration / actualDuration;

    // const mixer = new THREE.AnimationMixer(test_model.scene);
    useEffect(() => {
        mixer.current = new THREE.AnimationMixer(test_model.scene);
    }, [test_model]);


    useEffect(() => {
        if (animations.length > 0) {
            // mixer.current.stopAllAction();
            animations.forEach(clip => {
                const action = mixer.current.clipAction(clip);
                action.setLoop(THREE.LoopRepeat);
                action.setDuration(desiredDuration);
                // action.setEffectiveTimeScale(playbackSpeed);
                action.play();

            });
            return () => {
                if (mixer.current) {
                    mixer.current.stopAllAction();
                }
            }
        }
    }, [animations, test_model, playbackSpeed]);

    useFrame((state, delta) => {
        mixer.current.update(delta);
    });

    return (
        <group ref={flowerRef} dispose={null}

        >
            <primitive object={test_model.scene} position={[0, -1, 0]} scale={[0.1, 0.1, 0.1]}>
                <meshStandardMaterial
                    attach="material"
                    side={THREE.DoubleSide}
                />
            </primitive>
        </group>
    )
}

export default function AnimatedFlower() {
    return (
        <>
            <Model />
        </>
    )
}

