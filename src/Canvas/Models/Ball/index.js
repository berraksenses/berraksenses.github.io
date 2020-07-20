import * as THREE from 'three';
import { Object3D } from "three";

class Ball extends Object3D {
    static RADIUS = 0.1;
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
}

export default Ball;