import { Group, PerspectiveCamera, XRFrame } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { SingletonSystem, System } from "../../core/System";
import { float3 } from "../../primitives";
import { Transform } from "../../primitives/Transform";
import { KeyboardInputSystem } from "../Input/KeyboardInputSystem";
import { Render, RenderEntity } from "../Renderer";

export class EditorControls extends SingletonSystem<Group>
{
    name: string = "EditorControls";

    movement_speed: number = 1;

    keyboard_input_system : KeyboardInputSystem;

    camera: PerspectiveCamera;

    pointer_controls: PointerLockControls;

    async init_system(): Promise<void> {
        this.keyboard_input_system = this.world.system_array.find(s => s instanceof KeyboardInputSystem) as KeyboardInputSystem;
        const render_system = this.world.system_array.find(s => s instanceof Render) as Render<RenderEntity>;
        this.camera = render_system.camera;

        //create a new three group
        this.entity = new Group();
        //put the camera inside
        this.entity.add(render_system.camera);
        //add the group to the scene
        render_system.three_scene.add(this.entity);

        this.pointer_controls = new PointerLockControls( render_system.camera, window.document.body );
		var self = this;

		window.document.body.addEventListener( 'click', function () {

			self.pointer_controls.lock();

		} );
    }
    
    async update(camera_box: Group, delta_time: number, frame?: XRFrame) : Promise<void>
    {
        const a_keydown = this.keyboard_input_system.on_key_down("a") ? 1 : 0;
        const d_keydown = this.keyboard_input_system.on_key_down("d") ? 1 : 0;
        const w_keydown = this.keyboard_input_system.on_key_down("w") ? 1 : 0;
        const s_keydown = this.keyboard_input_system.on_key_down("s") ? 1 : 0;

        const space_keydown = this.keyboard_input_system.on_key_down(" ") ? 1 : 0;
        const control_keydown = this.keyboard_input_system.on_key_down("Control") ? 1 : 0;


        const movement_vec = new float3((d_keydown - a_keydown),space_keydown - control_keydown, s_keydown - w_keydown);
        movement_vec.applyQuaternion(this.camera.quaternion);


        camera_box.translateX(movement_vec.x * this.movement_speed * delta_time);
        camera_box.translateY(movement_vec.y * this.movement_speed * delta_time);
        camera_box.translateZ(movement_vec.z * this.movement_speed * delta_time);
    }
}