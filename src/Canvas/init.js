import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Floor from './Models/Floor';
import { 
    GLOBAL_LIGHT_COLOR, 
    GLOBAL_LIGHT_INTENSITY, 
    GLOBAL_LIGHT_TARGET, 
    GLOBAL_LIGHT_POSITION, 
    AMBIENT_LIGHT_COLOR, 
    AMBIENT_LIGHT_INTENSITY 
} from '../constants';

let leftDogArm;
let rightDogArm;
let leftDogLeg;
let rightDogLeg;
let dogGroup;
let time = 0;
let legForwardFlag = true;


const fov = 45;
const near = 0.001;
const far = 100000;
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);

const scene = new THREE.Scene();


const humanGroup = new THREE.Object3D();
const humanUpperGroup = new THREE.Object3D();
let renderer;

function initialization(reactComponent) {
    

    camera.up.set(0, 1, 0);
    camera.position.set(0, 7, 7);
    camera.lookAt(0, 0, 0);

    createHumanoid();
    createDoggo();
    
    const canvas = document.getElementById("canvas");
    renderer = new THREE.WebGLRenderer({ canvas });

    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 2, -1);
    controls.update();
    scene.add(Floor());

    {
        const directionalLight = new THREE.DirectionalLight( GLOBAL_LIGHT_COLOR, GLOBAL_LIGHT_INTENSITY );
        directionalLight.target.position.copy(GLOBAL_LIGHT_TARGET);
        directionalLight.position.copy(GLOBAL_LIGHT_POSITION);

        const light = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY);
        
        scene.add( light );
        scene.add( directionalLight );
        scene.add( directionalLight.target );
    }

    const mainLoop = () => {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        if (time <= 30 && legForwardFlag) {

            leftDogArm.rotateZ(-Math.PI / 180);
            rightDogArm.rotateZ(+Math.PI / 180); 
            rightDogLeg.rotateZ(-Math.PI / 180);

            leftDogLeg.rotateZ(+Math.PI / 180);

            rightDogLeg.children[0].rotateZ(-Math.PI / 180);
            leftDogLeg.children[0].rotateZ(+Math.PI / 180);

            leftDogArm.children[0].rotateZ(-Math.PI / 180);
            rightDogArm.children[0].rotateZ(+Math.PI / 180);

           (time === 30) ? (legForwardFlag = false) : time += 1;
        }
        else {
            leftDogArm.rotateZ(+Math.PI /180);                
            rightDogArm.rotateZ(-Math.PI / 180);

            rightDogLeg.rotateZ(+Math.PI / 180); 
            leftDogLeg.rotateZ(-Math.PI / 180);

            rightDogLeg.children[0].rotateZ(+Math.PI / 180);
            leftDogLeg.children[0].rotateZ(-Math.PI / 180);

            leftDogArm.children[0].rotateZ(+Math.PI / 180);
            rightDogArm.children[0].rotateZ(-Math.PI / 180);

            (time === 0) ? legForwardFlag = true : time -= 1;

        }

        renderer.render(scene, camera);
        // when canvas is removed from dom then stop the infinite loop
        if (reactComponent.isActive)
            requestAnimationFrame(mainLoop);
    }
    mainLoop();
}


function createArm(dogLegFlag) {

    let armMaterial;

    let lowerArmCylinder;
    let upperArmCylinder;
    let upperArmCylinderGeometry;
    let lowerArmCylinderGeometry;

    //if (dogLegFlag) {
    //    armMaterial = new THREE.MeshPhongMaterial({ color: 0xD2691E });

    //    upperArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
    //    upperArmCylinder = new THREE.Mesh(upperArmCylinderGeometry, armMaterial);

    //    lowerArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
    //    lowerArmCylinder = new THREE.Mesh(lowerArmCylinderGeometry, armMaterial);

    //} else {
        const armMaterial2 = new THREE.MeshPhongMaterial({ color: 0xcfffff });

        armMaterial = new THREE.MeshPhongMaterial({ color: 0xD2691E });
        upperArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
        upperArmCylinder = new THREE.Mesh(upperArmCylinderGeometry, armMaterial);

        lowerArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
        lowerArmCylinder = new THREE.Mesh(lowerArmCylinderGeometry, armMaterial2);

    
    upperArmCylinder.add(lowerArmCylinder);
    lowerArmCylinder.translateY(-0.35);
 
    //lowerArmCylinder.rotateZ(Math.PI);

    return upperArmCylinder;

}

function createLegs() {

    let upperLegCylinderGeometry;
    let upperLegCylinder;

    let lowerLegCylinderGeometry;
    let lowerLegCylinder;
    let legMaterial = new THREE.MeshPhongMaterial({ color: 0xc11f0f });
    let legMaterial2 = new THREE.MeshPhongMaterial({ color: 0xc11fff });


    upperLegCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.95, 0.005);
    upperLegCylinder = new THREE.Mesh(upperLegCylinderGeometry, legMaterial);

    lowerLegCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.25, 0.005);
    lowerLegCylinder = new THREE.Mesh(lowerLegCylinderGeometry, legMaterial2);

    lowerLegCylinder.translateY(-0.6);
    upperLegCylinder.add(lowerLegCylinder);

    return upperLegCylinder;

}



