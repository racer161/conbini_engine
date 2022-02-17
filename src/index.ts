import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';

//import { FirstPersonControls } from './FirstPersonControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import RapierPhysics from './physics';
import { EditorControls } from './EditorControls';
import { Color } from 'three';

const renderer = new THREE.WebGLRenderer( { antialias: true } );
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 100000 );

window.addEventListener( 'resize', onWindowResize, false );
document.body.appendChild( VRButton.createButton( renderer ) );

renderer.xr.enabled = true;

const clock = new THREE.Clock();

init();

async function init() {

  const controls = new EditorControls( camera, renderer.domElement );

  controls.movementSpeed = 1;
  controls.lookSpeed = 0.125;
  controls.lookVertical = true;

  createFloor();

  const light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

  scene.background = new THREE.Color( 0xbfd1e5 );


  const physics = await RapierPhysics.autoImport();
  physics.buildDefaultWorld();

  // Create a dynamic rigid-body.
  let rigidBodyDesc = RigidBodyDesc.newDynamic().setTranslation(0.0, 1.0, 0.0);
  let rigidBody = physics.world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5);
  let collider = physics.world.createCollider(colliderDesc, rigidBody.handle);

  camera.position.z = 1;

  const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  renderer.setAnimationLoop( function () {

    // Step the simulation forward.  
    physics.world.step();

    controls.update( clock.getDelta() );

    // Get and print the rigid-body's position.
    let position = rigidBody.translation();
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rigidBody.rotation().x, rigidBody.rotation().y, rigidBody.rotation().z);

    renderer.render( scene, camera );
  
  } );

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function createFloor(){
  // floor
  const geometry = new THREE.PlaneGeometry( 10, 10 );
  geometry.rotateX( - Math.PI / 2 );
  const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry, material );
  scene.add( plane );
}