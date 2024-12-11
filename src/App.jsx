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
  const [count, setCount] = useState(0);
  const worker = useRef(null);
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [input, setInput] = useState('I love walking my dog.');
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
  const [output, setOutput] = useState('');

  const translate = () => {
    setDisabled(true);
    worker.current.postMessage({
      text: input,
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage,
    });
  }

  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      // TODO: Will fill in later
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

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
