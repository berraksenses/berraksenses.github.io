import * as THREE from 'three';
// eslint-disable-next-line
import { Object3D, Vector3 } from "three";
import TWEEN from '@tweenjs/tween.js';

class Ball extends Object3D {
    static RADIUS = 0.1;
    static THROWING_DISTANCE = 11.47;
    static ANGLE = 45;
    static INITIAL_SPEED = 12;
    static INITIAL_HEIGHT = 2;
    
    
    constructor() {
        super();
        const radius =  0.1;  
        const widthSegments =  9;  
        const heightSegments =  9;  

        const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshPhongMaterial({ color: 0x800000 });
        const ballMesh = new THREE.Mesh(geometry, material);

        this.add(ballMesh);
    }
    /**
     * 
     * @param {Vector3} startPosVec 
     * @param {Vector3} directionVec
     */
    throwFrom(startPosVec, directionVec) {
        //console.log("Ball is THROWN from", startPosVec);
        this.position.set(startPosVec.x, startPosVec.y, startPosVec.z);
        //console.log("position", this.position)
        directionVec.normalize();
        const destination = {};
        destination.x = startPosVec.x + directionVec.x * Ball.THROWING_DISTANCE;
        destination.y = Ball.RADIUS;
        destination.z = startPosVec.z + directionVec.z * Ball.THROWING_DISTANCE;
        //console.log("destination", destination);
        
        new TWEEN.Tween(this.position).easing(TWEEN.Easing.Bounce.Out).to(destination, 1000).start().onComplete(
            () => console.log("completed")
        );
    }

    computeTrajectory(steps = 10, initialHeight) {
        console.log('args:', arguments);
        const diff = Ball.THROWING_DISTANCE / steps;
        const pairs = [];
        let x;
        for (let i = 0; i <= steps; i++) {
            x = diff * i;
            pairs.push([x, this.trajectoryFormula(x, undefined, undefined, initialHeight)]);
        }
        return pairs;
    }
    /**
     * 
     * @param {Vector3} startPosVec 
     * @param {Vector3} directionVec 
     */
    throwFrom2(startPosVec, directionVec, cb) {
        
        const trajectory = this.computeTrajectory(10, 0);
        //console.log('Trajectory', trajectory);
        const initPos = startPosVec;
        const TIME = 100;
        let prevPos = initPos;
        const tweens = trajectory.map((pair, i) => {
            const nextPos = {
                x: initPos.x + directionVec.x * pair[0],
                y: initPos.y + pair[1],
                z: initPos.z + directionVec.z * pair[0]
            };
            if (i === (trajectory.length-1)) nextPos.y = Ball.RADIUS;
            //console.log('prevPos', {...prevPos})
            //console.log('nextPos', {...nextPos});
            const tw = new TWEEN.Tween({ ...prevPos }).to({ ...nextPos }, TIME)
                .onUpdate(obj => this.position.set(obj.x, obj.y, obj.z));
            prevPos = { ...nextPos};
            return tw;
        });
        tweens.shift();
        tweens.reduce((acc, tw) => {
            acc.chain(tw);
            return tw;
        });
        if (cb) {
            tweens[tweens.length - 1].onComplete(cb);
        }
        tweens[0].start();

    }

    trajectoryFormula(x, angle = 10, initialSpeed = 10, initialHeight = 2) {
        return initialHeight + (x * Math.tan(angle) - (10 /( 2 * (initialSpeed**2) * (Math.cos(angle))**2)) * (x**2));
    }

}

export default Ball;