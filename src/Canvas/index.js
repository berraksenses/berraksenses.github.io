import React from 'react';
import * as THREE from 'three';
import './Canvas.css';

class Canvas extends React.Component {
    
    constructor(props) {
        super(props);
        
        const fov = 40;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        camera.position.z = 20;
        
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xAAAAAA);

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        
        const width = 10.0;  
        const height = 10.0;  
        const depth = 10.0;
        const objGeometry = new THREE.CircleBufferGeometry(10, 30);
        const objMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
        const obj = new THREE.Mesh(objGeometry, objMaterial);
        obj.position.z = -20;

        this.obj = obj;

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }
        
        this.camera = camera;
        this.scene = scene;
        this.isActive = true;

        this.cubes = [
            makeCubeInstance(geometry, 0x44aa88,  0),
            makeCubeInstance(geometry, 0x8844aa, -2),
            makeCubeInstance(geometry, 0xaa8844,  2),
        ];
        
        // this.cubes.forEach(cube => scene.add(cube))
        scene.add(obj);

    }
    componentDidMount() {
        const canvas = document.getElementById("canvas");
        this.renderer = new THREE.WebGLRenderer({ canvas });

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.renderUpdate());
        
    }
    componentWillUnmount() {
        this.isActive = false;
    }

    renderUpdate() {
        const {
            obj,
            scene,
            renderer,
            camera
        } = this;
        if (!this.isActive) return;
        
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        

        // cubes.forEach((cube, ndx) => {
        //     const angle = 0.01;
        //     const speed = 1 + ndx * .1;
        //     const rot = angle * speed;
        //     cube.rotation.x += rot;
        //     cube.rotation.y += rot;
        // });
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;

        renderer.render(scene, camera);

        window.requestAnimationFrame(() => this.renderUpdate());
    }
    
    render() {
        return (
        
            <canvas id="canvas"/>
        
        );
    }
}

function makeCubeInstance(geometry, color, x) {

    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geometry, material);
   
    cube.position.x = x;

    return cube;
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

export default Canvas;