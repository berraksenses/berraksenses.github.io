import * as THREE from 'three';
import headTexture from '../images.png';
import skinTexture from '../skinTexture.jpg';
import shirtTexture from '../shirt.jpg';
// eslint-disable-next-line
import { Scene } from 'three';

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

        humanGroup.position.set(-2, 1.33, -4);
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

        humanUpperGroup.add(torsoCylinder);
        humanUpperGroup.add(leftLegs);
        humanUpperGroup.add(rightLegs);
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

        this.leftLowerArm = leftArms.children[0];
        this.rightLowerArm = rightArms.children[0];

        this.rightUpperLeg = rightLegs;
        this.leftUpperLeg = leftLegs;

        this.rightLowerLeg = rightLegs.children[0];
        this.leftLowerLeg = leftLegs.children[0];

        this.state = {
    
            leftUpperArm: 0,
            rightUpperArm: 0,
    
            leftLowerArm: 0,
            rightLowerArm: 0,
    
            rightUpperLeg: 0,
            leftUpperLeg: 0,
    
            rightLowerLeg: 0,
            leftLowerLeg: 0,
        };
        if (scene) scene.add(this.humanGroup);
        const axesHelper = new THREE.AxesHelper(5);
        this.humanGroup.add(axesHelper);
    }

    update() {
        Object.entries(this.state).forEach(pair => {
            const key = pair[0];
            const value = pair[1];
            this[key].rotation.x = value;
            


        })
    }

    /**
     * Take the ball from the ground into the arm
     */
    takeTheBall() {

    }
    /**
     * Throw the ball
     */
    throwTheBall() {

    }
}

function createArm() {

    // let armMaterial;

    // let lowerArmCylinder;
    // let upperArmCylinder;
    // let upperArmCylinderGeometry;
    // let lowerArmCylinderGeometry;

    const armMaterial2 = new THREE.MeshPhongMaterial({ color: 0xcfffff });

    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xD2691E });
    const upperArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
    const upperArmCylinder = new THREE.Mesh(upperArmCylinderGeometry, armMaterial);

    const lowerArmCylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 0.005);
    const lowerArmCylinder = new THREE.Mesh(lowerArmCylinderGeometry, armMaterial2);


    upperArmCylinder.add(lowerArmCylinder);
    lowerArmCylinder.translateY(-0.35);

    //lowerArmCylinder.rotateZ(Math.PI);

    return upperArmCylinder;

}

function createLegs() {

    // let upperLegCylinderGeometry;
    // let upperLegCylinder;

    // let lowerLegCylinderGeometry;
    // let lowerLegCylinder;
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0xc11f0f });
    const legMaterial2 = new THREE.MeshPhongMaterial({ color: 0xc11fff });


    const upperLegCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 0.005);
    const upperLegCylinder = new THREE.Mesh(upperLegCylinderGeometry, legMaterial);

    const lowerLegCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 0.005);
    const lowerLegCylinder = new THREE.Mesh(lowerLegCylinderGeometry, legMaterial2);

    const pivot = new THREE.Object3D();
    pivot.translateY(-0.20);

    lowerLegCylinder.translateY(-0.5);
    upperLegCylinder.add(lowerLegCylinder);

    

    return upperLegCylinder;

}


export default Humanoid;