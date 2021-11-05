import './App.css';
import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import Pizzicato from 'pizzicato'

var pingPongDelay = new Pizzicato.Effects.PingPongDelay({
  feedback: 0.6,
  time: 0.3,
  mix: 0.68
});

var quadrafuzz = new Pizzicato.Effects.Quadrafuzz({
  lowGain: 1,
  midLowGain: 1,
  midHighGain: 1,
  highGain: 1,
  mix: 1.0
});

let renderer = null, scene = null, camera = null, root = null, orbitControls = null;

let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked,ghostBool=false;

let directionalLight = null, spotLight = null, ambientLight = null;

let currentTime = Date.now();

let objects=[]

let modelUrls = ["./models/test/guitar.glb"];

const mapUrl = "./media/checker_large.gif";

class App extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
  }

  onError ( err ){ console.error( err ); };

  onProgress( xhr ) 
  {
      if ( xhr.lengthComputable ) {
  
          const percentComplete = xhr.loaded / xhr.total * 100;
          console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
      }
  }
  
  addBoxes()
  {
      const geometry = new THREE.BoxGeometry( 5, 5, 5 );
  
      const string1 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
      string1.name = 'Cuerda6';
      string1.position.set(10, 10 ,10);
      
      const string2 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
      string2.name = 'Cuerda5';
      string2.position.set(10, 15 ,10);
  
      const string3 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
      string3.name = 'Cuerda4';
      string3.position.set(10, 20 ,10);
  
      const string4 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
      string4.name = 'Cuerda3';
      string4.position.set(10, 25 ,10);
  
      const string5 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
      string5.name = 'Cuerda2';
      string5.position.set(10, 30 ,10);
  
      const string6 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
      string6.name = 'Cuerda1';
      string6.position.set(10, 35 ,10);
  
      root.add( string1 );
      root.add( string2 );
      root.add( string3 );
      root.add( string4 );
      root.add( string5 );
      root.add( string6 );
  
  }

  async loadGLTF()
  {
    const gltfLoader = new GLTFLoader();

    const modelsPromises = modelUrls.map(url =>{
        return gltfLoader.loadAsync(url);
    });

    try
    {
        const results = await Promise.all(modelsPromises);

        results.forEach( (result) =>
        {
            const object = result.scene;
            object.scale.set( 20,20,20 );
            object.position.x =  0;
            object.position.y = 8;
            object.position.z = -10 ;

            object.castShadow = true;
            object.receiveShadow = true;

            object.mixer = new THREE.AnimationMixer( scene );
            object.action = object.mixer.clipAction( result.animations[0], object).setDuration( 10.0 );
            object.action.play(); 
            object.action = object.mixer.clipAction( result.animations[1], object).setDuration( 10.0 );
            object.action.play(); 
            object.action = object.mixer.clipAction( result.animations[2], object).setDuration( 10.0 );
            object.action.play(); 
            object.action = object.mixer.clipAction( result.animations[3], object).setDuration( 10.0 );
            object.action.play(); 
            object.action = object.mixer.clipAction( result.animations[4], object).setDuration( 10.0 );
            object.action.play(); 
            object.action = object.mixer.clipAction( result.animations[5], object).setDuration( 10.0 );
            object.action.play(); 
            object.action = object.mixer.clipAction( result.animations[6], object).setDuration( 10.0 );
            object.action.play(); 
            object.action = object.mixer.clipAction( result.animations[7], object).setDuration( 10.0 );
            object.action.play(); 
            object.action = object.mixer.clipAction( result.animations[8], object).setDuration( 10.0 );
            object.action.play(); 

            object.action.play();   
            objects.push(object);     
            root.add(object);
        });        
    }
    catch(err)
    {
        console.error(err);
    }
}

  init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight);
    camera.position.set(0, 15, 125);

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

    scene.add( root );

    this.loadGLTF()

    document.addEventListener('pointerdown', this.onDocumentPointerDown);

    return renderer.domElement;
  }

  //animation
  animate() {
    requestAnimationFrame(this.animate);
    orbitControls.update();

    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

    for(const object of objects)
    {


        if(object.mixer)
            object.mixer.update(deltat*0.001);
    }

    renderer.render(scene, camera);
  }

  onDocumentPointerDown(event)
  {
      event.preventDefault();
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
      raycaster.setFromCamera( mouse, camera );
  
      let intersects = raycaster.intersectObjects( objects[0].children );
  
      if ( intersects.length > 0 ) 
      {
          clicked = intersects[ 0 ].object;
          console.log(clicked)
          //clicked.material.emissive.set( 0x00ff00 );
          if(clicked.name=='Cuerda1') 
          {
            var sound = new Pizzicato.Sound( './sounds/E4.mp3' , () => {
              if(ghostBool)sound.addEffect(pingPongDelay);
              //sound.addEffect(quadrafuzz);
              sound.play();
            });
          }
          if(clicked.name=='Cuerda6') 
          {
            var sound = new Pizzicato.Sound( './sounds/E5.mp3' , () => {
              if(ghostBool)sound.addEffect(pingPongDelay);
              //sound.addEffect(quadrafuzz);
              sound.play();
            });
          }
          if(clicked.name=='Cuerda5') 
          {
            var sound = new Pizzicato.Sound( './sounds/B5.mp3' , () => {
              if(ghostBool)sound.addEffect(pingPongDelay);
              //sound.addEffect(quadrafuzz);
              sound.play();
            });
          }
          if(clicked.name=='Cuerda4') 
          {
            var sound = new Pizzicato.Sound( './sounds/G5.mp3' , () => {
              if(ghostBool)sound.addEffect(pingPongDelay);
              //sound.addEffect(quadrafuzz);
              sound.play();
            });
          }
          if(clicked.name=='Cuerda3') 
          {
            var sound = new Pizzicato.Sound( './sounds/D5.mp3' , () => {
              if(ghostBool)sound.addEffect(pingPongDelay);
              //sound.addEffect(quadrafuzz);
              sound.play();
            });
          }
          if(clicked.name=='Cuerda2') 
          {
            var sound = new Pizzicato.Sound( './sounds/A5.mp3' , () => {
              if(ghostBool)sound.addEffect(pingPongDelay);
              //sound.addEffect(quadrafuzz);
              sound.play();
            });
          }
          if(clicked.name=="selector_Cube095_2")
          {
            ghostBool=!ghostBool
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


  componentDidMount() {
    
    document.getElementById("Render").appendChild(this.init());
    this.addBoxes();
    this.animate();
  }

  render() {
    return <div id="Render" className="App"></div>;
  }
}
export default App;
