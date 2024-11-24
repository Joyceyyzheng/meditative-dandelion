import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextureLoader } from 'three';
import { useEffect } from 'react';

export default function Flower() {
    const gltf = useLoader(GLTFLoader, '/whiteflower.gltf')
    const texture = useLoader(TextureLoader, '/whiteflower.png');

    useEffect(() => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
    }, [gltf, texture]);

    return <primitive object={gltf.scene} scale={0.1} />
}

