import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { DirectionalLightHelper } from 'three';
import { Vector3, TextureLoader, DoubleSide, BackSide } from 'three';
import useStore from '../store';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function MovingLight() {


    const lightRef = useRef();
    const helperRef = useRef();
    const planetRef = useRef()
    const { scene } = useThree();

    //  const [dayPhase, setDayPhase] = useState(true);
    const textureLoader = new TextureLoader();
    // const initialSkyboxTexture = textureLoader.load('/skybox.png');
    const initialSkyboxTexture = useLoader(THREE.TextureLoader, '/skybox.png');
    //  console.log(initialSkyboxTexture)
    // const [skyboxTexture, setSkyboxTexture] = useState(initialSkyboxTexture);
    const dayTimelineRef = useRef()

    //the point light replacing the carved sun 
    const [pointLightPosition, setPointLightPosition] = useState(new Vector3(1.5, 1, 1));

    // const [dayNumber, setDayNumber] = useState(1)
    const setDayNumber = useStore(state => state.setDayNumber);
    const incrementDayNumber = useStore(state => state.incrementDayNumber);
    const dayPhase = useStore(state => state.dayPhase);
    const setDayPhase = useStore(state => state.setDayPhase);
    const DAY_STAGES = {
        EARLY: 'early',
        LATE: 'late'
    };

    useEffect(() => {
        if (lightRef.current) {
            const helper = new DirectionalLightHelper(lightRef.current, 1, 'white');
            // scene.add(helper);
            return () => scene.remove(helper);
        }
    }, [scene]);

    //get real-world time
    const getCurrentPhase = () => {
        const hour = new Date().getHours(); // Get the current hour (0-23)
        if (hour >= 6 && hour < 18) { // Consider 6 AM to 6 PM as day
            return 'day';
        } else { // Consider 6 PM to 6 AM as night
            return 'night';
        }
    };

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime(); //set an initial realworld time and map real world time
        const duration = 100; //⚠️ where to modify the time duration -> seconds
        const time = (Math.sin(t / duration * Math.PI) + 1) / 2;

        dayTimelineRef.current = Math.cos(t / duration * Math.PI)

        const time_cycle = (t % duration) / duration;
        const phase_cycle = Math.sin(time_cycle * Math.PI * 2);

        const judgingDayPhaseNum = Math.sin(t / duration * Math.PI)
        const newJudgingDayPhase = Math.sin(t / duration * Math.PI) >= 0;

        if (newJudgingDayPhase !== dayPhase) {
            setDayPhase(newJudgingDayPhase);
        }
        //planet moving trace
        const startPosition = new Vector3(5, 2.5, -5);
        const endPosition = new Vector3(-5, 0, -5);

        const x = startPosition.x + (endPosition.x - startPosition.x) * time_cycle; //was *time
        const y = startPosition.y + (endPosition.y - startPosition.y) * time_cycle;
        const z = startPosition.z + (endPosition.z - startPosition.z) * time_cycle;


        if (lightRef.current) {
            lightRef.current.position.set(x, y, z);
            lightRef.current.lookAt(new Vector3(0, -1, 0));
        }

        if (judgingDayPhaseNum >= 0.12 && judgingDayPhaseNum <= 0.8 && time_cycle <= 0.5) {
            setDayStage(DAY_STAGES.EARLY);
        } else if (judgingDayPhaseNum > 0.7 && judgingDayPhaseNum <= 0.99 && time_cycle <= 0.5) {
            setDayStage(DAY_STAGES.LATE);
        } else {
            setDayStage(null);
        }
    });

    useEffect(() => {
        if (dayPhase) {
            const daySkyboxTexture = textureLoader.load('skybox/day_skybox.png');
            // setSkyboxTexture(daySkyboxTexture);
            incrementDayNumber();
        } else {
            const nightSkyboxTexture = textureLoader.load('skybox/night_skybox.png');
            // setSkyboxTexture(nightSkyboxTexture);
        }
    }, [dayPhase]);

    const [dayStage, setDayStage] = useState(null);


    //light and helper
    useFrame(() => {
        if (lightRef.current && planetRef.current) {
            // Set the sphere's position to match the light's position
            planetRef.current.position.copy(lightRef.current.position);
        }
        if (helperRef.current) {
            helperRef.current.update();
        }
    })

    useFrame(({ clock }) => {
        const targetPosition = dayStage === DAY_STAGES.EARLY ? new Vector3(1.5, 1, 1) :
            dayStage === DAY_STAGES.LATE ? new Vector3(0.15, 1.5, 1) :
                new Vector3(1.5, 1, 1); // Default or fallback position

        // Lerp (Linear Interpolation) towards the target position
        pointLightPosition.lerp(targetPosition, 0.01); // Adjust the 0.05 value to control the speed of the transition
        setPointLightPosition(pointLightPosition.clone());
    });
    const planet_night = textureLoader.load('skybox/moon.jpg');

    return (
        <>
            <directionalLight ref={lightRef} position={[5, -1, 0]} intensity={2.1} color="rgb(255, 205, 54)" />
            <directionalLight position={[5, 10, 35]} intensity={0.1} color="rgb(255, 205, 54)" />
            {dayStage && <pointLight position={[pointLightPosition.x, pointLightPosition.y, pointLightPosition.z]} intensity={10.0} />}

            <mesh ref={planetRef} rotation={[Math.PI / 2, 0, 0]} scale={[0.3, 0.3, 0.3]} >
                <sphereGeometry />
                <MeshTransmissionMaterial
                    color={"#00021c"}
                    thickness={0.01}
                    distortion={0.1}
                    chromaticAberration={0.05}
                    roughness={0.1}
                    transmission={0.2}
                    ior={1.5}
                />
                {/* <meshPhongMaterial color="#ffffff" opacity={0.1} transparent /> */}
                {/* {dayPhase && <meshPhongMaterial color="#000000" opacity={0.5} transparent />}
                {!dayPhase && <meshBasicMaterial color="gray" side={DoubleSide} />} */}
            </mesh>
            <mesh position={[10, 0, 0]} >
                <boxGeometry args={[300, 300, 200]} />
                <meshBasicMaterial map={initialSkyboxTexture} side={BackSide} />
                {/* <meshBasicMaterial color="rgba(30,30,30,0.1)" side={BackSide} /> */}
            </mesh>
        </>
    );
};
