import React, { Component } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from 'three-orbitcontrols';

/*
let jumpInfo = {
    x: 12,
    y: 17.2,
    z: 12,
    r: 0,
    dx: 0, // delta x and y
    dy: 0,
    dz: 0,
    onGround: true,
    triggerJump: false,
    jumpPower: -1,  // power of jump smaller jumps higher eg -10 smaller than -5
    moveSpeed: 0.72, // moveSpeed: 0.252, 0.501, 0.72 
    moveSpeedZ: 0,
    rotationSpeed: -0.063,
    world: {
        gravity: 0.08, // strength per frame of gravity
        drag: 1, // 0.999 play with this value to change drag
        // groundDrag: 0.9, // play with this value to change ground movement
        ground: 17.2 //17.2, 18.6
    }
};
*/
class physicalWorld {
    // constructor 括號內，先寫者意義為，用 let jumpInfo = new physicalWorld({ x = 50 }); ，指定其中一個物件內容後，其他內容的預設值
    // constructor 括號內，後寫者意義為，用 let jumpInfo = new physicalWorld();，直接產生的預設值
    constructor({
        x = 12,
        y = 17.2,
        z = 12,
        r = 0,
        dx = 0,
        dy = 0,
        dz = 0,
        dr = 0,
        onGround = true,
        triggerJump = false,
        duringJump = false,
        jumpPower = -1,
        moveSpeed = 0.72,
        moveSpeedZ = 0,
        rotationSpeed = -0.063,
        world = {
            gravity: 0.08,
            drag: 1,
            ground: 17.2
        } } =
        {
            x: 12,
            y: 17.2,
            z: 12,
            r: 0,
            dx: 0,
            dy: 0,
            dz: 0,
            dr: 0,
            onGround: true,
            triggerJump: false,
            duringJump: false,
            jumpPower: -1,
            moveSpeed: 0.72,
            moveSpeedZ: 0,
            rotationSpeed: -0.063,
            world: { gravity: 0.08, drag: 1, ground: 17.2 }
        }) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
        this.dr = dr;
        this.onGround = onGround;
        this.triggerJump = triggerJump;
        this.duringJump = duringJump;
        this.jumpPower = jumpPower;
        this.moveSpeed = moveSpeed;
        this.moveSpeedZ = moveSpeedZ;
        this.rotationSpeed = rotationSpeed;
        this.world = world;
    }
}
let jumpInfo = [new physicalWorld(), new physicalWorld(), new physicalWorld(), new physicalWorld(), new physicalWorld()];

