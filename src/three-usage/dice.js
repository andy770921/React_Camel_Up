import * as CANNON from 'cannon';
import * as THREE from 'three';

class DiceManagerClass {
    constructor() {
        this.world = null;
    }

    setWorld(world) {
        this.world = world;

        this.diceBodyMaterial = new CANNON.Material();
        this.floorBodyMaterial = new CANNON.Material();
        this.barrierBodyMaterial = new CANNON.Material();

        world.addContactMaterial(
            new CANNON.ContactMaterial(this.floorBodyMaterial, this.diceBodyMaterial, { friction: 0.01, restitution: 0.5 })
        );
        world.addContactMaterial(
            new CANNON.ContactMaterial(this.barrierBodyMaterial, this.diceBodyMaterial, { friction: 0, restitution: 1.0 })
        );
        world.addContactMaterial(
            new CANNON.ContactMaterial(this.diceBodyMaterial, this.diceBodyMaterial, { friction: 0, restitution: 0.5 })
        );
    }

    /**
     *
     * @param {array} diceValues
     * @param {DiceObject} [diceValues.dice]
     * @param {number} [diceValues.value]
     *
     */
    prepareValues(diceValues) {
        if (this.throwRunning) throw new Error('Cannot start another throw. Please wait, till the current throw is finished.');

        for (let i = 0; i < diceValues.length; i++) {
            if (diceValues[i].value < 1 || diceValues[i].dice.values < diceValues[i].value) {
                throw new Error('Cannot throw die to value ' + diceValues[i].value + ', because it has only ' + diceValues[i].dice.values + ' sides.');
            }
        }

        this.throwRunning = true;

        for (let i = 0; i < diceValues.length; i++) {
            diceValues[i].dice.simulationRunning = true;
            diceValues[i].vectors = diceValues[i].dice.getCurrentVectors();
            diceValues[i].stableCount = 0;
        }

        let check = () => {
            let allStable = true;
            for (let i = 0; i < diceValues.length; i++) {
                if (diceValues[i].dice.isFinished()) {
                    diceValues[i].stableCount++;
                } else {
                    diceValues[i].stableCount = 0;
                }

                if (diceValues[i].stableCount < 50) {
                    allStable = false;
                }
            }

            if (allStable) {
                console.log("all stable");
                DiceManager.world.removeEventListener('postStep', check);

                for (let i = 0; i < diceValues.length; i++) {
                    diceValues[i].dice.shiftUpperValue(diceValues[i].value);
                    diceValues[i].dice.setVectors(diceValues[i].vectors);
                    diceValues[i].dice.simulationRunning = false;
                    
                }
                
                this.throwRunning = false;
            } else {
                DiceManager.world.step(DiceManager.world.dt);
            }
        };

        this.world.addEventListener('postStep', check);
    }
}

class DiceObject {
    /**
     * @constructor
     * @param {object} options
     * @param {Number} [options.size = 100]
     * @param {Number} [options.fontColor = '#000000']
     * @param {Number} [options.backColor = '#ffffff']
     */
    constructor(options) {
        options = this.setDefaults(options, {
            size: 100,
            fontColor: '#000000',
            backColor: '#ffffff'
        });

        this.object = null;
        this.size = options.size;
        this.invertUpside = false;

        this.materialOptions = {
            specular: 0x172022,
            color: 0xf0f0f0,
            shininess: 40,
            transparent : true,
        };
        this.labelColor = options.fontColor;
        this.diceColor = options.backColor;
    }

    setDefaults(options, defaults) {
        options = options || {};

        for (let key in defaults) {
            if (!defaults.hasOwnProperty(key)) continue;

            if (!(key in options)) {
                options[key] = defaults[key];
            }
        }

        return options;
    }

    emulateThrow(callback) {
        let stableCount = 0;

        let check = () => {
            if (this.isFinished()) {
                stableCount++;

                if (stableCount === 50) {
                    DiceManager.world.removeEventListener('postStep', check);
                    callback(this.getUpsideValue());
                }
            } else {
                stableCount = 0;
            }

            DiceManager.world.step(DiceManager.world.dt);
        };

        DiceManager.world.addEventListener('postStep', check);
    }

    isFinished() {
        let threshold = 0.001;
        
        let angularVelocity = this.object.body.angularVelocity;
        let velocity = this.object.body.velocity;

        return (Math.abs(angularVelocity.x) < threshold && Math.abs(angularVelocity.y) < threshold && Math.abs(angularVelocity.z) < threshold &&
            Math.abs(velocity.x) < threshold && Math.abs(velocity.y) < threshold && Math.abs(velocity.z) < threshold);
    }

    getUpsideValue() {
        let vector = new THREE.Vector3(0, this.invertUpside ? -1 : 1);
        let closest_face;
        let closest_angle = Math.PI * 2;
        for (let i = 0; i < this.object.geometry.faces.length; ++i) {
            let face = this.object.geometry.faces[i];
            if (face.materialIndex === 0) continue;

            let angle = face.normal.clone().applyQuaternion(this.object.body.quaternion).angleTo(vector);
            if (angle < closest_angle) {
                closest_angle = angle;
                closest_face = face;
            }
        }

        return closest_face.materialIndex - 1;
    }