function createHumanoid() {

    const dogLegFlag = false;

    const torsoCylinderGeometry = new THREE.CylinderGeometry(0.23, 0.23, 0.95, 0.35);
    const torsoCylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xcf1ff6 });

    const torsoCylinder = new THREE.Mesh(torsoCylinderGeometry, torsoCylinderMaterial);

    const neckCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.18, 0.05);
    const neckCylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xcf1f1f });

    const neckCylinder = new THREE.Mesh(neckCylinderGeometry, neckCylinderMaterial);

    humanGroup.position.set(-2, 0, -4);
    torsoCylinder.add(neckCylinder);

    const sphereGeometry = new THREE.SphereBufferGeometry(
        0.18, 20, 20);

    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFF00 });
    const headMesh = new THREE.Mesh(sphereGeometry, headMaterial);
    
    neckCylinder.add(headMesh);

    headMesh.translateY(0.27);
    neckCylinder.translateY(0.55);

    const leftArms = createArm(dogLegFlag);
    const rightArms = createArm(dogLegFlag);

    const leftLegs = createLegs();
    const rightLegs = createLegs();

    rightArms.translateX(0.29);
    rightArms.translateY(0.25);

    leftArms.translateX(-0.27);
    leftArms.translateY(0.25);

    rightLegs.translateX(0.08);
    rightLegs.translateY(-0.55);

    leftLegs.translateX(-0.12);
    leftLegs.translateY(-0.55);

    torsoCylinder.add(rightArms);
    torsoCylinder.add(leftArms);
    
    humanUpperGroup.add(torsoCylinder);
    humanUpperGroup.add(leftLegs);
    humanUpperGroup.add(rightLegs);
    //humanUpperGroup.translateY(-0.2); when you will use the decreasing part of the upper body you will use this in the animation
    //humanUpperGroup.rotateZ(radians); //when the human will get the stick from the ground he will use this to lay down 
    humanGroup.add(humanUpperGroup);

   
    //humanGroup.scale.set(1,1,1.2); 
    scene.add(humanGroup);

}



function createDoggo() {

    dogGroup = new THREE.Object3D();
    const dogLegFlag = true;


    const eyesGeometry = new THREE.SphereBufferGeometry(
        0.045, 50, 50);
    const eyesMaterial = new THREE.MeshPhongMaterial({ color: 0xdad9ff});

    const eye1 = new THREE.Mesh(eyesGeometry, eyesMaterial);
    const eye2 = new THREE.Mesh(eyesGeometry, eyesMaterial);

    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xda2c43 });
    const nose = new THREE.Mesh(eyesGeometry, noseMaterial);

    dogGroup.position.set(1, 0, -4);

    const earGeometry = new THREE.BoxGeometry(0.08, 0.3, 0.2);
    const earMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const ear1 = new THREE.Mesh(earGeometry, earMaterial);
    const ear2 = new THREE.Mesh(earGeometry, earMaterial);

    ear1.translateZ(0.2);
    ear2.translateZ(-0.2);
                

    const neckCylinderGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 0.05);
    const neckCylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

    const neckCylinder = new THREE.Mesh(neckCylinderGeometry, neckCylinderMaterial);

    const tailCylinderGeometry = new THREE.CylinderGeometry(0.23, .05, 0.05, 0.06);

    const sphereGeometry = new THREE.SphereBufferGeometry(0.25, 20, 40);
    const sphereGeometryTorso = sphereGeometry.scale(2.5, 1, 1);

    const torsoMaterial = new THREE.MeshPhongMaterial({ color: 0xD2691E });
    const torsoMesh = new THREE.Mesh(sphereGeometryTorso, torsoMaterial);

    const headGeometry = new THREE.SphereBufferGeometry(0.25, 20, 20);
    const headMesh = new THREE.Mesh(headGeometry, torsoMaterial);

    leftDogLeg = createArm(dogLegFlag);
    leftDogArm = createArm(dogLegFlag);

    rightDogLeg = createArm(dogLegFlag);
    rightDogArm = createArm(dogLegFlag);

    const tailMesh = new THREE.Mesh(tailCylinderGeometry, torsoMaterial);
    tailMesh.rotateZ(Math.PI / 7);

    tailMesh.translateX(0.7);
    tailMesh.translateY(-0.1);

    headMesh.add(eye1);
    headMesh.add(eye2);
    headMesh.add(ear1);
    headMesh.add(ear2);
    headMesh.add(nose);

    nose.translateX(-0.24);
    nose.translateY(-0.05);
    eye1.translateZ(0.15);
    eye1.translateY(0.05)
    eye1.translateX(-0.2);

    eye2.translateZ(-0.15);
    eye2.translateY(0.05);
    eye2.translateX(-0.2);


    neckCylinder.translateX(-0.5);
    neckCylinder.translateY(0.2);
    headMesh.translateY(0.3);
    headMesh.rotateZ(-Math.PI / 7); //due to neck, also the head is rotated. with this it is reversed.
    neckCylinder.rotateZ(Math.PI / 7);

    rightDogArm.translateX(0.3);
    rightDogArm.translateY(-0.3);
    rightDogArm.translateZ(0.2);


    leftDogArm.translateX(0.3);
    leftDogArm.translateY(-0.3);
    //leftDogArm.translateZ(-0.2);


    rightDogLeg.translateX(-0.3);
    rightDogLeg.translateY(-0.3);
    rightDogLeg.translateZ(0.2);


    leftDogLeg.translateX(-0.3);
    leftDogLeg.translateY(-0.3);
    leftDogLeg.translateZ(-0.2);



    //leftDogArm.children[0].rotateZ(Math.PI);



    torsoMesh.add(leftDogArm);
    torsoMesh.add(leftDogLeg);
    torsoMesh.add(rightDogArm);
    torsoMesh.add(rightDogLeg);

    torsoMesh.add(tailMesh);
    torsoMesh.add(neckCylinder);
    neckCylinder.add(headMesh);

    dogGroup.add(torsoMesh);
    scene.add(dogGroup);


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