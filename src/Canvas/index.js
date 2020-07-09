import React from 'react';
import * as THREE from 'three';
import initialization from './init';
import './Canvas.css';

class Canvas extends React.Component {

    componentDidMount() {
        // const canvas = document.getElementById("canvas");
        // this.renderer = new THREE.WebGLRenderer({ canvas });

        // this.renderer.render(this.scene, this.camera);
        // window.requestAnimationFrame(() => this.renderUpdate());
        initialization(this);
        
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