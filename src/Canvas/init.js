import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';

import dat from 'dat.gui';
import grass from './Models/10450_Rectangular_Grass_Patch_L3.123c827d110a-1347-4381-9208-e4f735762647/10450_Rectangular_Grass_Patch_v1_iterations-2.obj';
import grassMaterial from './Models/10450_Rectangular_Grass_Patch_L3.123c827d110a-1347-4381-9208-e4f735762647/10450_Rectangular_Grass_Patch_v1_iterations-2.mtl';
import imge from './Models/10450_Rectangular_Grass_Patch_L3.123c827d110a-1347-4381-9208-e4f735762647/10450_Rectangular_Grass_Patch_v1_Diffuse.jpeg';
import house from './Models/Thai_house.obj';
import houseTexture from './Models/download2.jpeg';
import treeObj from './Models/tree2.obj';
import bark from './Models/bark.png';
import leaf from './Models/leaf.png';
import TWEEN from '@tweenjs/tween.js';
import Doggo from './Models/Doggo';
import Humanoid from './Models/Humanoid';
import Stats from 'stats.js';

import fenceObj from './Models/Fence.obj';
import cremeTexture from './Models/creme.jpg';

import {
    GLOBAL_LIGHT_COLOR,
    GLOBAL_LIGHT_INTENSITY,
    GLOBAL_LIGHT_TARGET,
    GLOBAL_LIGHT_POSITION,
    AMBIENT_LIGHT_COLOR,
    AMBIENT_LIGHT_INTENSITY
} from '../constants';

import { Vector3 } from 'three';
import Ball from './Models/Ball';



// window.dogState = states.dog;


const fov = 45;
const near = 0.001;
const far = 100000;
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfffff1);

let renderer;