    getCurrentVectors() {
        return {
            position: this.object.body.position.clone(),
            quaternion: this.object.body.quaternion.clone(),
            velocity: this.object.body.velocity.clone(),
            angularVelocity: this.object.body.angularVelocity.clone()
        };
    }

    setVectors(vectors) {
        this.object.body.position = vectors.position;
        this.object.body.quaternion = vectors.quaternion;
        this.object.body.velocity = vectors.velocity;
        this.object.body.angularVelocity = vectors.angularVelocity;
    }

    shiftUpperValue(toValue) {
        let geometry = this.object.geometry.clone();

        let fromValue = this.getUpsideValue();

        for (let i = 0, l = geometry.faces.length; i < l; ++i) {
            let materialIndex = geometry.faces[i].materialIndex;
            if (materialIndex === 0) continue;

            materialIndex += toValue - fromValue - 1;
            while (materialIndex > this.values) materialIndex -= this.values;
            while (materialIndex < 1) materialIndex += this.values;

            geometry.faces[i].materialIndex = materialIndex + 1;
        }

        this.object.geometry = geometry;
    }

    getChamferGeometry(vectors, faces, chamfer) {
        let chamfer_vectors = [], chamfer_faces = [], corner_faces = new Array(vectors.length);
        for (let i = 0; i < vectors.length; ++i) corner_faces[i] = [];
        for (let i = 0; i < faces.length; ++i) {
            let ii = faces[i], fl = ii.length - 1;
            let center_point = new THREE.Vector3();
            let face = new Array(fl);
            for (let j = 0; j < fl; ++j) {
                let vv = vectors[ii[j]].clone();
                center_point.add(vv);
                corner_faces[ii[j]].push(face[j] = chamfer_vectors.push(vv) - 1);
            }
            center_point.divideScalar(fl);
            for (let j = 0; j < fl; ++j) {
                let vv = chamfer_vectors[face[j]];
                vv.subVectors(vv, center_point).multiplyScalar(chamfer).addVectors(vv, center_point);
            }
            face.push(ii[fl]);
            chamfer_faces.push(face);
        }
        for (let i = 0; i < faces.length - 1; ++i) {
            for (let j = i + 1; j < faces.length; ++j) {
                let pairs = [], lastm = -1;
                for (let m = 0; m < faces[i].length - 1; ++m) {
                    let n = faces[j].indexOf(faces[i][m]);
                    if (n >= 0 && n < faces[j].length - 1) {
                        if (lastm >= 0 && m !== lastm + 1) pairs.unshift([i, m], [j, n]);
                        else pairs.push([i, m], [j, n]);
                        lastm = m;
                    }
                }
                if (pairs.length !== 4) continue;
                chamfer_faces.push([chamfer_faces[pairs[0][0]][pairs[0][1]],
                chamfer_faces[pairs[1][0]][pairs[1][1]],
                chamfer_faces[pairs[3][0]][pairs[3][1]],
                chamfer_faces[pairs[2][0]][pairs[2][1]], -1]);
            }
        }
        for (let i = 0; i < corner_faces.length; ++i) {
            let cf = corner_faces[i], face = [cf[0]], count = cf.length - 1;
            while (count) {
                for (let m = faces.length; m < chamfer_faces.length; ++m) {
                    let index = chamfer_faces[m].indexOf(face[face.length - 1]);
                    if (index >= 0 && index < 4) {
                        if (--index === -1) index = 3;
                        let next_vertex = chamfer_faces[m][index];
                        if (cf.indexOf(next_vertex) >= 0) {
                            face.push(next_vertex);
                            break;
                        }
                    }
                }
                --count;
            }
            face.push(-1);
            chamfer_faces.push(face);
        }
        return { vectors: chamfer_vectors, faces: chamfer_faces };
    }

