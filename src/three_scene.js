import React, { Component } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from 'three-orbitcontrols';

let jumpInfo = {
    x: 12,
    y: 17.2,
    z: 12,
    r: 0,
    dx: 0, // delta x and y
    dy: 0,
    onGround: true,
    triggerJump: false,
    jumpPower: -1,  // power of jump smaller jumps higher eg -10 smaller than -5
    moveSpeed: 0.72, // moveSpeed: 0.252, 0.501, 0.72 
    rotationSpeed: -0.063,
    world: {
        gravity: 0.08, // strength per frame of gravity
        drag: 1, // 0.999 play with this value to change drag
        // groundDrag: 0.9, // play with this value to change ground movement
        ground: 17.2 //17.2, 18.6
    }
};



class ThreeScene extends Component {
    state = {
        camels: [],
        run: false,
        step: 0,
        level: 0,
        boardPosLevelOne: [
            { x: 12, y: 17.2, z: 12 }, { x: 6, y: 17.2, z: 12 }, { x: 0, y: 17.2, z: 12 }, { x: -6, y: 17.2, z: 12 }, { x: -12, y: 17.2, z: 12 }, 
            { x: -12, y: 17.2, z: 6 }, { x: -12, y: 17.2, z: 0 }, { x: -12, y: 17.2, z: -6 }, { x: -12, y: 17.2, z: -12 }, { x: -6, y: 17.2, z: -12 }, 
            { x: 0, y: 17.2, z: -12 }, { x: 6, y: 17.2, z: -12 }, { x: 12, y: 17.2, z: -12 }, { x: 12, y: 17.2, z: -6 }, { x: 12, y: 17.2, z: 0 },
            { x: 12, y: 17.2, z: 6 } ],
        levelHeight: 1.4,
        turnRightYrotation: -1.575,
        jumpPara: { oneStepSpeed: 0.252, twoStepSpeed: 0.501, threeStepSpeed: 0.72 }
    }
    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        // ADD SCENE
        this.scene = new THREE.Scene();
        const color = new THREE.Color(0xd5f3fe);
        this.scene.background = color;
        // ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );

        // FIRST PERSPECTIVE
        // this.camera.position.set( 0.025, 32.272, 16.959 );

        // SECOND PERSPECTIVE
        this.camera.position.set(12.224269097110634, 28.06120661987065, 20.449256738974572);

        // THIRD PERSPECTIVE
        // this.camera.position.set( -10.498, 28.194, -20.637 );

