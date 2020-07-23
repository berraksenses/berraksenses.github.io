import * as THREE from 'three';
import headTexture from '../images.png';
import skinTexture from '../skinTexture.jpg';
import shirtTexture from '../shirt.jpg';
// eslint-disable-next-line
import { Scene, Object3D, Vector3 } from 'three';
// eslint-disable-next-line
import Ball from '../Ball';
import {
    TAKING_BALL,
    INITIAL_STATE,
    THROWING_1,
    THROWING_2
} from '../../KeyFrames/humanoid';
import TWEEN from '@tweenjs/tween.js';

class Humanoid {

    /**
     * 
     * @param {Scene} scene 
     */
    constructor(scene) {
        const textureLoader = new THREE.TextureLoader();
        const headTexture2 = textureLoader.load(headTexture);

        const humanGroup = new THREE.Object3D();
        const humanUpperGroup = new THREE.Object3D();

        const skinTexture2 = textureLoader.load(skinTexture);

        const shirtTex = textureLoader.load(shirtTexture);

        const torsoCylinderGeometry = new THREE.CylinderGeometry(0.23, 0.23, 0.95, 0.35);
        const torsoCylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xcf1ff6 });

        const torsoCylinder = new THREE.Mesh(torsoCylinderGeometry, torsoCylinderMaterial);

        const neckCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.18, 0.05);
        const neckCylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xfedaab });

        const neckCylinder = new THREE.Mesh(neckCylinderGeometry, neckCylinderMaterial);

        humanGroup.position.set(-2, 1.1, -4);
        torsoCylinder.add(neckCylinder);

        const sphereGeometry = new THREE.SphereBufferGeometry(
            0.28, 20, 20);

        const headMaterial = new THREE.MeshPhongMaterial({ color: 0xfedaab, map: headTexture2 });
        const headMesh = new THREE.Mesh(sphereGeometry, headMaterial);

        headMesh.name = "head"
        neckCylinder.add(headMesh);
        torsoCylinder.name = "torso"

        headMesh.translateY(0.27);
        //headMesh.rotateY(- Math.PI/180 * 60);
        neckCylinder.translateY(0.55);

        const leftArms = createArm();
        const rightArms = createArm();

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

        torsoCylinder.position.y = 0.45;

        const torsoPivot = new Object3D();
        torsoPivot.add(torsoCylinder);
        torsoPivot.position.y = -0.35;

        const rightLegPivot = new Object3D();
        rightLegPivot.add(rightLegs);
        rightLegs.position.y = -0.2;
        rightLegPivot.position.y = -0.35;

        const leftLegPivot = new Object3D();
        leftLegPivot.add(leftLegs);
        leftLegs.position.y = -0.2;
        leftLegPivot.position.y = -0.35;

        humanUpperGroup.add(torsoPivot);
        humanUpperGroup.add(rightLegPivot);
        humanUpperGroup.add(leftLegPivot);
        humanGroup.add(humanUpperGroup);

        humanGroup.traverse(function (child) {
            if (child.name === "torso") {

                child.material = new THREE.MeshPhongMaterial({
                    map: shirtTex,
                    side: THREE.DoubleSide
                });

            }
            else if (child.name !== "head") child.material = new THREE.MeshPhongMaterial({
                map: skinTexture2,
                side: THREE.DoubleSide
            });



            //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;


        });

        this.humanGroup = humanGroup;


        this.leftUpperArm = leftArms;
        this.rightUpperArm = rightArms;

        this.leftLowerArm = leftArms.children[0].children[0];
        this.rightLowerArm = rightArms.children[0].children[0];

        this.rightUpperLeg = rightLegPivot;
        this.leftUpperLeg = leftLegPivot;

        this.rightLowerLeg = rightLegs.children[0];
        this.leftLowerLeg = leftLegs.children[0];

        this.torsoCylinder = torsoPivot;

        this.state = {

            torsoCylinder: 0,

            leftUpperArm: 0,
            rightUpperArm: 0,

            leftLowerArm: 0,
            rightLowerArm: 0,

            rightUpperLeg: 0,
            leftUpperLeg: 0,

            rightLowerLeg: 0,
            leftLowerLeg: 0,
            positionY: 1.1,
        };

        if (scene) scene.add(this.humanGroup);
        const axesHelper = new THREE.AxesHelper(5);
        this.humanGroup.add(axesHelper);

        this.ballContainer = new Object3D();
        leftArms.children[0].children[0].add(this.ballContainer);
        this.ballContainer.position.y = -0.3;
    }

    update() {
        Object.entries(this.state).forEach(pair => {
            const key = pair[0];
            const value = pair[1];
            if (key === 'positionY') this.humanGroup.position.y = value;
            else this[key].rotation.x = value;
        })
    }

    /**
     * Take the ball from the ground into the arm
     * @param {Ball} ball
     */
    takeTheBall(ball) {
        const promise = new Promise((resolve) => {
            const forwardAnim = new TWEEN.Tween(this.state)
                .to(TAKING_BALL, 1000)
                .onUpdate((st) => {
                    console.log(st);
                    this.update()
                }).onComplete(() => this.ballContainer.add(ball));

            const backwardAnim = new TWEEN.Tween(this.state)
                .to(INITIAL_STATE, 1000)
                .onUpdate(() => this.update())
                .onComplete(resolve);

            forwardAnim.chain(backwardAnim);
            forwardAnim.start();
        });
        return promise;
    }
    /**
     * Throw the ball
     * 
     */
    throwTheBall() {
        const ball = this.ballContainer.children[0];
        if (!ball) {
            console.error("The human doesn't have a ball");
            return;
        }

        const direction = new Vector3(0, 0, 1);
        const throwing1 = new TWEEN.Tween(this.state)
            .to(THROWING_1, 1100)
            .onUpdate((st) => {
                console.log(st);
                this.update()
            });

        const throwing2 = new TWEEN.Tween(this.state)
            .to(THROWING_2, 50)
            .onUpdate(() => this.update())
            .onComplete(() => {
                const position = ball.getWorldPosition();
                this.humanGroup.parent.add(ball);
                ball.position.set(position.x, position.y, position.z);
                ball.throwFrom2(position, direction)
            });
        const throwing3 = new TWEEN.Tween(this.state)
            .to(INITIAL_STATE, 600)
            .onUpdate(() => this.update());
        throwing1.chain(throwing2);
        throwing2.chain(throwing3);
        throwing1.start();
    }
}

