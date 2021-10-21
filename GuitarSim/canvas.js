import * as THREE from "../libs/three.js/r131/three.module.js"

import  {OrbitControls}  from '../libs/three.js/r131/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/r131/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/r131/loaders/MTLLoader.js';
import { FBXLoader } from '../libs/three.js/r131/loaders/FBXLoader.js';

let renderer=null,scene=null,camera=null,controls=null
let hombro =null
const guitarra=  {obj:'./models/test/guitar.obj', mtl:'./models/test/guitar.mtl'};

function main() 
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);
    
    update();
}

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

async function loadObjMtl(objModelUrl)
{
    try
    {
        const mtlLoader = new MTLLoader();

        const materials = await mtlLoader.loadAsync(objModelUrl.mtl, onProgress, onError);

        materials.preload();
        
        const objLoader = new OBJLoader();

        objLoader.setMaterials(materials);

        const object = await objLoader.loadAsync(objModelUrl.obj, onProgress, onError);
    
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        object.position.y += 1;
        object.scale.set(1, 1, 1);
        console.log(object)
        scene.add(object);
    }
    catch (err)
    {
        onError(err);
    }
}
function animate(){}

function update()
{

    requestAnimationFrame(function() { update(); });
    
    renderer.render( scene, camera );

    //animate();

    controls.update()
    
}

function createScene(canvas)
{   
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);

    
    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    scene.add(new THREE.AxesHelper());

    camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 10;

	controls = new OrbitControls( camera, renderer.domElement );

    
    const light = new THREE.DirectionalLight( 0xffffff, 1.0);
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);
    const pointlight = new THREE.PointLight()
    pointlight.position.set(0.8, 1.4, 1.0)
    scene.add(pointlight)

    const ambientLight = new THREE.AmbientLight(0xffccaa, 0);
    scene.add(ambientLight);

	loadObjMtl(guitarra);
    
    
    const fbxLoader = new FBXLoader()
    /* fbxLoader.load(
        'models/guitar2/guitar2.fbx',
        (object) => {
            // object.traverse(function (child) {
            //     if ((child as THREE.Mesh).isMesh) {
            //         // (child as THREE.Mesh).material = material
            //         if ((child as THREE.Mesh).material) {
            //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
            //         }
            //     }
            // })
            object.position.set(0,2,0)
            object.scale.set(.01, .01, .01)
            object.rotation.x=20
            console.log(object)
            scene.add(object)

        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )*/


}
main();