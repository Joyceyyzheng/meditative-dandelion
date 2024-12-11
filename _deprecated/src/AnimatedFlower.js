import { React, useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useStore from "./store";

//this script is for step-by-step triggering of animations
//⚠️currently not being used in the project
function Model() {
  const flowerRef = useRef();
  const test_model = useLoader(
    GLTFLoader,
    `${process.env.PUBLIC_URL}/models/dandelion_keyframetest_02.glb`
  );
  const { nodes, animations } = useGLTF(
    `${process.env.PUBLIC_URL}/models/dandelion_keyframetest_02.glb`
  );
  console.info(animations);
  const { actions } = useAnimations(test_model.animations, test_model.scene);
  const mixer = useRef(new THREE.AnimationMixer(null));
  const [animationPlayed, setAnimationPlayed] = useState(false);
  // const [groupOne, setGroupOne] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);
  //0-21,22-43,44-65,66-87,88-109,110-131,132-153,154-175,176-197,198-219

  // const [groupOne, setGroupOne] = useState([0, 1, 2]);//花蕊和叶子长高
  // const [groupTwo, setGroupTwo] = useState([3, 4, 5]);//叶子往外扩展
  // const [groupThree, setGroupThree] = useState([6, 7, 8]);//叶子扩展到位
  // const [groupFour, setGroupFour] = useState([9, 10, 11]);//花蕊完全抽出来
  // const [groupFive, setGroupFive] = useState([12, 13, 14]);//另一组花蕊完全抽出来
  // const [groupSix, setGroupSix] = useState([15, 16, 17]);//内侧花瓣完全长出来
  // const [groupSeven, setGroupSeven] = useState([18, 19, 20, 21, 22]);//外侧花瓣完全长出来

  const [groupOne, setGroupOne] = useState([]); //花蕊和叶子长高
  const [groupTwo, setGroupTwo] = useState([]); //叶子往外扩展
  // const [groupThree, setGroupThree] = useState([1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);//叶子扩展到位
  const [groupThree, setGroupThree] = useState(
    Array.from({ length: 219 }, (_, i) => i + 1)
  );
  const [groupFour, setGroupFour] = useState([]); //花蕊完全抽出来
  const [groupFive, setGroupFive] = useState([]); //另一组花蕊完全抽出来
  const [groupSix, setGroupSix] = useState([]); //内侧花瓣完全长出来
  const [groupSeven, setGroupSeven] = useState([]); //外侧花瓣完全长出来

  const dayNumber = useStore((state) => state.dayNumber);
  // console.info(nodes)

  // const mixer = new THREE.AnimationMixer(test_model.scene);
  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(test_model.scene);
    //  console.log("mixer", mixer.current)
  }, [test_model]);

  useEffect(() => {
    if (dayNumber === 0) {
      console.info(" number=0");
      // Stop all animations
      if (mixer.current) {
        console.info("stopping all actions");
        mixer.current.stopAllAction();
        // mixer.current.reset();
      }
      setAnimationPlayed(false);
    }
  }, [dayNumber, test_model.scene]);

  useEffect(() => {
    if (animations.length > 0 && dayNumber === 1) {
      // Stop all current animations before starting new ones
      mixer.current.stopAllAction();

      // Iterate over the selected group of animations to play
      groupOne.forEach((index) => {
        if (animations[index]) {
          const action = mixer.current.clipAction(animations[index]);
          action.setLoop(THREE.LoopOnce);
          action.clampWhenFinished = true;
          action.play();
        }
      });

      // Set a flag to avoid replaying the animations until intended
      setAnimationPlayed(true);
    } else if (dayNumber !== 1) {
      setAnimationPlayed(false);
    }
  }, [animations, groupOne, dayNumber]);

  useEffect(() => {
    if (animations.length > 0) {
      if (dayNumber === 2) {
        groupTwo.forEach((index) => {
          if (animations[index]) {
            const action = mixer.current.clipAction(animations[index]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
          }
        });
        setAnimationPlayed(true);
      }
    }
  }, [animations, animationPlayed, groupTwo, dayNumber]);

  useEffect(() => {
    if (animations.length > 0) {
      if (dayNumber === 3) {
        groupThree.forEach((index) => {
          if (animations[index]) {
            const action = mixer.current.clipAction(animations[index]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
          }
        });
        setAnimationPlayed(true);
      }
    }
  }, [animations, animationPlayed, groupThree, dayNumber]);

  useEffect(() => {
    if (animations.length > 0) {
      if (dayNumber === 4) {
        groupFour.forEach((index) => {
          if (animations[index]) {
            const action = mixer.current.clipAction(animations[index]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
          }
        });
        setAnimationPlayed(true);
      }
    }
  }, [animations, animationPlayed, groupFour, dayNumber]);

  useEffect(() => {
    if (animations.length > 0) {
      if (dayNumber === 5) {
        groupFive.forEach((index) => {
          if (animations[index]) {
            const action = mixer.current.clipAction(animations[index]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
          }
        });
        setAnimationPlayed(true);
      }
    }
  }, [animations, animationPlayed, groupFive, dayNumber]);

  useEffect(() => {
    if (animations.length > 0) {
      if (dayNumber === 6) {
        groupSix.forEach((index) => {
          if (animations[index]) {
            const action = mixer.current.clipAction(animations[index]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
          }
        });
        setAnimationPlayed(true);
      }
    }
  }, [animations, animationPlayed, groupSix, dayNumber]);

  useEffect(() => {
    if (animations.length > 0) {
      if (dayNumber === 7) {
        groupSeven.forEach((index) => {
          if (animations[index]) {
            const action = mixer.current.clipAction(animations[index]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
          }
        });
        setAnimationPlayed(true);
      }
    }
  }, [animations, animationPlayed, groupSeven, dayNumber]);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  return (
    <group ref={flowerRef} dispose={null}>
      <primitive
        object={test_model.scene}
        position={[0, -1, 0]}
        scale={[0.1, 0.1, 0.1]}
      >
        <meshStandardMaterial
          // ref={planeMaterialRef}
          //⚠️ updating material type
          attach="material"
          side={THREE.DoubleSide}
        />
      </primitive>
    </group>
  );
}

export default function AnimatedFlower() {
  return (
    <>
      <Model />
    </>
  );
}
