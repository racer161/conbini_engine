import { ColliderDesc, RigidBodyDesc, TempContactManifold } from "@dimforge/rapier3d";
import * as THREE from "three";
import { ACESFilmicToneMapping, Mesh, PMREMGenerator, sRGBEncoding, WebXRManager } from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton";
import { keys } from "ts-transformer-keys";
import { EditorControls } from "../../example/EditorControls";
import RapierPhysics from "../../include/RapierPhysics";
import { Entity } from "../core/Entity";
import { System } from "../core/System"
import { TransformComponent } from "../primitives/Transform";

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { CollisionState } from "./Collision";
import { PhysicsEntity } from "./Physics";

export interface MeshComponent{
    mesh: Mesh
}

export interface RenderEntity extends TransformComponent, MeshComponent{}

 
export class Render<T extends RenderEntity> extends System<T> 
{
    
    name: string = "Render";

    renderer: THREE.WebGLRenderer;
    three_scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: EditorControls;
    clock: THREE.Clock;

    archetype: string[] = keys<RenderEntity>();

    run_priority: number = 1000000000;

    //TODO: make this respect the entities created and not just harcode this scene
    async init_system(): Promise<void> {
        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = sRGBEncoding;
        renderer.physicallyCorrectLights = true;
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 3;

        this.renderer = renderer;

        this.three_scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 100000 );

        var self = this;
        window.addEventListener( 'resize', () =>{
            self.onWindowResize();
        }, false );
        document.body.appendChild( VRButton.createButton( this.renderer ) );

        const pmremGenerator = new PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();


        this.renderer.xr.enabled = true;

        this.clock = new THREE.Clock();

        this.controls = new EditorControls( this.camera, this.renderer.domElement );

        this.controls.movementSpeed = 1;
        this.controls.lookSpeed = 0.125;
        this.controls.lookVertical = true;

        const light = new THREE.AmbientLight(0x404040); // soft white light
        this.three_scene.add(light);

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 0, 1, 0 );
        this.three_scene.add( directionalLight );

        this.camera.position.set(0, 2, 5);

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }

    async init_entity(e: RenderEntity, pass: number): Promise<void> {
        e.mesh.matrixAutoUpdate = false;
        e.mesh.matrix.fromArray(e.transform.value);

        this.three_scene.add(e.mesh);
        this.three_scene.updateMatrixWorld(true);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    async beforeUpdate(): Promise<void> {
        //eventually move this to its own system
        this.controls.update( this.clock.getDelta() );

        this.renderer.render( this.three_scene, this.camera );
        this.three_scene.updateMatrixWorld(true);
    }

    async update(e: T & {name : string }): Promise<void> {
        e.mesh.matrix.fromArray(e.transform.value);
    }

    

}