function initialization(reactComponent) {


    camera.up.set(0, 1, 0);
    camera.position.set(-1, 3, 7);
    camera.lookAt(0, 0, 0);



    //scene.add(doggo.rootGroup);

    const canvas = document.getElementById("canvas");
    renderer = new THREE.WebGLRenderer({ canvas });

    renderer.render(scene, camera);

    const doggo = new Doggo(scene);
    const humanoid = new Humanoid(scene);
    const humanoidBallPosition = humanoid.getBallPlacePosition();
    const ball = new Ball();
    ball.position.set(humanoidBallPosition.x, humanoidBallPosition.y, humanoidBallPosition.z);
    console.log("humanoidBallPosition", humanoidBallPosition);
    scene.add(ball);
    const guiButtons = { 
        logInTheConsole: () => {console.log(doggo.state)},
        startWalking: () => doggo.startWalking(),
        stopWalking: () => doggo.stopWalking(),
        move: () => doggo.moveTo(10, 10),
        takeBall: () => {
            const ball = new Ball();
            doggo.takeTheBall(ball)
        },
        putBall: () => {
            doggo.putTheBall();
        },
        throwBall: () => {
            const ball = new Ball();
            scene.add(ball);
            const startPosition = new Vector3(0, 0, 0);
            const direction = new Vector3(0, 0, 1);
            ball.throwFrom2(startPosition, direction);
        },
        logHumanoid: () => {
            console.log("HUMANOID");
            console.log(humanoid.state);
            console.log("Y: ", humanoid.humanGroup.position.y);
        },
        humanoidTakingBall: () => {
            const ball = new Ball();
            humanoid.takeTheBall(ball);
        },
        humanoidThrowingBall: () => {
            humanoid.throwTheBall();
        },
        startProcess: () => {
            
            humanoid.takeTheBall(ball)
                .then(() => humanoid.throwTheBall())
                .then(() => doggo.standUpAndMoveTo(ball.position.x, ball.position.z))
                .then(() => doggo.takeTheBall(ball))
                .then(() => doggo.moveTo(humanoidBallPosition.x, humanoidBallPosition.z))
                .then(() => doggo.putTheBall())
                .then(() => doggo.sitDown());
        }
     };
    const gui = new dat.GUI();
    const dogFolder = gui.addFolder('Doggo');
    dogFolder.add(doggo.state, 'torso', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'neck', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'tail', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'leftUpperArm', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'rightUpperArm', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'leftLowerArm', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'rightLowerArm', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'rightUpperLeg', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'leftUpperLeg', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'rightLowerLeg', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(doggo.state, 'leftLowerLeg', -2 * Math.PI, 2 * Math.PI).onChange(() => doggo.update());
    dogFolder.add(guiButtons, 'logInTheConsole');
    dogFolder.add(guiButtons, 'startWalking');
    dogFolder.add(guiButtons, 'stopWalking');
    dogFolder.add(guiButtons, 'move');
    dogFolder.add(guiButtons, 'takeBall');
    dogFolder.add(guiButtons, 'putBall');
    dogFolder.add(guiButtons, 'throwBall');

    const humanoidFolder = gui.addFolder('Humanoid');
    humanoidFolder.add(humanoid.state, 'leftUpperArm', -2 * Math.PI, 2 * Math.PI).onChange(() => humanoid.update());
    humanoidFolder.add(humanoid.state, 'rightUpperArm', -2 * Math.PI, 2 * Math.PI).onChange(() =>humanoid.update());
    humanoidFolder.add(humanoid.state, 'leftLowerArm', -2 * Math.PI, 2 * Math.PI).onChange(() => humanoid.update());
    humanoidFolder.add(humanoid.state, 'rightLowerArm', -2 * Math.PI, 2 * Math.PI).onChange(() => humanoid.update());
    humanoidFolder.add(humanoid.state, 'rightUpperLeg', -2 * Math.PI, 2 * Math.PI).onChange(() =>humanoid.update());
    humanoidFolder.add(humanoid.state, 'leftUpperLeg', -2 * Math.PI, 2 * Math.PI).onChange(() => humanoid.update());
    humanoidFolder.add(humanoid.state, 'rightLowerLeg', -2 * Math.PI, 2 * Math.PI).onChange(() => humanoid.update());
    humanoidFolder.add(humanoid.state, 'leftLowerLeg', -2 * Math.PI, 2 * Math.PI).onChange(() => humanoid.update());
    humanoidFolder.add(humanoid.state, 'torsoCylinder', -2 * Math.PI, 2 * Math.PI).onChange(() => humanoid.update());
    //humanoidFolder.add(humanoid.humanGroup.position, 'x', -2, 2).onChange(() => humanoid.update());
    humanoidFolder.add(humanoid.humanGroup.position, 'y', 0, 1.5);
    humanoidFolder.add(guiButtons, 'logHumanoid');
    humanoidFolder.add(guiButtons, 'humanoidTakingBall');
    humanoidFolder.add(guiButtons, 'humanoidThrowingBall');
    humanoidFolder.add(guiButtons, 'startProcess');
    //humanoidFolder.add(humanoid.humanGroup.position, 'z', -2 * Math.PI, 2 * Math.PI).onChange(() => humanoid.update());

    
    gui.remember(doggo.state);

    //doggo.update();

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 2, -1);
    controls.update();

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    {

        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader2();

        mtlLoader.load(grassMaterial, (mtlParseResult) => {
            mtlParseResult.preload();
            const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
            for (const material of Object.values(materials)) {
                material.side = THREE.DoubleSide;
            }
            objLoader.addMaterials(materials);
            objLoader.load(grass, (root) => {

                var textureLoader = new THREE.TextureLoader();
                var texture = textureLoader.load(imge);
                root.traverse(function (child) {
                    if (child.isMesh) child.material = new THREE.MeshPhongMaterial({
                        //color:     0x996633,
                        //specular:  0x050505,
                        //shininess: my_shine_value,
                        map: texture,
                        //side:      THREE.DoubleSide
                    });
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;


                });

                root.updateMatrixWorld();
                scene.add(root);

                root.rotateZ(Math.PI);
                root.rotateX(Math.PI / 2);
                root.position.set(0, -0.8, -4);
                root.scale.set(0.15, 0.15, 0.08);

            });
        });

        const houseObjLoader = new OBJLoader2();

        houseObjLoader.load(house, (littleHouse) => {
            var textureLoader = new THREE.TextureLoader();
            var texture = textureLoader.load(houseTexture);
            littleHouse.traverse(function (child) {
                if (child.isMesh) child.material = new THREE.MeshPhongMaterial({
                    //color: 0x996633,
                    //specular: 0x050505,
                    //shininess:1000,

                    map: texture,
                    side: THREE.DoubleSide
                });
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            });
            littleHouse.updateMatrixWorld();
            scene.add(littleHouse);
            littleHouse.rotateY(-2 * Math.PI);
            littleHouse.position.set(-10, -0.8, -20);
            littleHouse.scale.set(1, 1, 0.5);
        });

        const treeObjLoader = new OBJLoader2();

        treeObjLoader.load(treeObj, (tree) => {
            var textureLoader = new THREE.TextureLoader();
            var textureLeaf = textureLoader.load(leaf);
            var textureBark = textureLoader.load(bark);
            var texture;

            tree.traverse(function (child) {
                console.log(tree.children[1].name);
                if (child.name === "tree tree_leaves") {
                    texture = textureLeaf;
                }
                else {
                    texture = textureBark;
                }

                child.material = new THREE.MeshPhongMaterial({
                    //color: 0x996633,
                    //specular: 0x050505,
                    //shininess:1000,

                    map: texture,
                    side: THREE.DoubleSide
                });

            });
            tree.updateMatrixWorld();
            scene.add(tree);
            tree.position.set(10, -0.8, -20);
            tree.scale.set(0.1, 0.1, 0.1);
        });


        const fenceObjLoader = new OBJLoader2();

        fenceObjLoader.load(fenceObj, (fence) => {
            var textureLoader = new THREE.TextureLoader();
            var texture = textureLoader.load(cremeTexture);
            fence.traverse(function (child) {
                if (child.isMesh) child.material = new THREE.MeshPhongMaterial({
                    //color: 0x996633,
                    //specular: 0x050505,
                    //shininess:1000,

                    map: texture,
                    side: THREE.DoubleSide
                });
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            });
            fence.updateMatrixWorld();
            scene.add(fence);

            fence.scale.set(0.1, 0.15, 0.45);

            fence.position.set(-22.9, -0.8, -33);
            var rightFence = fence.clone(); // or any other coordinates

            var topFence = fence.clone(); // or any other coordinates

     
            topFence.rotateY(Math.PI / 2);
            topFence.scale.set(0.2, 0.15, 0.48);
            topFence.position.set(-31, -0.8, -25);
       var endFence = topFence.clone();

            endFence.position.set(-31, -0.8, 19.5 );

            rightFence.translateX(45);
            scene.add(topFence);
            scene.add(rightFence);
            scene.add(endFence);
        });



    }


    {
        const directionalLight = new THREE.DirectionalLight(GLOBAL_LIGHT_COLOR, GLOBAL_LIGHT_INTENSITY);
        directionalLight.target.position.copy(GLOBAL_LIGHT_TARGET);
        directionalLight.position.copy(GLOBAL_LIGHT_POSITION);

        const light = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY);

        scene.add(light);
        scene.add(directionalLight);
        scene.add(directionalLight.target);
    }
    const stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    function animate() {
	    stats.begin();

	    // monitored code goes here
	    stats.end();

    }
    const mainLoop = () => {
        TWEEN.update();
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;

            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        animate();

        renderer.render(scene, camera);
        // when canvas is removed from dom then stop the infinite loop
        if (reactComponent.isActive)
            requestAnimationFrame(mainLoop);
    }
    mainLoop();
}


function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}



export default initialization;
