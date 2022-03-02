import { ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d";
import * as THREE from "three";
import { BufferGeometry, Material, Mesh } from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton";
import { keys } from "ts-transformer-keys";
import { EditorControls } from "../../example/EditorControls";
import RapierPhysics from "../../include/RapierPhysics";
import { Entity } from "../core/Entity";
import { System } from "../core/System"
import { PositionComponent } from "./Transform";



export interface GeometryComponent {
    geometry: BufferGeometry;
    mesh: Mesh;
}

export interface MaterialComponent{
    material: Material
}

interface RenderEntity extends Entity, PositionComponent, GeometryComponent, MaterialComponent{}


export class RenderSystem<T extends RenderEntity> extends System<T> 
{
    beforeUpdate(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    renderer: THREE.WebGLRenderer;
    three_scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: EditorControls;
    clock: THREE.Clock;

    archetype: string[] = keys<RenderEntity>();

    //TODO: make this respect the entities created and not just harcode this scene
    async init(): Promise<void> {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.three_scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 100000 );

        window.addEventListener( 'resize', this.onWindowResize, false );
        document.body.appendChild( VRButton.createButton( this.renderer ) );

        this.renderer.xr.enabled = true;

        this.clock = new THREE.Clock();

        this.controls = new EditorControls( this.camera, this.renderer.domElement );

        this.controls.movementSpeed = 1;
        this.controls.lookSpeed = 0.125;
        this.controls.lookVertical = true;

        this.createFloor();

        const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.three_scene.add( light );

        this.three_scene.background = new THREE.Color( 0xbfd1e5 );

        this.camera.position.z = 1;


        //init entities into the threejs scene
        this.scene.getEntitiesFromArchetype<RenderEntity>(this.archetype).forEach(e => {
            e.mesh = new THREE.Mesh(e.geometry, e.material);
            e.mesh.position.set(e.position[0], e.position[1], e.position[2]);
            this.three_scene.add(e.mesh);
        })

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    createFloor(){
        // floor
        const geometry = new THREE.PlaneGeometry( 10, 10 );
        geometry.rotateX( - Math.PI / 2 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        this.three_scene.add( plane );
    }

    async update(e: T extends Entity & PositionComponent ? any : any): Promise<void> {
       
        //eventually move this to its own system
        this.controls.update( this.clock.getDelta() );

        this.renderer.render( this.three_scene, this.camera );
    }

}