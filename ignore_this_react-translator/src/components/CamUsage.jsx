import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function CamUsage() {
    const { camera } = useThree(); // Destructure camera from the returned object



    useEffect(() => {
        camera.position.set(0, 0.4, 3.1);
        // camera.rotation = { [30, 0, 0]};
        camera.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(5), THREE.MathUtils.degToRad(-1));
        camera.fov = 60;

        camera.updateProjectionMatrix();
        // camera.lookAt(0, 0, 0); // Ensuring the camera is looking at the center
    }, [camera]);




    return null; // This component does not render anything
}
