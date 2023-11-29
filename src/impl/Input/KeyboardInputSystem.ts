import { XRFrame } from "three";
import { SingletonSystem } from "../../core/System";

export class KeyboardInputSystem extends SingletonSystem<Window> {
    name: string = "KeyboardInput";

    is_key_down: Set<string> = new Set();

    async init_system(): Promise<void> {
        window.addEventListener( 'keydown', this.handle_keyboard_event.bind( this ) );
		window.addEventListener( 'keyup', this.handle_keyboard_event.bind( this ) );
    }

    handle_keyboard_event(event: KeyboardEvent) {
        //if the key is down add it to the set
        if (event.type === "keydown") this.is_key_down.add(event.key);
        //if the key is up remove it from the set
        else if (event.type === "keyup") this.is_key_down.delete(event.key);

        //console.log(this.is_key_down);
    }

    on_key_down(key: string): boolean {
        return this.is_key_down.has(key);
    }

    on_key_up(key: string)
    {
        return !this.is_key_down.has(key);
    }

}