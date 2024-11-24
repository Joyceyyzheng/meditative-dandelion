
import './App.css';
import React from 'react';
import { Vector3, TextureLoader, DoubleSide, BackSide } from 'three';
import { useVideoTexture } from '@react-three/drei';

export default function Ground() {
    const textureLoader = new TextureLoader();
    const testVideoMat = useVideoTexture('/file.mp4', {
        crossOrigin: 'anonymous', // Important for cross-origin videos
    });
    const testMat = textureLoader.load('/test_trans_png.png');
    return (
        <>

            <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[5, 10, 8]} >
                {/* <planeGeometry /> */}
                <meshStandardMaterial color="green" side={DoubleSide} />
            </mesh>

            <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]} >
                <sphereGeometry />
                <meshStandardMaterial transparent map={testVideoMat} opacity={0.8} side={DoubleSide} />
            </mesh>
        </>



    );
}