function createArm() {


    const armMaterial2 = new THREE.MeshPhongMaterial({ color: 0xcfffff });

    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xD2691E });
    const upperArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
    const upperArmCylinder = new THREE.Mesh(upperArmCylinderGeometry, armMaterial);

    const lowerArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
    const lowerArmCylinder = new THREE.Mesh(lowerArmCylinderGeometry, armMaterial2);

    const pivot = new THREE.Object3D();
    pivot.translateY(-0.2);
    pivot.add(lowerArmCylinder);

    upperArmCylinder.add(pivot);
    lowerArmCylinder.translateY(-0.15);

    const upperArmPivot = new Object3D();
    upperArmCylinder.position.y = -0.17;
    upperArmPivot.add(upperArmCylinder);
    upperArmPivot.position.y = 0.17;

    return upperArmPivot;

}

function createLegs() {

    const legMaterial = new THREE.MeshPhongMaterial({ color: 0xc11f0f });
    const legMaterial2 = new THREE.MeshPhongMaterial({ color: 0xc11fff });


    const upperLegCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 0.005);
    const upperLegCylinder = new THREE.Mesh(upperLegCylinderGeometry, legMaterial);

    const lowerLegCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 0.005);
    const lowerLegCylinder = new THREE.Mesh(lowerLegCylinderGeometry, legMaterial2);

    const pivot = new THREE.Object3D();
    pivot.translateY(-0.25);
    pivot.add(lowerLegCylinder);

    lowerLegCylinder.translateY(-0.25);
    upperLegCylinder.add(pivot);


    return upperLegCylinder;

}


export default Humanoid;