import * as THREE from '../libs/three.js/r131/three.module.js'
import { OrbitControls } from '../libs/three.js/r131/controls/OrbitControls.js'

let renderer = null, scene = null, camera = null, root = null, orbitControls = null;

let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked;

let directionalLight = null, spotLight = null, ambientLight = null;

let listener =null,audioLoader;

let E4=null,A5=null,D5=null,G5=null,B5=null, E5=null;

const mapUrl = "../media/checker_large.gif";

function update() 
{
    requestAnimationFrame(function() { update(); });
    renderer.render( scene, camera );
    orbitControls.update();
}

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

function loadAudio(){

    E4 = new THREE.Audio( listener );
    audioLoader.load( 'sounds/E4.mp3', function( buffer ) {
        E4.setBuffer( buffer );
        E4.setVolume( 0.25);
    },
    onProgress,onError
    );

    A5 = new THREE.Audio( listener );
    audioLoader.load( 'sounds/A5.mp3', function( buffer ) {
        A5.setBuffer( buffer );
        A5.setVolume( 0.25);
    },
    onProgress,onError
    );

    D5 = new THREE.Audio( listener );
    audioLoader.load( 'sounds/D5.mp3', function( buffer ) {
        D5.setBuffer( buffer );
        D5.setVolume( 0.25);
    },
    onProgress,onError
    );

    G5 = new THREE.Audio( listener );

    audioLoader.load( 'sounds/G5.mp3', function( buffer ) {
        G5.setBuffer( buffer );
        G5.setVolume( 0.25);
    },
    onProgress,onError
    );

    B5 = new THREE.Audio( listener );

    audioLoader.load( 'sounds/B5.mp3', function( buffer ) {
        B5.setBuffer( buffer );
        B5.setVolume( 0.25);
    },
    onProgress,onError
    );

    E5 = new THREE.Audio( listener );

    audioLoader.load( 'sounds/E5.mp3', function( buffer ) {
        E5.setBuffer( buffer );
        E5.setVolume( 0.25);
    },
    onProgress,onError
    );
}

function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 15, 125);
    listener = new THREE.AudioListener();
    camera.add( listener );

    audioLoader = new THREE.AudioLoader();

    loadAudio()

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0,0,0);
        
    directionalLight = new THREE.DirectionalLight( 0xaaaaaa, 1);
    directionalLight.position.set(0, 5, 100);

    root = new THREE.Object3D();

    scene.add(directionalLight);
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(0, 8, 100);
    scene.add(spotLight);

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.3);
    scene.add(ambientLight);

    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    let geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    let floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4;
    scene.add(floor );
    
    raycaster = new THREE.Raycaster();

    document.addEventListener('pointermove', onDocumentPointerMove);
    document.addEventListener('pointerdown', onDocumentPointerDown);

    scene.add( root );
}

function onDocumentPointerMove( event ) 
{
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( root.children );

    if ( intersects.length > 0 ) 
    {
        if ( intersected != intersects[ 0 ].object ) 
        {
            if ( intersected )
                intersected.material.emissive.set( intersected.currentHex );

            intersected = intersects[ 0 ].object;
            intersected.currentHex = intersected.material.emissive.getHex();
            intersected.material.emissive.set( 0xff0000 );
        }
    } 
    else 
    {
        if ( intersected ) 
            intersected.material.emissive.set( intersected.currentHex );

        intersected = null;
    }
}

function onDocumentPointerDown(event)
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( root.children );

    if ( intersects.length > 0 ) 
    {
        clicked = intersects[ 0 ].object;
        clicked.material.emissive.set( 0x00ff00 );
        console.log(E4)
        if(clicked.name=='E4') 
        {
            if(E4.isPlaying){E4.stop(); }
            E4.play();
        }
        if(clicked.name=='E5') 
        {
            if(E5.isPlaying){E5.stop(); }
            E5.play();
        }
        if(clicked.name=='B5') 
        {
            if(B5.isPlaying){B5.stop();}
            B5.play();
        }
        if(clicked.name=='G5') 
        {
            if(G5.isPlaying){G5.stop();}
            G5.play();
        }
        if(clicked.name=='D5') 
        {
            if(D5.isPlaying){D5.stop();}
            D5.play();
        }
        if(clicked.name=='A5') 
        {
            if(A5.isPlaying){A5.stop();}
            A5.play();
        }
    } 
    else 
    {

        if ( clicked ) 
        {
            clicked.material.emissive.set( clicked.currentHex );
        }

        clicked = null;
    }
}

function addBoxes()
{
    const geometry = new THREE.BoxGeometry( 5, 5, 5 );

    const string1 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    string1.name = 'E5';
    string1.position.set(10, 10 ,10);
    
    const string2 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    string2.name = 'B5';
    string2.position.set(10, 20 ,10);

    const string3 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    string3.name = 'G5';
    string3.position.set(10, 30 ,10);

    const string4 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    string4.name = 'D5';
    string4.position.set(10, 40 ,10);

    const string5 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    string5.name = 'A5';
    string5.position.set(10, 50 ,10);

    const string6 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    string6.name = 'E4';
    string6.position.set(10, 60 ,10);

    root.add( string1 );
    root.add( string2 );
    root.add( string3 );
    root.add( string4 );
    root.add( string5 );
    root.add( string6 );

}

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    addBoxes();

    update();
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.addEventListener('resize', resize, false);

main();
resize(); 