    makeGeometry(vertices, faces, radius, tab, af) {
        let geom = new THREE.Geometry();
        for (let i = 0; i < vertices.length; ++i) {
            let vertex = vertices[i].multiplyScalar(radius);
            vertex.index = geom.vertices.push(vertex) - 1;
        }
        for (let i = 0; i < faces.length; ++i) {
            let ii = faces[i], fl = ii.length - 1;
            let aa = Math.PI * 2 / fl;
            for (let j = 0; j < fl - 2; ++j) {
                geom.faces.push(new THREE.Face3(ii[0], ii[j + 1], ii[j + 2], [geom.vertices[ii[0]],
                geom.vertices[ii[j + 1]], geom.vertices[ii[j + 2]]], 0, ii[fl] + 1));
                geom.faceVertexUvs[0].push([
                    new THREE.Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
                    new THREE.Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
                    new THREE.Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))]);
            }
        }
        geom.computeFaceNormals();
        geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
        return geom;
    }

    createShape(vertices, faces, radius) {
        let cv = new Array(vertices.length), cf = new Array(faces.length);
        for (let i = 0; i < vertices.length; ++i) {
            let v = vertices[i];
            cv[i] = new CANNON.Vec3(v.x * radius, v.y * radius, v.z * radius);
        }
        for (let i = 0; i < faces.length; ++i) {
            cf[i] = faces[i].slice(0, faces[i].length - 1);
        }
        return new CANNON.ConvexPolyhedron(cv, cf);
    }

    getGeometry() {
        let radius = this.size * this.scaleFactor;

        let vectors = new Array(this.vertices.length);
        for (let i = 0; i < this.vertices.length; ++i) {
            vectors[i] = (new THREE.Vector3).fromArray(this.vertices[i]).normalize();
        }

        let chamferGeometry = this.getChamferGeometry(vectors, this.faces, this.chamfer);
        let geometry = this.makeGeometry(chamferGeometry.vectors, chamferGeometry.faces, radius, this.tab, this.af);
        geometry.cannon_shape = this.createShape(vectors, this.faces, radius);

        return geometry;
    }

    calculateTextureSize(approx) {
        return Math.max(128, Math.pow(2, Math.floor(Math.log(approx) / Math.log(2))));
    }

    createTextTexture(text, color, backColor) {
        let canvas = document.createElement("canvas");
        // let context = canvas.getContext("2d");
        // let ts = this.calculateTextureSize(this.size / 2 + this.size * this.textMargin) * 2;
        // canvas.width = canvas.height = ts;
        // context.font = ts / (1 + 2 * this.textMargin) + "pt Arial";
        // context.fillStyle = backColor;
        // context.fillRect(0, 0, canvas.width, canvas.height);
        // context.textAlign = "center";
        // context.textBaseline = "middle";
        // context.fillStyle = color;
        // context.fillText(text, canvas.width / 2, canvas.height / 2);
        let texture = new THREE.Texture(canvas);
        //texture.needsUpdate = true;
        return texture;
    }

    getMaterials() {
        let materials = [];
        for (let i = 0; i < this.faceTexts.length; ++i) {
            let texture = null;
            if (this.customTextTextureFunction) {
                texture = this.customTextTextureFunction(this.faceTexts[i], this.labelColor, this.diceColor);
            } else {
                texture = this.createTextTexture(this.faceTexts[i], this.labelColor, this.diceColor);
            }

            materials.push(new THREE.MeshPhongMaterial(Object.assign({}, this.materialOptions, { map: texture })));
        }
        return materials;
    }

    getObject() {
        return this.object;
    }

    create() {
        if (!DiceManager.world) throw new Error('You must call DiceManager.setWorld(world) first.');
        this.object = new THREE.Mesh(this.getGeometry(), new THREE.MultiMaterial(this.getMaterials()));

        this.object.reveiceShadow = true;
        this.object.castShadow = true;
        this.object.diceObject = this;
        this.object.body = new CANNON.Body({
            mass: this.mass,
            shape: this.object.geometry.cannon_shape,
            material: DiceManager.diceBodyMaterial
        });
        this.object.body.linearDamping = 0.1;
        this.object.body.angularDamping = 0.1;
        DiceManager.world.add(this.object.body);

        return this.object;
    }

    updateMeshFromBody() {
        if (!this.simulationRunning) {
            this.object.position.copy(this.object.body.position);
            this.object.quaternion.copy(this.object.body.quaternion);
        }
    }

    updateBodyFromMesh() {
        this.object.body.position.copy(this.object.position);
        this.object.body.quaternion.copy(this.object.quaternion);
    }
    updateBodyFromInsertDiceObj(insertObj){
        insertObj.position.copy(this.object.position);
        insertObj.quaternion.copy(this.object.quaternion);

    }
}


export class DiceD6 extends DiceObject {
    constructor(options) {
        super(options);

        this.tab = 0.1;
        this.af = Math.PI / 4;
        this.chamfer = 0.96;
        this.vertices = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
        this.faces = [[0, 3, 2, 1, 1], [1, 2, 6, 5, 2], [0, 1, 5, 4, 3],
        [3, 7, 6, 2, 4], [0, 4, 7, 3, 5], [4, 5, 6, 7, 6]];
        this.scaleFactor = 0.9;
        this.values = 6;
        this.faceTexts = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8',
            '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
        this.textMargin = 1.0;
        this.mass = 300;
        this.inertia = 13;

        this.create();
    }
}

//---------------------------------------------//

export const DiceManager = new DiceManagerClass();

if (typeof define === 'function' && define.amd) {
    define(function () {
        return {
            DiceManager: DiceManager,
            DiceD6: DiceD6,
        };
    });
} else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        DiceManager: DiceManager,
        DiceD6: DiceD6,
    };
} else {
    window.Dice = {
        DiceManager: DiceManager,
        DiceD6: DiceD6,
    };
}