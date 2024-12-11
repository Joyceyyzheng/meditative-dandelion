import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import React from 'react';
// this is where the main model sits

export default function Scene() {
    const fbx_dirt = useLoader(FBXLoader, "../models/mockup_dirt.fbx")
    // console.log(fbx_dirt)
    // const fbx_flower = useLoader(FBXLoader, `${process.env.PUBLIC_URL}/models/mockup_flower.fbx`)
    // const fbx_tree = useLoader(FBXLoader, `${process.env.PUBLIC_URL}/models/mockup_tree.fbx`)
    const test_model = useLoader(GLTFLoader, "../models/tree_bark02.glb")

    return <>
        <group position={[0, -1, 1]} scale={[2, 2, 2]}>
            <primitive object={fbx_dirt} position={[0, -0.05, 0.2]} scale={[1, 2, 1]} />
            {/* <primitive object={fbx_flower} position={[0, 0, 0]} /> */}
            {/* <primitive object={fbx_tree} position={[0, 0, 0]} /> */}
            <primitive object={test_model.scene} position={[0, -0.5, -0.7]} scale={[0.03, 0.03, 0.03]} />
        </group>
    </>
}

