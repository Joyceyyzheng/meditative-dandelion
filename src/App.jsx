import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import LanguageSelector from './components/LanguageSelector';
import Progress from './components/Progress';
import DandelionBot from "./components/DandelionBot";
// import RiveBot from "./components/BotRive";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import CamUsage from "./components/CamUsage";
import MovingLight from "./components/MovingLight";
import AnimatedFlower from "./components/AnimatedFlower";
import Fireflies from "./components/Fireflies";

function App() {


  return (
    <>


      <DandelionBot />

      <div className="canvas-container">
        <Canvas>
          <ambientLight intensity={4.0} />
          <pointLight position={[-0.5, -2, 1]} intensity={1} />
          <MovingLight />
          <AnimatedFlower />
          <Fireflies />
          <mesh>
            <Scene />
          </mesh>
          {/* <OrbitControls /> */}
          <OrbitControls
            enablePan={true} // Disable dragging
            enableRotate={false} // Allow rotation (looking around)
            minDistance={1} // Minimum zoom distance
            maxDistance={2.2} // Maximum zoom distance
            minPolarAngle={Math.PI / 6} // Constrain tilt down (30°)
            maxPolarAngle={Math.PI / 2} // Constrain tilt up (90°)
            enableDamping={true} // Enable smooth transitions
            dampingFactor={0.05} // Adjust damping smoothness
          />
          <CamUsage />
        </Canvas>
      </div>
      {/*<RiveBot />*/}


    </>
  )
}

export default App;
