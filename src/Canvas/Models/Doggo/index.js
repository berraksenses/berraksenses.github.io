import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { Vector3, Object3D } from 'three';
import {
    INITIAL_STATE as DOGGO_INITIAL_STATE,
    WALKING_1 as DOGGO_WALKING_1,
    WALKING_2 as DOGGO_WALKING_2,
    TAKING_BALL
} from '../../KeyFrames/doggo';
import Ball from '../Ball';
const Y_COORD = 0.85;
const SPEED = 5; // meters per second

class Doggo {

    constructor(parent) {

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

        const tailCylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 0.15);

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
        //tailMesh.translateY(-Math.PI / 2);

        tailMesh.translateX(0.6);
        tailMesh.translateY(0.2);
        tailMesh.rotateZ(Math.PI);

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


        neckCylinder.rotateZ(Math.PI / 7);
        headMesh.rotateZ(-Math.PI / 7); //due to neck, also the head is rotated. with this it is reversed.

        rightDogArm.translateX(-0.3);
        rightDogArm.translateY(-0.25);
        rightDogArm.translateZ(0.13);

        rightDogLeg.translateX(0.25);
        rightDogLeg.translateY(-0.25);
        rightDogLeg.translateZ(0.13);

        leftDogArm.translateX(-0.3);
        leftDogArm.translateY(-0.25);
        leftDogArm.translateZ(-0.13);

        leftDogLeg.translateX(0.25);
        leftDogLeg.translateY(-0.25);
        leftDogLeg.translateZ(-0.13);

        torsoMesh.add(leftDogArm);
        torsoMesh.add(leftDogLeg);
        torsoMesh.add(rightDogArm);
        torsoMesh.add(rightDogLeg);

        torsoMesh.add(tailMesh);
        torsoMesh.add(neckCylinder);
        neckCylinder.add(headMesh);

        this.ballContainer = new Object3D();
        
        this.ballContainer.position.x= -0.3;
        this.ballContainer.position.y = -0.2;
        headMesh.add(this.ballContainer);

        this.dogGroup.add(torsoMesh);
        //this.dogGroup.rotateY(Math.PI / 2);

        this.head = headMesh;

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
        // this.prevState = {
        //     torso: 0,
        //     neck: 0,
        //     tail: 0,

        //     leftUpperArm: 0,
        //     rightUpperArm: 0,

        //     leftLowerArm: 0,
        //     rightLowerArm: 0,

        //     rightUpperLeg: 0,
        //     leftUpperLeg: 0,

        //     rightLowerLeg: 0,
        //     leftLowerLeg: 0,
        // };
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

        const axesHelper = new THREE.AxesHelper(5);
        this.dogGroup.add(axesHelper);

        parent.add(this.dogGroup);
        this.torso.rotateY(Math.PI / 2);

    }

    update() {

        Object.entries(this.state).forEach(pair => {
            const key = pair[0];
            const value = pair[1];
            if (key === "tail") {
                this[key].rotation.x = value;
            }

            else {
                this[key].rotation.z = value;
            }


        })
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
    /**
     * 
     * @param {Vector3} currDirection 
     * @param {Vector3} destinationDirection 
     */
    getAngleSignOfRotation(currDirection, destinationDirection) {
        const crossProduct = new Vector3();
        crossProduct.crossVectors(currDirection, destinationDirection);
        return Math.sign(crossProduct.y);
    }

    moveTo(x, z) {
        const promise = new Promise((resolve) => {
            console.log("start movement");
            const destination = new Vector3(x, Y_COORD, z);
            const distance = destination.distanceTo(this.dogGroup.position);
            const time = (distance / SPEED) * 1000; // in milliseconds
    
            const direction = new Vector3();
            this.dogGroup.getWorldDirection(direction);
            const destinationDirection = new Vector3();
    
            destinationDirection.subVectors(destination, this.dogGroup.position).normalize();
            console.log("destination direction", destinationDirection);
            console.log("current direction", direction);
            // const destinationDirectionObj = { x: destinationDirection.x, z: destinationDirection.z };
            const angle = { y: 0 };
    
            const rotationSign = this.getAngleSignOfRotation(direction, destinationDirection);
    
            const rotation = new TWEEN.Tween(angle)
                .to({ y: direction.angleTo(destinationDirection) }, 1000)
                .onUpdate(() => {
                    console.log("angleUpdate", angle.y);
                    this.dogGroup.rotation.y = rotationSign * angle.y
                })
                .onComplete(() => {
                    console.log("after", direction);
                    console.log("world direction: ", this.dogGroup.getWorldDirection());
                    this.startWalking();
                    new TWEEN.Tween(this.dogGroup.position)
                        .to({ x, z }, time)
                        .start()
                        .onComplete(() => {
                            this.stopWalking();
                            resolve();
                        });
                })
    
            rotation.start();
        });
        return promise;
    }
    /**
     * 
     * @param {Object3D} ball
     * @returns {Promise}
     */
    takeTheBall(ball) {
        const promise = new Promise((resolve) => {
            ball.position.set(0, 0, 0);
            const forwardAnim = new TWEEN.Tween(this.state)
                .to(TAKING_BALL, 1000)
                .onUpdate(() => this.update())
                .onComplete(() => this.ballContainer.add(ball));
            
            const backwardAnim = new TWEEN.Tween(this.state)
                .to(DOGGO_INITIAL_STATE, 1000)
                .onUpdate(() => this.update())
                .onComplete(resolve);
            
            forwardAnim.chain(backwardAnim);
            forwardAnim.start();
    
        });
        return promise;
    }
    /**
     * @returns {Promise}
     */
    putTheBall() {
        const LENGTH = 1;
        if (this.ballContainer.children.length === 0) {
            
            console.error("The dog doesn't have the ball");
            return Promise.reject();
        }
        const promise = new Promise((resolve) => {
            const direction = new Vector3();
            this.dogGroup.getWorldDirection(direction);
            
            const ball = this.ballContainer.children[0];
            const forwardAnim = new TWEEN.Tween(this.state)
                .to(TAKING_BALL, 1000)
                .onUpdate(() => this.update())
                .onComplete(() => {
                    this.rootGroup.parent.add(ball);
                    ball.position.x = this.rootGroup.position.x + direction.x * LENGTH;
                    ball.position.y = 0 + Ball.RADIUS;
                    ball.position.z = this.rootGroup.position.z + direction.z * LENGTH;
                });
            
            const backwardAnim = new TWEEN.Tween(this.state)
                .to(DOGGO_INITIAL_STATE, 1000)
                .onUpdate(() => this.update())
                .onComplete(resolve);
            
            forwardAnim.chain(backwardAnim);
            forwardAnim.start();
        });
        return promise;
    }
}

function createArm() {

    let armMaterial;

    let lowerArmCylinder;
    let upperArmCylinder;
    let upperArmCylinderGeometry;
    let lowerArmCylinderGeometry;



    armMaterial = new THREE.MeshPhongMaterial({ color: 0xD2691E });
    upperArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
    upperArmCylinder = new THREE.Mesh(upperArmCylinderGeometry, armMaterial);


    lowerArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
    lowerArmCylinder = new THREE.Mesh(lowerArmCylinderGeometry, armMaterial);

    var pivot = new THREE.Object3D();
    pivot.translateY(-0.20);

    upperArmCylinder.add(pivot);
    pivot.add(lowerArmCylinder);

    lowerArmCylinder.translateY(-0.15);

    return upperArmCylinder;

}

export default Doggo;
