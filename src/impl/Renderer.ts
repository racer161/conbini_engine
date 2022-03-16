import { ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d";
import * as THREE from "three";
import { BufferGeometry, Material, Matrix4, Mesh } from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton";
import { keys } from "ts-transformer-keys";
import { EditorControls } from "../../example/EditorControls";
import RapierPhysics from "../../include/RapierPhysics";
import { Entity } from "../core/Entity";
import { System } from "../core/System"
import { TransformComponent } from "../primitives/Transform";


export interface GeometryComponent {
    geometry: BufferGeometry;
    mesh: Mesh;
}

export interface MaterialComponent{
    material: Material
}

export interface RenderEntity extends TransformComponent, GeometryComponent, MaterialComponent{}


export class Render<T extends RenderEntity> extends System<T> 
{
    name: string = "Render";

    renderer: THREE.WebGLRenderer;
    three_scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: EditorControls;
    clock: THREE.Clock;

    archetype: string[] = keys<RenderEntity>();

    init_priority: number = 0;
    run_priority: number = 1000000000;

    //TODO: make this respect the entities created and not just harcode this scene
    async init(): Promise<void> {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.three_scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 100000 );

        var self = this;
        window.addEventListener( 'resize', () =>{
            self.onWindowResize();
        }, false );
        document.body.appendChild( VRButton.createButton( this.renderer ) );

        this.renderer.xr.enabled = true;

        this.clock = new THREE.Clock();

        this.controls = new EditorControls( this.camera, this.renderer.domElement );

        this.controls.movementSpeed = 1;
        this.controls.lookSpeed = 0.125;
        this.controls.lookVertical = true;

        const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.three_scene.add( light );

        this.three_scene.background = new THREE.Color( 0xbfd1e5 );

        this.camera.position.set(0, 2, 5);


        //init entities into the threejs scene
        this.scene.entities_x_system.get(this.name).forEach((e : RenderEntity) => {

            e.mesh = new THREE.Mesh(e.geometry, e.material);


            e.mesh.matrixAutoUpdate = false;
            this.three_scene.add(e.mesh);

            e.mesh.matrix = e.transform.asMatrix4();
            e.mesh.updateMatrixWorld(true);
        })

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
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
    }

    async update(e: T): Promise<void> {

        e.mesh.matrix = e.transform.asMatrix4();
        e.mesh.updateMatrixWorld(true);

    }

}