class ThreeScene extends Component {
    state = {
        camels: [],
        step: 0,
        targetJumpCamelId: 0,
        upperCamels: [],
        boardPosLevelOne: [
            { x: 12, y: 17.2, z: 12 }, { x: 6, y: 17.2, z: 12 }, { x: 0, y: 17.2, z: 12 }, { x: -6, y: 17.2, z: 12 }, { x: -12, y: 17.2, z: 12 },
            { x: -12, y: 17.2, z: 6 }, { x: -12, y: 17.2, z: 0 }, { x: -12, y: 17.2, z: -6 }, { x: -12, y: 17.2, z: -12 }, { x: -6, y: 17.2, z: -12 },
            { x: 0, y: 17.2, z: -12 }, { x: 6, y: 17.2, z: -12 }, { x: 12, y: 17.2, z: -12 }, { x: 12, y: 17.2, z: -6 }, { x: 12, y: 17.2, z: 0 },
            { x: 12, y: 17.2, z: 6 }],
        levelHeight: 1.4,
        turnRightYrotation: -1.575,
        jumpPara: { oneStepSpeed: 0.252, twoStepSpeed: 0.501, threeStepSpeed: 0.74 }
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
                    object.position.set(12, 17.2, 12);
                    const newObj = { camel: object, id: 0, position: { x: 12, y: 17.2, z: 12 }, boxNum: 0, level: 1, rotation: 0, run: false, nextBoxNum: 0, nextLevel: 0 };
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
                    object.position.set(12, 18.6, 12);
                    const newObj = { camel: object, id: 1, position: { x: 12, y: 18.6, z: 12 }, boxNum: 0, level: 1, rotation: 0, run: false, nextBoxNum: 0, nextLevel: 0 };
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
            // 在此指定: a. 按哪個鈕要跳幾步 b. 哪一隻駱駝跳 
            
            let setNextLevel = (setThisId, step, jumpCamelId) => {
                const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === setThisId)));
                const boxNum = this.state.camels[targetCamelIndex].boxNum;
                const nextBoxNum = boxNum + step;
                const nextBoxCamels = this.state.camels.filter(element => (element.boxNum === nextBoxNum));
                const thisBoxLowerCamels = this.state.camels.filter(element => (element.boxNum === this.state.camels[targetCamelIndex].boxNum && element.level < this.state.camels[targetCamelIndex].level));
                const jumpCamel = this.state.camels.find(element => (element.id === jumpCamelId));
                if (jumpCamel.boxNum === boxNum && jumpCamel.level < this.state.camels[targetCamelIndex].level) {
                    return thisBoxLowerCamels.length + nextBoxCamels.length + 1;
                } else {
                    return nextBoxCamels.length + 1;
                }
            }
            let setUpperCamelsArray = (searchThisIdAbove) => {
                const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === searchThisIdAbove)));
                const upperCamels = this.state.camels.filter(element => (element.boxNum === this.state.camels[targetCamelIndex].boxNum && element.level > this.state.camels[targetCamelIndex].level));
                return upperCamels;
            }
            let setNextBox = (setThisId, step) => {
                const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === setThisId)));
                const boxNum = this.state.camels[targetCamelIndex].boxNum;
                return boxNum + step;
            }
            
            switch (e.keyCode) {
                case 73: // press i
                    let jumpCamelId = 0;
                    jumpInfo[jumpCamelId].triggerJump = true;
                    jumpInfo[jumpCamelId].onGround = false;
                    this.setState(prevState => ({
                        camels: [...prevState.camels.filter(element => (0 !== element.id)), { ...prevState.camels.find(element => (0 === element.id)), ...{ nextBoxNum: setNextBox(0, 1), nextLevel: setNextLevel(0, 1, jumpCamelId), run: true } }],
                        step: 1,
                        targetJumpCamelId: jumpCamelId,
                        upperCamels: setUpperCamelsArray(jumpCamelId)
                    }));
                    break;
                case 74: // press j
                    jumpCamelId = 0;
                    console.log("key B");
                    jumpInfo[jumpCamelId].triggerJump = true;
                    jumpInfo[jumpCamelId].onGround = false;
                    this.setState(prevState => ({
                        camels: [...prevState.camels.filter(element => (0 !== element.id)), { ...prevState.camels.find(element => (0 === element.id)), ...{ nextBoxNum: setNextBox(0, 2), nextLevel: setNextLevel(0, 2, jumpCamelId), run: true } }],
                        step: 2,
                        targetJumpCamelId: jumpCamelId,
                        upperCamels: setUpperCamelsArray(jumpCamelId)
                    }));
                    break;
                case 75: // press k
                    jumpCamelId = 0;
                    console.log("key C");
                    jumpInfo[jumpCamelId].triggerJump = true;
                    jumpInfo[jumpCamelId].onGround = false;
                    this.setState(prevState => ({
                        camels: [...prevState.camels.filter(element => (0 !== element.id)), { ...prevState.camels.find(element => (0 === element.id)), ...{ nextBoxNum: setNextBox(0, 3), nextLevel: setNextLevel(0, 3, jumpCamelId), run: true } }],
                        step: 3,
                        targetJumpCamelId: jumpCamelId,
                        upperCamels: setUpperCamelsArray(jumpCamelId)
                    }));
                    break;
                case 76: // press l
                    jumpCamelId = 1;
                    console.log("key D");
                    jumpInfo[jumpCamelId].triggerJump = true;
                    jumpInfo[jumpCamelId].onGround = false;
                    this.setState(prevState => ({
                        camels: [...prevState.camels.filter(element => (1 !== element.id)), { ...prevState.camels.find(element => (1 === element.id)), ...{ nextBoxNum: setNextBox(1, 1), nextLevel: setNextLevel(1, 1, jumpCamelId), run: true } }],
                        step: 1,
                        targetJumpCamelId: jumpCamelId,
                        upperCamels: setUpperCamelsArray(jumpCamelId)
                    }));
                    break;
                case 32: // press space
                    jumpCamelId = 1;
                    console.log("key space");
                    jumpInfo[jumpCamelId].triggerJump = true;
                    jumpInfo[jumpCamelId].onGround = false;
                    this.setState(prevState => ({
                        camels: [...prevState.camels.filter(element => (1 !== element.id)), { ...prevState.camels.find(element => (1 === element.id)), ...{ nextBoxNum: setNextBox(1, 2), nextLevel: setNextLevel(1, 2, jumpCamelId), run: true } }],
                        step: 2,
                        targetJumpCamelId: jumpCamelId,
                        upperCamels: setUpperCamelsArray(jumpCamelId)
                    }));
                    break;
                default:
                    return;
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

    moveAction = (camelObj, camelId, newBoxNum, newLevel, rotation, endXyz, isLinearMove, moveSpeedX, moveSpeedZ) => {

        let updateXyz = () => {

            // react to keyboard state
            if (jumpInfo[camelId].triggerJump) {
                let camelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === camelId)));
                jumpInfo[camelId].moveSpeed = moveSpeedX;
                jumpInfo[camelId].moveSpeedZ = moveSpeedZ;

                jumpInfo[camelId].x = this.state.camels[camelIndex].position.x;
                jumpInfo[camelId].z = this.state.camels[camelIndex].position.z;
                jumpInfo[camelId].y = this.state.camels[camelIndex].position.y;
                // jumpInfo[camelId].r = this.state.camels[camelIndex].rotation;  因為 rotation 針對在上方的駱駝，可能未設定到，故不需要此行設定
                jumpInfo[camelId].world.ground = endXyz.y;
                jumpInfo[camelId].dy = jumpInfo[camelId].jumpPower;
                jumpInfo[camelId].dx = -jumpInfo[camelId].moveSpeed;
                jumpInfo[camelId].dz = -jumpInfo[camelId].moveSpeedZ;
                jumpInfo[camelId].triggerJump = false;
                // console.log("A", camelId);
            }
            //console.log("B", camelId);
            // apply gravity drag and move player
            jumpInfo[camelId].dy += jumpInfo[camelId].world.gravity;
            jumpInfo[camelId].dy *= jumpInfo[camelId].world.drag;
            jumpInfo[camelId].dx *= jumpInfo.onGround ? 0 : jumpInfo[camelId].world.drag;
            jumpInfo[camelId].x += jumpInfo[camelId].dx;
            jumpInfo[camelId].z += jumpInfo[camelId].dz;
            jumpInfo[camelId].y -= jumpInfo[camelId].dy;


            // test ground contact and left and right limits
            if (jumpInfo[camelId].dy > 0 && jumpInfo[camelId].y <= jumpInfo[camelId].world.ground) {
                jumpInfo[camelId].y = jumpInfo[camelId].world.ground;
                jumpInfo[camelId].dy = 0;
                jumpInfo[camelId].dx = 0;
                jumpInfo[camelId].dz = 0;
                jumpInfo[camelId].dr = 0;
                jumpInfo[camelId].onGround = true;
                jumpInfo[camelId].duringJump = false;
                // 以下 rotation 針對在上方的駱駝，可能會未設定到
                const refreshedObj = {
                    camel: camelObj, id: camelId, position: endXyz, boxNum: newBoxNum, level: newLevel,
                    rotation: (isLinearMove) ? (rotation) : (rotation + this.state.turnRightYrotation), run: false, nextBoxNum: -100, nextLevel: -100,
                };
                this.setState(prevState => ({
                    camels: [...prevState.camels.filter(element => (camelId !== element.id)), refreshedObj],
                    step: 0
                }));
                //console.log("C", camelId, jumpInfo[camelId]);
            } else {
                jumpInfo[camelId].onGround = false;
                //console.log("DD", camelId, jumpInfo[camelId].y, jumpInfo[camelId].world.ground, jumpInfo[camelId].dy);
            }
            return { afterX: jumpInfo[camelId].x, afterY: jumpInfo[camelId].y, afterZ: jumpInfo[camelId].z };
        }

        let { afterX, afterY, afterZ } = updateXyz();

        camelObj.position.x = afterX;
        camelObj.position.y = afterY;
        camelObj.position.z = afterZ;

        if (!isLinearMove) {
            jumpInfo[camelId].dr = jumpInfo[camelId].rotationSpeed; 
            jumpInfo[camelId].r += jumpInfo[camelId].dr;
            camelObj.rotation.y = jumpInfo[camelId].r;
            // console.log("E", camelId, jumpInfo[camelId].r);
        }
    }
    judgeSpeedAndRotate = (levelBeforeJump, level, finalBoxNum) => {
        let returnSpeedValue = (step) => {
            switch (parseInt(step)) {
                case 1:
                    // 不同高度，要加上不同水平位移的修正量
                    if (levelBeforeJump - level === 0) { return this.state.jumpPara.oneStepSpeed; }
                    else if (levelBeforeJump - level === 1) { return this.state.jumpPara.oneStepSpeed - 0.01; }
                    else if (levelBeforeJump - level === -1) { return this.state.jumpPara.oneStepSpeed + 0.03; }
                    else { return this.state.jumpPara.oneStepSpeed; }
                case 2:
                    if (levelBeforeJump - level === 0) { return this.state.jumpPara.twoStepSpeed; }
                    else if (levelBeforeJump - level === 1) { return this.state.jumpPara.twoStepSpeed - 0.01; }
                    else if (levelBeforeJump - level === -1) { return this.state.jumpPara.twoStepSpeed + 0.04; }
                    else { return this.state.jumpPara.twoStepSpeed; }
                case 3:
                    if (levelBeforeJump - level === 0) { return this.state.jumpPara.threeStepSpeed; }
                    else if (levelBeforeJump - level === 1) { return this.state.jumpPara.threeStepSpeed - 0.01; }
                    else if (levelBeforeJump - level === -1) { return this.state.jumpPara.threeStepSpeed + 0.03; }
                    else { return this.state.jumpPara.threeStepSpeed; }
                default:
                    return;
            }
        }
        if (finalBoxNum === 4 || finalBoxNum === 12) {
            // 在邊角格的轉向控制 -1 
            const moveSpeedX = (finalBoxNum === 4) ? (returnSpeedValue(this.state.step)) : (-returnSpeedValue(this.state.step));
            return { isLinear: false, moveSpeedX: moveSpeedX, moveSpeedZ: 0 };
        } if (finalBoxNum === 8) {
            // 在邊角格的轉向控制 -2
            const moveSpeedZ = returnSpeedValue(this.state.step);
            return { isLinear: false, moveSpeedX: 0, moveSpeedZ: moveSpeedZ };
        } else if ((finalBoxNum === 5 || finalBoxNum === 9 || finalBoxNum === 13) &&
            (this.state.step === 2 || this.state.step === 3)) {
            // 在邊角格前的跳躍轉向控制 -1 
            const moveSpeedX = (finalBoxNum === 5) ? (returnSpeedValue(this.state.step - 1)) : ((finalBoxNum === 9) ? (-returnSpeedValue(1)) : (-returnSpeedValue(this.state.step - 1)));
            const moveSpeedZ = (finalBoxNum === 5) ? (returnSpeedValue(1)) : ((finalBoxNum === 9) ? (returnSpeedValue(this.state.step - 1)) : (-returnSpeedValue(1)));
            return { isLinear: false, moveSpeedX: moveSpeedX, moveSpeedZ: moveSpeedZ };
        } else if ((finalBoxNum === 6 || finalBoxNum === 10 || finalBoxNum === 14) && this.state.step === 3) {
            // 在邊角格前的跳躍轉向控制 -2
            const moveSpeedX = (finalBoxNum === 6) ? (returnSpeedValue(this.state.step - 2)) : ((finalBoxNum === 10) ? (-returnSpeedValue(2)) : (-returnSpeedValue(this.state.step - 2)));
            const moveSpeedZ = (finalBoxNum === 6) ? (returnSpeedValue(2)) : ((finalBoxNum === 10) ? (returnSpeedValue(this.state.step - 2)) : (-returnSpeedValue(2)));
            return { isLinear: false, moveSpeedX: moveSpeedX, moveSpeedZ: moveSpeedZ };
        } else if (finalBoxNum >= 5 && finalBoxNum <= 7) {
            // 直線前進控制 -1
            const moveSpeedZ = returnSpeedValue(this.state.step);
            return { isLinear: true, moveSpeedX: 0, moveSpeedZ: moveSpeedZ };
        } else if (finalBoxNum >= 9 && finalBoxNum <= 11) {
            // 直線前進控制 -2
            const moveSpeedX = -returnSpeedValue(this.state.step);
            return { isLinear: true, moveSpeedX: moveSpeedX, moveSpeedZ: 0 };
        } else if (finalBoxNum >= 13 && finalBoxNum <= 18) {
            // 終點前直線前進控制
            let moveSpeedZ = 0;
            if (finalBoxNum <= 16) { moveSpeedZ = -returnSpeedValue(this.state.step); }
            else if (finalBoxNum === 17 && this.state.step !== 1) { moveSpeedZ = -returnSpeedValue(this.state.step - 1); }
            else if (finalBoxNum === 18 && this.state.step === 3) { moveSpeedZ = -returnSpeedValue(this.state.step - 2); }
            return { isLinear: true, moveSpeedX: 0, moveSpeedZ: moveSpeedZ };
        } else if (finalBoxNum >= 17) {
            // 超過終點前原地跳躍控制
            return { isLinear: true, moveSpeedX: 0, moveSpeedZ: 0 };
        }
        else { return { isLinear: true, moveSpeedX: returnSpeedValue(this.state.step), moveSpeedZ: 0 }; }
    }
    assignMove = (camelId) => {
        const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === camelId)));
        const camelObj = this.state.camels[targetCamelIndex].camel;
        const rotation = this.state.camels[targetCamelIndex].rotation;
        const levelBeforeJump = this.state.camels[targetCamelIndex].level;
        const levelAfterJump = this.state.camels[targetCamelIndex].nextLevel;
        let newBoxNum = this.state.camels[targetCamelIndex].nextBoxNum;
        let findXyz = (boxNum) => {
            if (boxNum <= 15) {
                const yLevel = this.state.levelHeight * (parseInt(levelAfterJump) - 1);
                return { x: this.state.boardPosLevelOne[boxNum].x, y: this.state.boardPosLevelOne[boxNum].y + yLevel, z: this.state.boardPosLevelOne[boxNum].z };
            } if (boxNum >= 16) {
                const yLevel = this.state.levelHeight * (parseInt(levelAfterJump) - 1);
                return { x: this.state.boardPosLevelOne[0].x, y: this.state.boardPosLevelOne[0].y + yLevel, z: this.state.boardPosLevelOne[0].z };
            }
        }
        const { isLinear, moveSpeedX, moveSpeedZ } = this.judgeSpeedAndRotate(levelBeforeJump, levelAfterJump, newBoxNum);
        //console.log("LLL", camelId, isLinear, moveSpeedX, moveSpeedZ );
        this.moveAction(camelObj, camelId, newBoxNum, levelAfterJump, rotation, findXyz(newBoxNum), isLinear, moveSpeedX, moveSpeedZ);

        return;

    }
    move = () => {
        let assignUpperCamel = () => {
            if (this.state.upperCamels.length !== 0) {
                const upperCamel = this.state.upperCamels[0];
                if (jumpInfo[upperCamel.id].duringJump === false) {
                    jumpInfo[upperCamel.id].triggerJump = true;
                    jumpInfo[upperCamel.id].onGround = false;
                    jumpInfo[upperCamel.id].duringJump = true;
                    let setNextLevel = (setThisId, step, jumpCamelId) => {
                        const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === setThisId)));
                        const boxNum = this.state.camels[targetCamelIndex].boxNum;
                        const nextBoxNum = boxNum + step;
                        const nextBoxCamels = this.state.camels.filter(element => (element.boxNum === nextBoxNum));
                        const thisBoxLowerCamels = this.state.camels.filter(element => (element.boxNum === this.state.camels[targetCamelIndex].boxNum && element.level < this.state.camels[targetCamelIndex].level));
                        const jumpCamel = this.state.camels.find(element => (element.id === jumpCamelId));
                        if (jumpCamel.boxNum === boxNum && jumpCamel.level < this.state.camels[targetCamelIndex].level) {
                            return thisBoxLowerCamels.length + nextBoxCamels.length + 1;
                        } else {
                            return nextBoxCamels.length + 1;
                        }
                    }
                    let setNextBox = (setThisId, step) => {
                        const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === setThisId)));
                        const boxNum = this.state.camels[targetCamelIndex].boxNum;
                        return boxNum + step;
                    }

                    this.setState(prevState => ({
                        camels: [...prevState.camels.filter(element => (upperCamel.id !== element.id)), { ...prevState.camels.find(element => (upperCamel.id === element.id)), ...{  nextBoxNum: setNextBox(upperCamel.id, prevState.step), nextLevel: setNextLevel(upperCamel.id, prevState.step, this.state.targetJumpCamelId),run: true } }],
                    }));
                }
                this.assignMove(upperCamel.id);

                return;
            }
            else { return; }
        }

        if (this.state.camels) {
            if (this.state.camels.find(element => (element.run === true)) !== undefined) {
                this.assignMove(this.state.targetJumpCamelId);
                assignUpperCamel();
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