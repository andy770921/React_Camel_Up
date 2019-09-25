import './css/normalize.css';
import './css/common.css';
import './css/three_scene.css';
import './three-usage/debug.js';
import './three-usage/dice.js';
import { DiceManager, DiceD6 } from './three-usage/dice.js';
import React, { Component } from 'react';
import * as THREE from 'three';
import * as CANNON from "cannon";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from 'three-orbitcontrols';
import { PlayerContext } from './contexts/playerContext';
import GameBtn from './components/game_btn';

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

// 共四隻駱駝，建立四個獨立的座標系，避免移動時交叉干擾
let jumpInfo = [new physicalWorld(), new physicalWorld(), new physicalWorld(), new physicalWorld()];

class ThreeScene extends Component {
    static contextType = PlayerContext;
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
        jumpPara: { oneStepSpeed: 0.252, twoStepSpeed: 0.501, threeStepSpeed: 0.74 },
        presentPerspective: 0,
        perspective: [{ x: 12.224269097110634, y: 28.06120661987065, z: 20.449256738974572, rx: -0.9410425931753215, ry: 0.3385117004158438, rz: 0.4275815303874366 },
        { x: -20.23749537647295, y: 30.20828012656372, z: 5.739317536121531, rx: -1.3830425495507412, ry: -0.5820892932676605, rz: -1.2380614788427116 },
        { x: -5.45846236450601, y: 28.170375973657137, z: -23.057998161510366, rx: -2.256727996179766, ry: -0.14883306465160234, rz: -2.962374890792215 },
        { x: 21.37291700845059, y: 29.970348143855148, z: -0.11324214827492107, rx: -1.574574781713805, ry: 0.6194840200316319, rz: 1.5773039414145469 }
        ],
        pyramid: {},
        dices: [],
        rigidBody: {},
        targetDiceObj: {},
        historyDices: [],
        isClickingRun: false
    }
    componentDidMount() {
        this.props.setParentGameBegin(this.gameBegin);
        this.props.setParentGameRestart(this.gameRestart);
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        // ADD SCENE
        this.scene = new THREE.Scene();
        const color = new THREE.Color(0xd5f3fe);
        this.scene.background = color;


        // ADD CAMERA with RWD function
        
        if (this.mount.clientWidth > 1200 ){
            this.camera = new THREE.PerspectiveCamera(
                80,
                width / height,
                0.1,
                1000
            );
        } else if (this.mount.clientWidth <= 1200 && this.mount.clientWidth > 800){
            this.camera = new THREE.PerspectiveCamera(
                100,
                width / height,
                0.1,
                1000
            );
        } else if (this.mount.clientWidth <= 800 && this.mount.clientWidth > 600){
            this.camera = new THREE.PerspectiveCamera(
                110,
                width / height,
                0.1,
                1000
            );
        } else {
            this.camera = new THREE.PerspectiveCamera(
                130,
                width / height,
                0.1,
                1000
            );
        }

        // SET PERSPECTIVE
        this.camera.position.set(12.224269097110634, 28.06120661987065, 20.449256738974572);
        this.camera.rotation.set(-0.9410425931753215, 0.3385117004158438, 0.4275815303874366);

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
                    // 加入載入完成後，關閉 Loading 畫面
                    this.context.dispatch({
                        type: 'LOAD_SUCCEED'
                    });
                });
            });

        // ADD PYRAMID
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
                    const newObj = { pyramidObj: object, position: { x: 0, y: 15, z: 0 }, aboveGround: true, triggerMoving: false };
                    this.setState({ pyramid: newObj });
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
                this.objLoader3.load('camel.obj', (object) => {
                    object.scale.set(0.7, 0.5, 0.7);
                    object.position.set(12, 17.2, 12);
                    object.visible = false;
                    const newObj = {
                        camel: object, id: 0, color: 'orange', position: { x: 12, y: 17.2, z: 12 },
                        boxNum: 0, level: 1, rotation: 0, run: false, nextBoxNum: 0, nextLevel: 0
                    };
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
                this.objLoader4.load('camel.obj', (object) => {
                    object.scale.set(0.7, 0.5, 0.7);
                    object.position.set(12, 17.2, 12); // test case: y = 18.6 in level 2
                    object.visible = false;
                    const newObj = {
                        camel: object, id: 1, color: 'green', position: { x: 12, y: 17.2, z: 12 },
                        boxNum: 0, level: 1, rotation: 0, run: false, nextBoxNum: 0, nextLevel: 0
                    };
                    this.setState(prevState => ({
                        camels: [...prevState.camels, newObj]
                    }));

                    this.scene.add(object);
                });
            });

        // ADD CAMEL3
        this.objLoader5 = new OBJLoader();
        this.objLoader5.setPath('asset/camel_obj/');
        this.mtlLoader5 = new MTLLoader();
        this.mtlLoader5.setPath('asset/camel_obj/');
        new Promise((resolve) => {
            this.mtlLoader5.load('red.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader5.setMaterials(materials);
                this.objLoader5.load('camel.obj', (object) => {
                    object.scale.set(0.7, 0.5, 0.7);
                    object.position.set(12, 17.2, 12);   // test case: y = 20 in level 3
                    object.visible = false;
                    const newObj = {
                        camel: object, id: 2, color: 'red', position: { x: 12, y: 17.2, z: 12 },
                        boxNum: 0, level: 1, rotation: 0, run: false, nextBoxNum: 0, nextLevel: 0
                    };
                    this.setState(prevState => ({
                        camels: [...prevState.camels, newObj]
                    }));
                    this.scene.add(object);
                });
            });
        // ADD CAMEL4
        this.objLoader6 = new OBJLoader();
        this.objLoader6.setPath('asset/camel_obj/');
        this.mtlLoader6 = new MTLLoader();
        this.mtlLoader6.setPath('asset/camel_obj/');
        new Promise((resolve) => {
            this.mtlLoader6.load('blue.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader6.setMaterials(materials);
                this.objLoader6.load('camel.obj', (object) => {
                    object.scale.set(0.7, 0.5, 0.7);
                    object.position.set(12, 17.2, 12);   // test case: y = 21.4 in level 4
                    object.visible = false;
                    const newObj = {
                        camel: object, id: 3, color: 'blue', position: { x: 12, y: 17.2, z: 12 },
                        boxNum: 0, level: 1, rotation: 0, run: false, nextBoxNum: 0, nextLevel: 0
                    };
                    this.setState(prevState => ({
                        camels: [...prevState.camels, newObj]
                    }));

                    this.scene.add(object);
                });
            });

        // ADD DICE


        this.objLoader7 = new OBJLoader();
        this.objLoader7.setPath('asset/dice_obj/');
        this.mtlLoader7 = new MTLLoader();
        this.mtlLoader7.setPath('asset/dice_obj/');
        new Promise((resolve) => {
            this.mtlLoader7.load('orange-dice.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader7.setMaterials(materials);
                this.objLoader7.load('dice.obj', (object) => {
                    object.scale.set(2, 2, 2);
                    object.position.set(7.6 - 15.2, 10, 7.6);
                    object.visible = false;
                    const newObj = { diceObj: object, id: 51, color: 'orange' };
                    this.setState(prevState => ({
                        dices: [...prevState.dices, newObj]
                    }));
                    this.scene.add(object);
                });
            });
        this.objLoader8 = new OBJLoader();
        this.objLoader8.setPath('asset/dice_obj/');
        this.mtlLoader8 = new MTLLoader();
        this.mtlLoader8.setPath('asset/dice_obj/');
        new Promise((resolve) => {
            this.mtlLoader8.load('green-dice.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader8.setMaterials(materials);
                this.objLoader8.load('dice.obj', (object) => {
                    object.scale.set(2, 2, 2);
                    object.position.set(7.6, 10, 7.6);
                    object.visible = false;
                    const newObj = { diceObj: object, id: 52, color: 'green' };
                    this.setState(prevState => ({
                        dices: [...prevState.dices, newObj]
                    }));
                    this.scene.add(object);
                });
            });
        this.objLoader9 = new OBJLoader();
        this.objLoader9.setPath('asset/dice_obj/');
        this.mtlLoader9 = new MTLLoader();
        this.mtlLoader9.setPath('asset/dice_obj/');
        new Promise((resolve) => {
            this.mtlLoader9.load('red-dice.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader9.setMaterials(materials);
                this.objLoader9.load('dice.obj', (object) => {
                    object.scale.set(2, 2, 2);
                    object.position.set(7.6 - 15.2, 10, 7.6 - 15.2);
                    object.visible = false;
                    const newObj = { diceObj: object, id: 53, color: 'red' };
                    this.setState(prevState => ({
                        dices: [...prevState.dices, newObj]
                    }));
                    this.scene.add(object);
                });
            });



        this.objLoader10 = new OBJLoader();
        this.objLoader10.setPath('asset/dice_obj/');
        this.mtlLoader10 = new MTLLoader();
        this.mtlLoader10.setPath('asset/dice_obj/');
        new Promise((resolve) => {
            this.mtlLoader10.load('blue-dice.mtl', (materials) => {
                resolve(materials);
            });
        })
            .then((materials) => {
                materials.preload();
                this.objLoader10.setMaterials(materials);
                this.objLoader10.load('dice.obj', (object) => {
                    object.scale.set(2, 2, 2);
                    object.position.set(7.6, 10, 7.6 - 15.2);
                    object.visible = false;
                    const newObj = { diceObj: object, id: 54, color: 'blue' };
                    this.setState(prevState => ({
                        dices: [...prevState.dices, newObj]
                    }));
                    this.scene.add(object);
                });
            });
        // ADD CYLINDER

        const cylinderGeometry = new THREE.CylinderGeometry(4.5, 12, 15, 8);
        const cylinderMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('asset/rock/rock4.jpg'), side: THREE.DoubleSide });
        this.cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        this.cylinder.position.set(0, 9, 0);
        this.scene.add(this.cylinder);

        // ADD FINISH LINE 
        const flagGeometry = new THREE.BoxGeometry(6.8, 1.2, 0.1);
        const flagMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('asset/finish_line/flag.png'), side: THREE.DoubleSide });
        this.flagCube = new THREE.Mesh(flagGeometry, flagMaterial);
        this.flagCube.position.set(12, 17.0, 8.7);
        this.scene.add(this.flagCube);

        const rodGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3.0, 8);
        const rodMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('asset/finish_line/rod.png'), side: THREE.DoubleSide });
        this.rod1 = new THREE.Mesh(rodGeometry, rodMaterial);
        this.rod1.position.set(8.7, 16.2, 8.7);
        this.scene.add(this.rod1);

        this.rod2 = new THREE.Mesh(rodGeometry, rodMaterial);
        this.rod2.position.set(8.7 + 6.6, 16.2, 8.7);
        this.rod2.rotation.set(0, 90 * Math.PI / 180, 0);
        this.scene.add(this.rod2);

        // ADD MOUSE CTRL
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;
        this.controls.update();

        this.start();

        // ADD CANNON ENGINE
        this.world = new CANNON.World();
        this.world.gravity.set(0, -10, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();

        // ADD CANNON RIGID PLANE AS GROUND

        let groundShape = new CANNON.Plane();
        let ground_cm = new CANNON.Material();
        let groundBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, 16.5, 0),
            shape: groundShape,
            material: ground_cm
        });

        // setFromAxisAngle 旋轉 X 軸 -90 度
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -2 * Math.PI / 360 * 90);

        this.world.add(groundBody);

        // ADD CANNON OUTER FRAME
        // this.cannonDebugRenderer = new THREE.CannonDebugRenderer(this.scene, this.world);

        // ADD RIGID BODY CONTACT

        DiceManager.setWorld(this.world);

        let box_ground = new CANNON.ContactMaterial(ground_cm, DiceManager.diceBodyMaterial, { // Step 3 : 兩個剛體碰撞後的摩擦力、彈跳力
            friction: 100,
            restitution: 0.1
        });
        this.world.addContactMaterial(box_ground);

        // Create a dice
        this.dice = new DiceD6({ size: 2.6, backColor: 'rgba(255, 255, 0, 0)' });
        this.scene.add(this.dice.getObject());

        // If you want to place the mesh somewhere else, you have to update the body
        this.dice.getObject().position.x = 0;
        this.dice.getObject().position.y = 18;
        this.dice.getObject().position.z = 0;
        // this.dice.getObject().rotation.x = 20 * Math.PI / 180;
        this.dice.updateBodyFromMesh();

        // ADD to REACT STATE
        this.setState(prevState => ({
            rigidBody: { obj: this.dice.object.body, id: 61, triggerRolling: false }
        }));


        window.addEventListener('resize', this.onWindowResize, false);
        document.body.addEventListener("keydown", e => {
            // TEST 時，在此指定: a. 按哪個鈕要跳幾步 b. 哪一隻駱駝跳 
            switch (e.keyCode) {
                case 73: // press i
                    {
                        let jumpCamelId = 0;
                        jumpInfo[jumpCamelId].triggerJump = true;
                        jumpInfo[jumpCamelId].onGround = false;
                        this.setState(prevState => ({
                            camels: [...prevState.camels.filter(element => (jumpCamelId !== element.id)),
                            {
                                ...prevState.camels.find(element => (jumpCamelId === element.id)),
                                ...{ nextBoxNum: this.setNextBox(0, 1), nextLevel: this.setNextLevel(0, 1, jumpCamelId), run: true }
                            }],
                            step: 1,
                            targetJumpCamelId: jumpCamelId,
                            upperCamels: this.setUpperCamelsArray(jumpCamelId)
                        }));
                        break;
                    }
                case 74: // press j
                    {
                        let jumpCamelId = 0;
                        console.log("key J");
                        jumpInfo[jumpCamelId].triggerJump = true;
                        jumpInfo[jumpCamelId].onGround = false;
                        this.setState(prevState => ({
                            camels: [...prevState.camels.filter(element => (jumpCamelId !== element.id)),
                            {
                                ...prevState.camels.find(element => (jumpCamelId === element.id)),
                                ...{ nextBoxNum: this.setNextBox(0, 2), nextLevel: this.setNextLevel(0, 2, jumpCamelId), run: true }
                            }],
                            step: 2,
                            targetJumpCamelId: jumpCamelId,
                            upperCamels: this.setUpperCamelsArray(jumpCamelId)
                        }));
                        break;
                    }
                case 75: // press k
                    {
                        let jumpCamelId = 0;
                        console.log("key K");
                        jumpInfo[jumpCamelId].triggerJump = true;
                        jumpInfo[jumpCamelId].onGround = false;
                        this.setState(prevState => ({
                            camels: [...prevState.camels.filter(element => (jumpCamelId !== element.id)),
                            {
                                ...prevState.camels.find(element => (jumpCamelId === element.id)),
                                ...{ nextBoxNum: this.setNextBox(0, 3), nextLevel: this.setNextLevel(0, 3, jumpCamelId), run: true }
                            }],
                            step: 3,
                            targetJumpCamelId: jumpCamelId,
                            upperCamels: this.setUpperCamelsArray(jumpCamelId)
                        }));
                        break;
                    }
                case 76: // press l
                    {
                        let jumpCamelId = 1;
                        console.log("key L");
                        jumpInfo[jumpCamelId].triggerJump = true;
                        jumpInfo[jumpCamelId].onGround = false;
                        this.setState(prevState => ({
                            camels: [...prevState.camels.filter(element => (jumpCamelId !== element.id)),
                            {
                                ...prevState.camels.find(element => (jumpCamelId === element.id)),
                                ...{ nextBoxNum: this.setNextBox(1, 1), nextLevel: this.setNextLevel(1, 1, jumpCamelId), run: true }
                            }],
                            step: 1,
                            targetJumpCamelId: jumpCamelId,
                            upperCamels: this.setUpperCamelsArray(jumpCamelId)
                        }));
                        break;
                    }
                case 32: // press space
                    {
                        let jumpCamelId = 1;
                        console.log("key space");
                        jumpInfo[jumpCamelId].triggerJump = true;
                        jumpInfo[jumpCamelId].onGround = false;
                        this.setState(prevState => ({
                            camels: [...prevState.camels.filter(element => (jumpCamelId !== element.id)),
                            {
                                ...prevState.camels.find(element => (jumpCamelId === element.id)),
                                ...{ nextBoxNum: this.setNextBox(1, 2), nextLevel: this.setNextLevel(1, 2, jumpCamelId), run: true }
                            }],
                            step: 2,
                            targetJumpCamelId: jumpCamelId,
                            upperCamels: this.setUpperCamelsArray(jumpCamelId)
                        }));
                        break;
                    }
                case 81: // press q
                    {
                        let jumpCamelId = 2;
                        console.log("key Q");
                        jumpInfo[jumpCamelId].triggerJump = true;
                        jumpInfo[jumpCamelId].onGround = false;
                        this.setState(prevState => ({
                            camels: [...prevState.camels.filter(element => (jumpCamelId !== element.id)),
                            {
                                ...prevState.camels.find(element => (jumpCamelId === element.id)),
                                ...{ nextBoxNum: this.setNextBox(2, 1), nextLevel: this.setNextLevel(2, 1, jumpCamelId), run: true }
                            }],
                            step: 1,
                            targetJumpCamelId: jumpCamelId,
                            upperCamels: this.setUpperCamelsArray(jumpCamelId)
                        }));
                        break;
                    }
                case 87: // press w
                    {
                        let jumpCamelId = 3;
                        console.log("key W");
                        jumpInfo[jumpCamelId].triggerJump = true;
                        jumpInfo[jumpCamelId].onGround = false;
                        this.setState(prevState => ({
                            camels: [...prevState.camels.filter(element => (jumpCamelId !== element.id)),
                            {
                                ...prevState.camels.find(element => (jumpCamelId === element.id)),
                                ...{ nextBoxNum: this.setNextBox(3, 1), nextLevel: this.setNextLevel(3, 1, jumpCamelId), run: true }
                            }],
                            step: 1,
                            targetJumpCamelId: jumpCamelId,
                            upperCamels: this.setUpperCamelsArray(jumpCamelId)
                        }));
                        break;
                    }
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
    onWindowResize = () => {
        // Camera frustum aspect ratio
        this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
        // After making changes to aspect
        this.camera.updateProjectionMatrix();
        // Reset size
        this.renderer.setSize(window.innerWidth * 1, window.innerHeight * 0.97);
    }
    animate = () => {
        this.renderScene();
        this.move();
        this.frameId = window.requestAnimationFrame(this.animate);
        this.world.step(1 / 60);            // for CANNON engine: Update physics
        // this.cannonDebugRenderer.update();    // for CANNON engine: Update debug frame
        this.dice.updateMeshFromBody(); // Call this after updating the physics world for rearranging the mesh according to the body
    }
    renderScene = () => {
        this.renderer.render(this.scene, this.camera);
    }
    setUpperCamelsArray = (searchThisIdAbove) => {
        const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === searchThisIdAbove)));
        const upperCamels = this.state.camels.filter(element => (element.boxNum === this.state.camels[targetCamelIndex].boxNum && element.level > this.state.camels[targetCamelIndex].level));
        if (upperCamels) {
            for (let i = 0; i < upperCamels.length; i++) {
                const a = upperCamels[i].id;
                jumpInfo[a].duringJump = true;
                jumpInfo[a].triggerJump = true;
            }
        }
        return upperCamels;
    }

    moveAction = (camelObj, camelId, newBoxNum, newLevel, endXyz, isLinearMove, moveSpeedX, moveSpeedZ) => {

        let updateXyz = () => {
            let camelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === camelId)));
            // react to keyboard state
            if (jumpInfo[camelId].triggerJump) {
                jumpInfo[camelId].moveSpeed = moveSpeedX;
                jumpInfo[camelId].moveSpeedZ = moveSpeedZ;

                jumpInfo[camelId].x = this.state.camels[camelIndex].position.x;
                jumpInfo[camelId].z = this.state.camels[camelIndex].position.z;
                jumpInfo[camelId].y = this.state.camels[camelIndex].position.y;
                jumpInfo[camelId].r = this.state.camels[camelIndex].rotation;
                jumpInfo[camelId].world.ground = endXyz.y;
                jumpInfo[camelId].dy = jumpInfo[camelId].jumpPower;
                jumpInfo[camelId].dx = -jumpInfo[camelId].moveSpeed;
                jumpInfo[camelId].dz = -jumpInfo[camelId].moveSpeedZ;
                jumpInfo[camelId].onGround = false;
                jumpInfo[camelId].triggerJump = false;
            }
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

                let camelColor = "";
                switch (camelId) {
                    case 0:
                        camelColor = "orange";
                        break;
                    case 1:
                        camelColor = "green";
                        break;
                    case 2:
                        camelColor = "red";
                        break;
                    case 3:
                        camelColor = "blue";
                        break;
                    default:
                        return;
                }

                const refreshedObj = {
                    camel: camelObj, id: camelId, color: camelColor, position: endXyz, boxNum: newBoxNum, level: newLevel,
                    rotation: (isLinearMove) ? (this.state.camels[camelIndex].rotation) : (this.state.camels[camelIndex].rotation + this.state.turnRightYrotation), run: false, nextBoxNum: -100, nextLevel: -100,
                };
                this.setState(prevState => ({
                    camels: [...prevState.camels.filter(element => (camelId !== element.id)), refreshedObj],
                    //step: 0 不能設定 0 ，因為還沒跳完的駱駝，要依照此數據算出的座標繼續跳
                }));
            } else {
                jumpInfo[camelId].onGround = false;
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
        }
    }
    judgeSpeedAndRotate = (levelBeforeJump, level, finalBoxNum) => {
        let returnSpeedValue = (step) => {
            switch (parseInt(step)) {
                case 1:
                    // 不同高度，要加上不同水平位移的修正量
                    if (levelBeforeJump - level === 0) { return this.state.jumpPara.oneStepSpeed; }
                    else if (levelBeforeJump - level === 3) { return this.state.jumpPara.oneStepSpeed - 0.03; }
                    else if (levelBeforeJump - level === 2) { return this.state.jumpPara.oneStepSpeed - 0.02; }
                    else if (levelBeforeJump - level === 1) { return this.state.jumpPara.oneStepSpeed - 0.01; }
                    else if (levelBeforeJump - level === -1) { return this.state.jumpPara.oneStepSpeed + 0.03; }
                    else if (levelBeforeJump - level === -2) { return this.state.jumpPara.oneStepSpeed + 0.065; }
                    else if (levelBeforeJump - level === -3) { return this.state.jumpPara.oneStepSpeed + 0.10; }
                    else { return this.state.jumpPara.oneStepSpeed; }
                case 2:
                    if (levelBeforeJump - level === 0) { return this.state.jumpPara.twoStepSpeed; }
                    else if (levelBeforeJump - level === 3) { return this.state.jumpPara.twoStepSpeed - 0.09; }
                    else if (levelBeforeJump - level === 2) { return this.state.jumpPara.twoStepSpeed - 0.05; }
                    else if (levelBeforeJump - level === 1) { return this.state.jumpPara.twoStepSpeed - 0.01; }
                    else if (levelBeforeJump - level === -1) { return this.state.jumpPara.twoStepSpeed + 0.05; }
                    else if (levelBeforeJump - level === -2) { return this.state.jumpPara.twoStepSpeed + 0.11; }
                    else if (levelBeforeJump - level === -3) { return this.state.jumpPara.twoStepSpeed + 0.18; }
                    else { return this.state.jumpPara.twoStepSpeed; }
                case 3:
                    if (levelBeforeJump - level === 0) { return this.state.jumpPara.threeStepSpeed; }
                    else if (levelBeforeJump - level === 3) { return this.state.jumpPara.threeStepSpeed - 0.09; }
                    else if (levelBeforeJump - level === 2) { return this.state.jumpPara.threeStepSpeed - 0.05; }
                    else if (levelBeforeJump - level === 1) { return this.state.jumpPara.threeStepSpeed - 0.01; }
                    else if (levelBeforeJump - level === -1) { return this.state.jumpPara.threeStepSpeed + 0.07; }
                    else if (levelBeforeJump - level === -2) { return this.state.jumpPara.threeStepSpeed + 0.15; }
                    else if (levelBeforeJump - level === -3) { return this.state.jumpPara.threeStepSpeed + 0.24; }
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
        this.moveAction(camelObj, camelId, newBoxNum, levelAfterJump, findXyz(newBoxNum), isLinear, moveSpeedX, moveSpeedZ);

        return;

    }
    setNextLevel = (setThisId, step, jumpCamelId) => {
        const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === setThisId)));
        const jumpCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === jumpCamelId)));
        const boxNum = this.state.camels[targetCamelIndex].boxNum;
        const nextBoxNum = boxNum + step;
        const nextBoxCamels = this.state.camels.filter(element => (element.boxNum === nextBoxNum));
        const thisBoxLowerCamels = this.state.camels.filter(element => (element.boxNum === this.state.camels[targetCamelIndex].boxNum && element.level < this.state.camels[targetCamelIndex].level && element.level >= this.state.camels[jumpCamelIndex].level));
        const jumpCamel = this.state.camels.find(element => (element.id === jumpCamelId));
        if (jumpCamel.boxNum === boxNum && jumpCamel.level < this.state.camels[targetCamelIndex].level) {
            return thisBoxLowerCamels.length + nextBoxCamels.length + 1;
        } else {
            return nextBoxCamels.length + 1;
        }
    }

    setNextBox = (setThisId, step) => {
        const targetCamelIndex = this.state.camels.indexOf(this.state.camels.find(element => (element.id === setThisId)));
        const boxNum = this.state.camels[targetCamelIndex].boxNum;
        return boxNum + step;
    }

    move = () => {
        let assignUpperCamel = () => {
            if (this.state.upperCamels.length !== 0) {
                for (let i = 0; i < this.state.upperCamels.length; i++) {
                    const upperCamel = this.state.upperCamels[i];
                    if (jumpInfo[upperCamel.id].duringJump === true) {
                        this.setState(prevState => ({
                            camels: [...prevState.camels.filter(element => (upperCamel.id !== element.id)), { ...prevState.camels.find(element => (upperCamel.id === element.id)), ...{ nextBoxNum: this.setNextBox(upperCamel.id, prevState.step), nextLevel: this.setNextLevel(upperCamel.id, prevState.step, this.state.targetJumpCamelId), run: true } }],
                        }));
                        this.assignMove(upperCamel.id);
                    }
                }
                return;
            }
            else { return; }
        }

        if (this.state.camels) {
            if (this.state.camels.find(element => (element.run === true)) !== undefined) {
                if (jumpInfo[this.state.targetJumpCamelId].onGround === false) { this.assignMove(this.state.targetJumpCamelId); }
                assignUpperCamel();
            }
        }
        if (this.state.pyramid && this.state.pyramid.triggerMoving === true) { this.movePyramid(); }
        if (this.state.rigidBody.obj && this.state.dices.length === 4 && this.state.rigidBody.triggerRolling === true && this.state.targetDiceObj) {
            this.assignPosition(this.state.targetDiceObj);
        }

    }

    rollDice = (diceObj) => {
        //var diceValues = [];
        this.dice.getObject().position.x = 0;
        this.dice.getObject().position.y = 20;
        this.dice.getObject().position.z = 0;
        this.dice.getObject().quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
        this.dice.getObject().quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;
        this.dice.updateBodyFromMesh();
        if (diceObj) { this.dice.updateBodyFromInsertDiceObj(diceObj); }
        let rand = Math.random() * 2;
        let yRand = Math.random() * 6;
        this.dice.getObject().body.velocity.set(rand, 4 + yRand, rand);
        this.dice.getObject().body.angularVelocity.set(10 * Math.random() + 5, 10 * Math.random() + 5, 10 * Math.random() + 5);
        //diceValues.push({ dice: this.dice, value: 2 });
        //DiceManager.prepareValues(diceValues, this.state.dices[0].diceObj);

    }
    assignPosition = (diceObj) => {
        diceObj.position.copy(this.state.rigidBody.obj.position);
        diceObj.quaternion.copy(this.state.rigidBody.obj.quaternion);
    }
    assignPyramid = () => {
        this.setState(prevState => ({
            pyramid: { ...prevState.pyramid, ...{ triggerMoving: true } }
        }));
    }
    movePyramid = () => {
        if (this.state.pyramid.aboveGround === true) {
            this.state.pyramid.pyramidObj.position.y = this.state.pyramid.pyramidObj.position.y - 0.1;
            if (this.state.pyramid.pyramidObj.position.y < 9) {
                this.setState(prevState => ({
                    pyramid: { ...prevState.pyramid, ...{ aboveGround: false, triggerMoving: false } }
                }));
            }
        } else if (this.state.pyramid.aboveGround === false) {
            this.state.pyramid.pyramidObj.position.y = this.state.pyramid.pyramidObj.position.y + 0.1;
            if (this.state.pyramid.pyramidObj.position.y > 15) {
                this.setState(prevState => ({
                    pyramid: { ...prevState.pyramid, ...{ aboveGround: true, triggerMoving: false } }
                }));
            }
        }
    }
    moveView = (targetAxisObj) => {
        // console.log(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        // console.log(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z);
        let { x, y, z } = this.camera.position;
        let { x: rx, y: ry, z: rz } = this.camera.rotation;
        let { x: targetX, y: targetY, z: targetZ, rx: targetRx, ry: targetRy, rz: targetRz } = targetAxisObj;
        if (Math.abs(targetRz) > 60 * Math.PI / 180 && Math.abs(targetRz) < 180 * Math.PI / 180 && Math.abs(rz) > 60 * Math.PI / 180 && Math.abs(rz) < 180 * Math.PI / 180) {
            if (rz < 0 && targetX > 0){
                rz = rz + 360 * Math.PI / 180;
                this.camera.rotation.set(rx, ry, rz);
            } 
            else if (rz > 0 && targetX < 0){
                rz = rz - 360 * Math.PI / 180;
                this.camera.rotation.set(rx, ry, rz);
            }
        }
        let totalStepSegments = 100;
        let cameraMove = window.setInterval(() => {
            if (Math.abs(this.camera.position.x - targetX) < 1 / totalStepSegments * Math.abs(x - targetX)) { window.clearInterval(cameraMove); return; }
            this.camera.position.x = this.camera.position.x + (targetX - x) / totalStepSegments;
            this.camera.position.y = this.camera.position.y + (targetY - y) / totalStepSegments;
            this.camera.position.z = this.camera.position.z + (targetZ - z) / totalStepSegments;
            this.camera.rotation.x = this.camera.rotation.x + (targetRx - rx) / totalStepSegments;
            this.camera.rotation.y = this.camera.rotation.y + (targetRy - ry) / totalStepSegments;
            this.camera.rotation.z = this.camera.rotation.z + (targetRz - rz) / totalStepSegments;
        }, 1500 / totalStepSegments
        );
    }
    handleViewPlus = () => {
        this.moveView(this.state.perspective[(this.state.presentPerspective + 1) % 4]);
        this.setState(prevState => ({ presentPerspective: (prevState.presentPerspective + 1) % 4 }));
    }
    handleViewMinus = () => {
        this.moveView(this.state.perspective[(this.state.presentPerspective - 1) % 4 >= 0 ? ((this.state.presentPerspective - 1) % 4) :
            ((this.state.presentPerspective - 1) % 4 + 4)]);
        this.setState(prevState => ({
            presentPerspective: (prevState.presentPerspective - 1) % 4 >= 0 ? ((prevState.presentPerspective - 1) % 4) :
                ((prevState.presentPerspective - 1) % 4 + 4)
        }));
    }
    judgeDiceNumber = (diceObj) => {
        // console.log(this.state.dices[0].diceObj.quaternion.x, this.state.dices[0].diceObj.quaternion.y, this.state.dices[0].diceObj.quaternion.z, this.state.dices[0].diceObj.quaternion.w);
        // console.log(this.state.dices[0].diceObj.rotation.x, this.state.dices[0].diceObj.rotation.y, this.state.dices[0].diceObj.rotation.z);
        const { x, y, z, w } = diceObj.quaternion;
        console.log(x, y, z, w);
        if (Math.abs(Math.abs(x) - Math.abs(w)) < 0.01 && Math.abs(Math.abs(y) - Math.abs(z)) < 0.01 && Math.abs(Math.abs(x) - Math.abs(w)) < Math.abs(Math.abs(x) - Math.abs(y))) {
            console.log("dice number is 1");
            return 1;
        } else if (Math.abs(Math.abs(x) - Math.abs(y)) < 0.01 && Math.abs(Math.abs(z) - Math.abs(w)) < 0.01) {
            console.log("dice number is 3");
            return 3;
        } else if ((Math.abs(x) < 0.01 && Math.abs(z) < 0.01) || Math.abs(w) < 0.01) {
            console.log("dice number is 2");
            return 2;
        } else {
            console.log("I don't know this dice number");
            alert("I don't know this dice number, I guess dice number is 2");
            return 2;
        }
    }

    judgeCamelRanking = () => {
        let copiedCamels =this.state.camels.slice();
        copiedCamels.sort(function (a, b) {
            if (a.boxNum !== b.boxNum) {
                return b.boxNum - a.boxNum;
            } else {
                return b.level - a.level;
            }
        });
        let sortedArray = [];
        for (let i = 0; i < copiedCamels.length; i++ ) {
            sortedArray.push( copiedCamels[i].color );
        }
        return sortedArray;
    }
    checkGameEnd = () => {
        if (this.state.camels.find(element => element.boxNum >= 16) !== undefined ){
            // 若遊戲結束，四個骰子仍未骰完，也強迫結算
            this.context.dispatch({ type: 'COUNT_ROUND_BET', camelsRanking: this.judgeCamelRanking()});
            this.context.dispatch({ type: 'CLEAR_USER_CARD_STOCK' });
            this.context.dispatch({ type: 'SHOW_GAME_END_INFO' });
            return;
        } else {
            return;
        }
    }
    camelRun = () => {
        if (this.state.isClickingRun === false && this.state.pyramid.triggerMoving === false) {
            // 如果歷史骰子有四顆顯示，先歸零
            if (this.state.historyDices.length === 4) {
                this.setState({ historyDices: [] });
            }
            // 讓金字塔下降
            this.assignPyramid();

            function returnNwithProbability(probabilityObj) {
                // 使用法如下，物件建立邏輯為， 名稱 : 百分之幾的機率
                // const probabilityObj = {"1": 20, "2": 5, "3": 15, "4": 10, "5": 50};
                // returnNwithProbability(probabilityObj); 會回傳有相應機率的名稱。
                let denominator = 0;
                let intervalArray = [-1];
                for (var propName in probabilityObj) {
                    denominator += probabilityObj[propName];
                    intervalArray.push(denominator);
                }
                const randomNumToHundred = Math.round(Math.random() * denominator);

                for (let i = 0; i < intervalArray.length - 1; i++) {
                    if (randomNumToHundred > intervalArray[i] && randomNumToHundred <= intervalArray[i + 1]) {
                        let finalName = Object.entries(probabilityObj).slice(0)[i][0];
                        return finalName;
                    }
                }
            }

            let randomColorArray = ["orange", "green", "red", "blue"];
            for (let i = 0; i < this.state.historyDices.length; i++) {
                randomColorArray = randomColorArray.filter(element => (element !== this.state.historyDices[i].color));
            }

            let selectedColor = "";
            let probabilityObj = {};
            switch (randomColorArray.length) {
                case 4:
                    selectedColor = returnNwithProbability({ "red": 25, "green": 25, "blue": 25, "orange": 25 });
                    break;
                case 3:
                    probabilityObj[randomColorArray[0]] = 33;
                    probabilityObj[randomColorArray[1]] = 33;
                    probabilityObj[randomColorArray[2]] = 34;
                    selectedColor = returnNwithProbability(probabilityObj);
                    break;
                case 2:
                    probabilityObj[randomColorArray[0]] = 50;
                    probabilityObj[randomColorArray[1]] = 50;
                    selectedColor = returnNwithProbability(probabilityObj);
                    break;
                case 1:
                    selectedColor = randomColorArray[0];
                    break;
                case 0:
                    selectedColor = returnNwithProbability({ "red": 25, "green": 25, "blue": 25, "orange": 25 });
                    break;
                default:
                    selectedColor = returnNwithProbability({ "red": 25, "green": 25, "blue": 25, "orange": 25 });
                    return;
            }

            const selectedDiceIndex = this.state.dices.indexOf(this.state.dices.find(element => (element.color === selectedColor)));
            const selectedDiceObj = this.state.dices[selectedDiceIndex].diceObj;
            const jumpCamel = this.state.camels.find(element => (element.color === selectedColor));
            const jumpCamelId = jumpCamel.id;

            // 設定骰子可見與消失

            this.state.dices.find(element => (element.color === selectedColor)).diceObj.visible = true;
            this.state.dices.filter(element => (element.color !== selectedColor)).forEach(el => { el.diceObj.visible = false; });

            // triggerRolling: 將會 1. 使指定函式開始運作，讓骰子與剛體位置重合
            this.setState(prevState => ({
                rigidBody: { ...prevState.rigidBody, ...{ triggerRolling: true } },
                targetDiceObj: prevState.dices[selectedDiceIndex].diceObj,
                isClickingRun: true
            }));
            // 1 秒後，開始呼叫轉動函數，讓骰子開始轉
            let enableCheck = false;
            window.setTimeout(() => { this.rollDice(selectedDiceObj); enableCheck = true; }, 1000);

            // 1 秒後，設定原先不可見的駱駝，變為可見
            if (jumpCamel.camel.visible === false) {
                window.setTimeout(() => { jumpCamel.camel.visible = true }, 1000);
            }
            // 每 0.5 秒會檢查轉完沒
            // 轉完後會檢查數字，回傳數字值，用此數字值設定進 state ，為駱駝該走的步數。哪隻駱駝該走，也在此同時設定進 state
            // 檢查完後兩秒，再升起金字塔、讓骰子變不可見、讓骰子剛體回到金字塔中心

            let keepChecking = window.setInterval(() => {
                if (enableCheck && this.dice.isFinished()) {
                    const step = this.judgeDiceNumber(selectedDiceObj);
                    console.log("step:", step);
                    console.log("jumpCamelId:", jumpCamelId);
                    jumpInfo[jumpCamelId].triggerJump = true;
                    jumpInfo[jumpCamelId].onGround = false;
                    this.setState(prevState => ({
                        camels: [...prevState.camels.filter(element => (jumpCamelId !== element.id)),
                        {
                            ...prevState.camels.find(element => (jumpCamelId === element.id)),
                            ...{ nextBoxNum: this.setNextBox(jumpCamelId, step), nextLevel: this.setNextLevel(jumpCamelId, step, jumpCamelId), run: true }
                        }],
                        step: step,
                        targetJumpCamelId: jumpCamelId,
                        upperCamels: this.setUpperCamelsArray(jumpCamelId),
                        rigidBody: { ...prevState.rigidBody, ...{ triggerRolling: false } },
                        targetDiceObj: {},
                        historyDices: (prevState.historyDices.length >= 4) ?
                            [{ color: selectedColor, number: step }] : [...prevState.historyDices, { color: selectedColor, number: step }]
                    }));
                    enableCheck = false;
                    window.setTimeout(() => {
                        this.setState(prevState => ({
                            isClickingRun: false
                        }));
                        this.assignPyramid();
                        selectedDiceObj.visible = false;
                        this.state.rigidBody.obj.position.x = 0;
                        this.state.rigidBody.obj.position.y = 18;
                        this.state.rigidBody.obj.position.z = 0;
                        if (this.context.playerData.playerRound >= 0) {
                            this.context.dispatch({
                                type: 'ADD_MONEY', amount: 1,
                                playerId: this.context.playerData.playerRound % this.context.playerData.players.length + 1
                            });
                        }
                        // 當下回合若為四的倍數，統計賭注與清空玩家卡片庫。加一為本回合之意，因目前 camelRound 還是前一局的
                        if ((this.context.playerData.camelRound + 1) > 0 && (this.context.playerData.camelRound + 1) % 4 === 0
                        && this.state.camels.find(element => element.boxNum >= 16) === undefined) {
                            this.context.dispatch({ type: 'COUNT_ROUND_BET', camelsRanking: this.judgeCamelRanking()});
                            this.context.dispatch({ type: 'SHOW_ROUND_INFO' });
                            this.context.dispatch({ type: 'CLEAR_USER_CARD_STOCK' });
                        }
                        // 檢查遊戲是否結束
                        this.checkGameEnd();
                        // 駱駝回合加一，以及玩家回合加一，切換玩家回合
                        this.context.dispatch({ type: 'PLAYER_AND_CAMEL_ROUND_ADD' });
                    }, 2000);
                    window.clearInterval(keepChecking);
                    return;
                }
            }, 500);
        }
    }
    gameBegin = () => {
        let i = 1;
        let beginRunTimes = 4;
        this.camelRun();
        let keepPlaying = window.setInterval(() => {
            if (this.state.pyramid.aboveGround === true) {
                i++;
                this.camelRun();
            }
            if (i >= beginRunTimes) {
                window.clearInterval(keepPlaying);
                return;
            }
        }, 2000);
    }
    gameRestart = () => {
        jumpInfo = [new physicalWorld(), new physicalWorld(), new physicalWorld(), new physicalWorld()];
        let resetedCamels = [];
        this.state.camels.forEach( element => {
            element.camel.visible = false;
            element.camel.position.set(12, 17.2, 12);
            element.camel.rotation.y = 0;
            resetedCamels.push({
                camel: element.camel, id: element.id, color: element.color, position: { x: 12, y: 17.2, z: 12 },
                boxNum: 0, level: 1, rotation: 0, run: false, nextBoxNum: 0, nextLevel: 0
            });
        });


        this.setState(prevState => ({
            camels: resetedCamels,
            step: 0,
            targetJumpCamelId: 0,
            upperCamels: [],
            historyDices: []
        }));
    }
    render() {
        let diceImgs = this.state.historyDices.length ? (
            this.state.historyDices.map((element, i) => {
                return (
                    <div key={5000 + i}><img className={`dice-all dice-color-img${i + 1}`} src={`./imgs/${element.color}_${element.number}.png`} key={6000 + i}></img></div>
                )
            })) : (<div></div>);

        return (
            <div>
                <div className="scene-canvas" ref={(mount) => { this.mount = mount }}>
                    <div className="camera-area">
                        <button className="camera-btn" onClick={this.handleViewPlus}><img className="arrow-img arrow-right" src="./imgs/camera_right.png"></img></button>
                        <div><img className="camera-img" src="./imgs/view-switch.png"></img></div>
                        <button className="camera-btn" onClick={this.handleViewMinus}><img className="arrow-img arrow-left" src="./imgs/camera_left.png"></img></button>
                    </div>
                    <div className="dice-area">
                        <div><img className="dice-his-img" src="./imgs/dice-history-no-back.png"></img></div>
                        {diceImgs}
                    </div>
                    <GameBtn camelRun={this.camelRun} isDicing={!(this.state.isClickingRun === false && this.state.pyramid.triggerMoving === false)}/>
                </div>
            </div>

        )
    }
}
export default ThreeScene;