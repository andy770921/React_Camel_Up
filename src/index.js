import './css/normalize.css';
import './css/common.css';
import './css/index.css';
import React from "react";
import ReactDOM from "react-dom";
import ThreeScene from "./three_scene";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


import * as THREE from 'three';
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from 'three-orbitcontrols';

/*
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
// let controls = new THREE.OrbitControls( camera, renderer.domElement );
// let geometry = new THREE.BoxGeometry(1, 1, 1);
// let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// let cube = new THREE.Mesh(geometry, material);
// // cube.scale.set(0.1, 0.1, 0.1);
// scene.add(cube);
// console.log(cube);
// let light = new THREE.AmbientLight(0xffff6f);
// let pointLight = new THREE.PointLight(0xea7500);
// pointLight.position.set(0, 50, 0);
// pointLight.castShadow = true;
// scene.add(light);
// scene.add(pointLight);
camera.position.z = 10;
// let mtlLoader = new MTLLoader();
// mtlLoader.setTexturePath("asset/B_OBJ/");
// mtlLoader.setPath("asset/B_OBJ/");
// mtlLoader.load("untitled2.mtl", materials => {
//  materials.preload();
//  console.log(materials);
//  let objLoader = new OBJLoader();
//  objLoader.setMaterials(materials);
//  objLoader.setPath("asset/B_OBJ/");
//  objLoader.load("untitled2.obj", obj => {
//    // obj.scale.set(0.001, 0.001, 0.001);
//    obj.position.y -= 3;
//    scene.add(obj);
//    console.log(obj);
//    console.log(scene);
//  });
// });

const objLoader = new OBJLoader();
    objLoader.setPath('asset/B_OBJ/');
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('asset/B_OBJ/');
    new Promise((resolve) => {
      mtlLoader.load('D.mtl', (materials) => {
        resolve(materials);
      });
    })
    .then((materials) => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load('D.obj', (object) => {
        scene.add(object);
      });
    });

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
// let keyLight = new THREE.DirectionalLight(new THREE.color("hsl(30, 100%, 75%)"), 1.0);
// keyLight.position.set(-100, 0, 100);
// let fillLight = new THREE.DirectionalLight(new THREE.color("hsl(240, 100%, 75%)"), 0.75);
// fillLight.position.set(100, 0, 100);
// let backLight = new THREE.DirectionalLight(new THREE.color(0xffffff, 1.0);
// backLight.position.set(100, 0, -100).normalize();
//
// scene.add(keyLight);
// scene.add(fillLight);
// scene.add(backLight);


// var spotLight = new THREE.SpotLight( 0xffffff );
// spotLight.position.set( 100, 1000, 100 );
// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.near = 500;
// spotLight.shadow.camera.far = 4000;
// spotLight.shadow.camera.fov = 30;
// scene.add( spotLight );
var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

var color = new THREE.Color( 0xd5f3fe );
scene.background = color;
// const light = new THREE.DirectionalLight('#ffffff', 0.9);
//     light.position.set(-20, 0, 100);
//     scene.add(light);

// var loader = new GLTFLoader();

// loader.load( 'asset/low_poly_desert_gltf/scene.glb', function ( gltf ) {

// 	scene.add( gltf.scene );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let animate = () => {
 requestAnimationFrame(animate);
 controls.update();
 // cube.rotation.x += 0.01;
 // cube.rotation.y += 0.01;
 renderer.render(scene, camera);
}
// need to do WebGL compatibility check before animate()
animate();


*/


class App extends React.Component {
    state = {
        name: "Ryu",
        age: 30
    }
    render () {
        return (
            <div className="background">
                <p> My name is { this.state.name } and I am { this.state.age }. </p>
                <ThreeScene />

            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#root"));