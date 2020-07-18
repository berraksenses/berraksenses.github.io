import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { Vector3 } from 'three';
import {
    INITIAL_STATE as DOGGO_INITIAL_STATE,
    WALKING_1 as DOGGO_WALKING_1,
    WALKING_2 as DOGGO_WALKING_2,
} from '../../KeyFrames/doggo';
const Y_COORD = 0.85;
const SPEED = 5; // meters per second

class Doggo {
    
    constructor() {
        
        this.dogGroup = new THREE.Object3D();
        this.rootGroup = this.dogGroup;

        const eyesGeometry = new THREE.SphereBufferGeometry(
            0.045, 50, 50);
        const eyesMaterial = new THREE.MeshPhongMaterial({ color: 0xdad9ff });

        const eye1 = new THREE.Mesh(eyesGeometry, eyesMaterial);
        const eye2 = new THREE.Mesh(eyesGeometry, eyesMaterial);

        const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xda2c43 });
        const nose = new THREE.Mesh(eyesGeometry, noseMaterial);

        this.dogGroup.position.set(1, Y_COORD, -4);

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

        const leftDogLeg = createArm();
        const leftDogArm = createArm();

        const rightDogLeg = createArm();
        const rightDogArm = createArm();

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

        this.dogGroup.add(torsoMesh);
        
        this.torso = torsoMesh;
        
        this.neck = neckCylinder;
        this.tail = tailMesh;

        this.rightUpperArm = rightDogArm;
        this.rightLowerArm = rightDogArm.children[0];

        this.leftUpperArm = leftDogArm;
        this.leftLowerArm = leftDogArm.children[0];

        this.rightUpperLeg = rightDogLeg;
        this.rightLowerLeg = rightDogLeg.children[0];

        this.leftUpperLeg = leftDogLeg;
        this.leftLowerLeg = leftDogLeg.children[0];

        this.state = {
            torso: 0,
            neck: 0,
            tail: 0,

            leftUpperArm: 0,
            rightUpperArm: 0,

            leftLowerArm: 0,
            rightLowerArm: 0,

            rightUpperLeg: 0,
            leftUpperLeg: 0,

            rightLowerLeg: 0,
            leftLowerLeg: 0,
        };

        this.animDoggoWalking_1 = new TWEEN.Tween(this.state).to(DOGGO_WALKING_1, 500).onUpdate(() => this.update());
        this.animDoggoWalking_2 = new TWEEN.Tween(this.state).to(DOGGO_WALKING_2, 500).repeat(Infinity).yoyo(true).onUpdate(() => this.update());


        //scene.add(dogGroup);

    }

    update() {
        Object.entries(this.state).forEach(pair => {
            const key = pair[0];
            const value = pair[1];
            this[key].setRotationFromAxisAngle(new Vector3(0, 0, 1), value);
        });
    }

    setState(state) {
        this.state = state;
        this.update();
    }

    startWalking() {
    
        this.animDoggoWalking_1 = new TWEEN.Tween(this.state).to(DOGGO_WALKING_1, 500).onUpdate(() => this.update());
        this.animDoggoWalking_2 = new TWEEN.Tween(this.state).to(DOGGO_WALKING_2, 500).repeat(Infinity).yoyo(true).onUpdate(() => this.update());

        this.animDoggoWalking_1.start();
        this.animDoggoWalking_1.chain(this.animDoggoWalking_2);
    }


    stopWalking() {
        this.animDoggoWalking_2.stop();
        this.setState({ ...DOGGO_INITIAL_STATE });
    }

    moveTo(x, z) {
        console.log("start movement");
        const destination = new Vector3(x, Y_COORD, z);
        const distance = destination.distanceTo(this.dogGroup.position);
        const time = (distance / SPEED) * 1000; // in milliseconds
        
        const direction = new Vector3();
        this.dogGroup.getWorldDirection(direction);
        const destinationDirection = new Vector3();
        
        destinationDirection.subVectors(destination, this.dogGroup.position);

        const rotation = new TWEEN.Tween(direction)
            .to(destinationDirection, 1000)
            .onUpdate(() => this.dogGroup.lookAt(direction))
            .onComplete(() => {
                this.startWalking();
                new TWEEN.Tween(this.dogGroup.position)
                    .to({x, z}, time)
                    .start()
                    .onComplete(() => this.stopWalking());
            })
            
        rotation.start();
    }

    takeBall() {
        console.error("Not Implemented");
    }
}

function createArm() {

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

export default Doggo;
