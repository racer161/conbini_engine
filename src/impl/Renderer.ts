import * as THREE from "three";
import { ACESFilmicToneMapping, Mesh, PMREMGenerator, ReinhardToneMapping, sRGBEncoding } from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton";
import { keys } from "ts-transformer-keys";
import { System } from "../core/System"
import { TransformComponent } from "./Transformation";


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
    xr_camera: THREE.PerspectiveCamera;

    //controls: EditorControls;
    clock: THREE.Clock;

    archetype: string[] = keys<RenderEntity>();

    run_priority: number = 1000000001;

    
    async init_system(): Promise<void> {
        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = sRGBEncoding;
        renderer.physicallyCorrectLights = true;
        renderer.toneMapping = ReinhardToneMapping;
        renderer.toneMappingExposure = 1;

        this.renderer = renderer;

        this.three_scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 100000 );

        var self = this;
        window.addEventListener( 'resize', () =>{
            self.onWindowResize();
        }, false );
        document.body.appendChild( VRButton.createButton( this.renderer ) );


        this.renderer.xr.enabled = true;

        const light = new THREE.AmbientLight(0xA3A3A3); // soft white light
        this.three_scene.add(light);

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 0, 1, 0 );
        this.three_scene.add( directionalLight );

        this.camera.position.set(0, 2, 5);
        this.renderer.setClearColor(0x404040,1);

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }

    async init_entity(e: RenderEntity): Promise<void> {
        e.mesh.matrixAutoUpdate = false;
        e.mesh.matrix.fromArray(e.transform);

        this.three_scene.add(e.mesh);
        this.three_scene.updateMatrixWorld(true);
        
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    async beforeUpdate(): Promise<void> {
        this.renderer.render( this.three_scene, this.camera );
        //this.three_scene.updateMatrixWorld(true);
    }

    async update(e: T & {name : string }): Promise<void> {
        e.mesh.matrix.fromArray(e.transform);
    }

    

}