        // ADD LIGHT
        this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(this.light);
        // this.light = new THREE.AmbientLight(0xffffff); // soft white light
        // this.scene.add(this.light);
        // ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
        // ADD CUBE
        const cubedlength = 6;
        const cubeDepth = 15.5;
        const geometry = new THREE.BoxGeometry(cubedlength, 1.5, cubedlength);
        //const material = new THREE.MeshBasicMaterial({ color: '#433F81' });
        const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('asset/sand/sand15.jpg'), side: THREE.DoubleSide });
        const materialTex = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('asset/sand/sand12.jpg'), side: THREE.DoubleSide });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.set(12, cubeDepth, 12);
        this.scene.add(this.cube);

        this.cube3 = new THREE.Mesh(geometry, material);
        this.cube3.position.set(12 - 2 * cubedlength, cubeDepth, 12);
        this.scene.add(this.cube3);

        this.cube5 = new THREE.Mesh(geometry, material);
        this.cube5.position.set(12 - 4 * cubedlength, cubeDepth, 12);
        this.scene.add(this.cube5);

        this.cube7 = new THREE.Mesh(geometry, material);
        this.cube7.position.set(12 - 4 * cubedlength, cubeDepth, 12 - 2 * cubedlength);
        this.scene.add(this.cube7);

        this.cube9 = new THREE.Mesh(geometry, material);
        this.cube9.position.set(12 - 4 * cubedlength, cubeDepth, 12 - 4 * cubedlength);
        this.scene.add(this.cube9);

        this.cube11 = new THREE.Mesh(geometry, material);
        this.cube11.position.set(12 - 2 * cubedlength, cubeDepth, 12 - 4 * cubedlength);
        this.scene.add(this.cube11);

        this.cube13 = new THREE.Mesh(geometry, material);
        this.cube13.position.set(12, cubeDepth, 12 - 4 * cubedlength);
        this.scene.add(this.cube13);

        this.cube15 = new THREE.Mesh(geometry, material);
        this.cube15.position.set(12, cubeDepth, 12 - 2 * cubedlength);
        this.scene.add(this.cube15);

        // ADD CUBE2
        this.cube2 = new THREE.Mesh(geometry, materialTex);
        this.cube2.position.set(12 - cubedlength, cubeDepth, 12);
        this.scene.add(this.cube2);

        this.cube4 = new THREE.Mesh(geometry, materialTex);
        this.cube4.position.set(12 - 3 * cubedlength, cubeDepth, 12);
        this.scene.add(this.cube4);

        this.cube6 = new THREE.Mesh(geometry, materialTex);
        this.cube6.position.set(12 - 4 * cubedlength, cubeDepth, 12 - cubedlength);
        this.scene.add(this.cube6);

        this.cube8 = new THREE.Mesh(geometry, materialTex);
        this.cube8.position.set(12 - 4 * cubedlength, cubeDepth, 12 - 3 * cubedlength);
        this.scene.add(this.cube8);

        this.cube10 = new THREE.Mesh(geometry, materialTex);
        this.cube10.position.set(12 - 3 * cubedlength, cubeDepth, 12 - 4 * cubedlength);
        this.scene.add(this.cube10);

        this.cube12 = new THREE.Mesh(geometry, materialTex);
        this.cube12.position.set(12 - 1 * cubedlength, cubeDepth, 12 - 4 * cubedlength);
        this.scene.add(this.cube12);

        this.cube14 = new THREE.Mesh(geometry, materialTex);
        this.cube14.position.set(12, cubeDepth, 12 - 3 * cubedlength);
        this.scene.add(this.cube14);

        this.cube16 = new THREE.Mesh(geometry, materialTex);
        this.cube16.position.set(12, cubeDepth, 12 - 1 * cubedlength);
        this.scene.add(this.cube16);

        // ADD BACKGROUND
        this.objLoader = new OBJLoader();
        this.objLoader.setPath('asset/background_obj/');
        this.mtlLoader = new MTLLoader();
        this.mtlLoader.setPath('asset/background_obj/');
        new Promise((resolve) => {
            this.mtlLoader.load('B.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader.setMaterials(materials);
                this.objLoader.load('B.obj', (object) => {
                    this.scene.add(object);
                });
            });

        // ADD CENTER
        this.objLoader2 = new OBJLoader();
        this.objLoader2.setPath('asset/center_obj/');
        this.mtlLoader2 = new MTLLoader();
        this.mtlLoader2.setPath('asset/center_obj/');
        new Promise((resolve) => {
            this.mtlLoader2.load('Aztec Pyramid.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader2.setMaterials(materials);
                this.objLoader2.load('Aztec Pyramid.obj', (object) => {
                    object.scale.set(0.25, 0.25, 0.25);
                    object.position.set(0, 15, 0);
                    this.scene.add(object);
                });
            });

        // ADD CAMEL
        this.objLoader3 = new OBJLoader();
        this.objLoader3.setPath('asset/camel_obj/');
        this.mtlLoader3 = new MTLLoader();
        this.mtlLoader3.setPath('asset/camel_obj/');
        new Promise((resolve) => {
            this.mtlLoader3.load('orange.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader3.setMaterials(materials);
                this.objLoader3.load('camel_4.obj', (object) => {
                    object.scale.set(0.7, 0.5, 0.7);
                    //object.rotation.y = 180;
                    object.position.set(12, 17.2, 12);
                    const newObj = { camel: object, id: 0, position: { x: 12, y: 17.2, z: 12 }, boxNum: 0, level: 1, rotation: 0 };
                    this.setState(prevState => ({
                        camels: [...prevState.camels, newObj]
                    }));

                    this.scene.add(object);
                });
            });

        // ADD CAMEL2
        this.objLoader4 = new OBJLoader();
        this.objLoader4.setPath('asset/camel_obj/');
        this.mtlLoader4 = new MTLLoader();
        this.mtlLoader4.setPath('asset/camel_obj/');
        new Promise((resolve) => {
            this.mtlLoader4.load('green.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader4.setMaterials(materials);
                this.objLoader4.load('camel_4.obj', (object) => {
                    object.scale.set(0.7, 0.5, 0.7);
                    //object.rotation.y = 180;
                    object.position.set(12, 18.6, 12);
                    const newObj = { camel: object, id: 1, position: { x: 12, y: 18.6, z: 12 }, boxNum: 0, level: 1, rotation: 0 };
                    this.setState(prevState => ({
                        camels: [...prevState.camels, newObj]
                    }));

                    this.scene.add(object);
                });
            });


        // ADD MOUSE CTRL
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;
        this.controls.update();

        this.start();

        document.body.addEventListener("keydown", e => {
            // 在此指定: a. 要跳到第幾層  b. 按哪個鈕要跳幾步
            let targetLevel = 1;
            switch (e.keyCode) {
                case 73: // press i
                //targetLevel = 3;
                    jumpInfo.triggerJump = true;
                    jumpInfo.onGround = false;
                    jumpInfo.moveSpeed = this.state.jumpPara.oneStepSpeed;
                    this.setState(prevState => ({
                        run: true,
                        step: 1,
                        level: targetLevel
                    }));
                    break;
                case 74: // press j
                    console.log("key B");
                    //targetLevel = 1;
                    jumpInfo.triggerJump = true;
                    jumpInfo.onGround = false;
                    jumpInfo.moveSpeed = this.state.jumpPara.twoStepSpeed;
                    this.setState(prevState => ({
                        run: true,
                        step: 2,
                        level: targetLevel
                    }));
                    break;
                case 75: // press k
                //targetLevel = 4;
                    console.log("key C");
                    jumpInfo.triggerJump = true;
                    jumpInfo.onGround = false;
                    jumpInfo.moveSpeed = this.state.jumpPara.threeStepSpeed;
                    this.setState(prevState => ({
                        run: true,
                        step: 3,
                        level: targetLevel
                    }));
                    break;
            }
        });
    }
    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
    }
    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }
    stop = () => {
        cancelAnimationFrame(this.frameId);
    }
    animate = () => {
        this.renderScene();
        this.move();
        this.frameId = window.requestAnimationFrame(this.animate);
    }
    renderScene = () => {
        this.renderer.render(this.scene, this.camera);
    }

    moveAction = (camelObj, camelId, newBoxNum, newLevel, rotation, endXyz, isLinearMove) => {

        let updateXyz = () => {

            // react to keyboard state
            if (jumpInfo.triggerJump) {
                let camelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === camelId)));
                jumpInfo.x = this.state.camels[camelIndex].position.x;
                jumpInfo.z = this.state.camels[camelIndex].position.z;
                jumpInfo.y = this.state.camels[camelIndex].position.y;
                jumpInfo.r = this.state.camels[camelIndex].rotation;
                jumpInfo.world.ground = endXyz.y;
                jumpInfo.dy = jumpInfo.jumpPower;
                jumpInfo.dx = -jumpInfo.moveSpeed;
                jumpInfo.triggerJump = false;
            }

            // apply gravity drag and move player
            jumpInfo.dy += jumpInfo.world.gravity;
            jumpInfo.dy *= jumpInfo.world.drag;
            jumpInfo.dx *= jumpInfo.onGround ? 0 : jumpInfo.world.drag;
            jumpInfo.x += jumpInfo.dx;
            jumpInfo.y -= jumpInfo.dy;

            // test ground contact and left and right limits
            if (jumpInfo.dy > 0 && jumpInfo.y <= jumpInfo.world.ground) {
                jumpInfo.y = jumpInfo.world.ground;
                jumpInfo.dy = 0;
                jumpInfo.onGround = true;
                const refreshedObj = { camel: camelObj, id: camelId, position: endXyz, boxNum: newBoxNum, level: newLevel, 
                                       rotation: (isLinearMove)? (rotation):(rotation + this.state.turnRightYrotation)};
                const newArray = [...this.state.camels.filter(element => (camelId !== element.id)), refreshedObj];
                this.setState(prevState => ({
                    camels: newArray,
                    run: false,
                    step: 0
                }));
            } else {
                jumpInfo.onGround = false;
            }

            return { afterX: jumpInfo.x, afterY: jumpInfo.y };
        }

        let { afterX, afterY } = updateXyz();
        camelObj.position.x = afterX;
        camelObj.position.y = afterY;

        if (!isLinearMove) {
            jumpInfo.r += jumpInfo.rotationSpeed;
            camelObj.rotation.y = jumpInfo.r;
        } 
    }
    assignMove = () => {
        // const beforeXyz = { x: camelObj.position.x, y: camelObj.position.y, z: camelObj.position.z };
        // 在此指定: a. 哪一隻駱駝跳  b. 是否轉向
        const targetCameld = 0;
        const isLinear = false;

        const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === targetCameld)));
        const camelObj = this.state.camels[targetCamelIndex].camel;
        const rotation = this.state.camels[targetCamelIndex].rotation;
        const step = this.state.step;
        const level = this.state.level;
        let newBoxNum = 0;
        let findXyz = (level, boxNum) => {
            const yLevel = this.state.levelHeight * ( parseInt(level) - 1 );
            return { x: this.state.boardPosLevelOne[boxNum].x, y: this.state.boardPosLevelOne[boxNum].y + yLevel , z: this.state.boardPosLevelOne[boxNum].z };
        }

        switch (parseInt(step)) {
            case 1:
                newBoxNum = this.state.camels[targetCamelIndex].boxNum + 1;
                this.moveAction(camelObj, targetCameld, newBoxNum, level, rotation, findXyz(level, newBoxNum), isLinear);
                break;
            case 2:
                newBoxNum = this.state.camels[targetCamelIndex].boxNum + 2;
                this.moveAction(camelObj, targetCameld, newBoxNum, level, rotation, findXyz(level, newBoxNum), isLinear);
                break;
            case 3:
                newBoxNum = this.state.camels[targetCamelIndex].boxNum + 3;
                this.moveAction(camelObj, targetCameld, newBoxNum, level, rotation, findXyz(level, newBoxNum), isLinear);
                break;
            default:
                return;
        }
        return;

    }
    move = () => {
        if (this.state.camels != 0) {
            if (this.state.run) {
                this.assignMove();
            }
        }
    }
    render() {
        return (
            <div
                style={{ width: '90vw', height: '60vh', marginLeft: '5vw' }}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}
export default ThreeScene;