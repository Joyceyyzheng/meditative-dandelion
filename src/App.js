import React from "react";
import "./App.css";

import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
// import { AmbientLight } from 'three';
import { OrbitControls } from "@react-three/drei";
import StaticUI from "./StaticUI";
import { useStore } from "./store";
import { useEffect } from "react";
import Ground from "./Ground";
// import Flower from './Flower';
import MovingLight from "./MovingLight";
import CamUsage from "./CamUsage";
import { PerspectiveCamera } from "@react-three/drei";
import Fireflies from "./Fireflies";
// import AnimatedFlower from './AnimatedFlower';
import AnimatedFlowerTime from "./AnimatedFlower_time";
import DandelionBot from "./DandelionBot"; //⚠️where it's causing the error.

function App() {
  const dayPhase = useStore((state) => state.dayPhase);

  return (
    <div className="App">
      <div id="canvas-container">
        <StaticUI />
        {/* <DandelionBot /> */}

        <Canvas
          onCreated={(state) => {
            /* console.log(state)*/
          }}
          gl={{ antialias: false }}
        >
          <ambientLight intensity={4.0} />
          <pointLight position={[-0.5, -2, 1]} intensity={1} />
          <MovingLight />

          {!dayPhase && <Fireflies />}
          <AnimatedFlowerTime />
          <mesh>
            <Scene />
          </mesh>
          {/* <OrbitControls /> */}
          <CamUsage />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
