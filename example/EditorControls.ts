import { Vector3, MathUtils, PerspectiveCamera } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export class EditorControls {

	pointer_controls : PointerLockControls;
	camera : PerspectiveCamera;
	enabled = true;
	movementSpeed = 1.0;
	lookSpeed = 0.005;
	lookVertical = true;
	autoForward = false;
	activeLook = true;
	heightSpeed = false;
	heightCoef = 1.0;
	heightMin = 0.0;
	heightMax = 1.0;
	constrainVertical = false;
	verticalMin = 0;
	verticalMax = Math.PI;

	autoSpeedFactor = 0.0;
	moveForward = false;
	moveBackward = false;
	moveLeft = false;
	moveRight = false;
	moveUp = false;
	moveDown =  false;
	viewHalfX = 0;
	viewHalfY = 0; // private variables

	domElement: HTMLElement;


	constructor(camera: PerspectiveCamera, domElement: HTMLElement) {

		this.camera = camera;
		this.pointer_controls = new PointerLockControls( this.camera, domElement );
		var self = this;
		domElement.addEventListener( 'click', function () {

			self.pointer_controls.lock();

		} );

		this.domElement = domElement; // API

		

		window.addEventListener( 'keydown', this.onKeyDown.bind( this ) );
		window.addEventListener( 'keyup', this.onKeyUp.bind( this ) );

		this.handleResize();

	}

	handleResize() 
	{
		this.viewHalfX = window.innerWidth / 2;
		this.viewHalfY = window.innerHeight / 2;
	}

	onKeyDown(event: KeyboardEvent) {

		switch ( event.code ) {

			case 'ArrowUp':
			case 'KeyW':
				this.moveForward = true;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				this.moveLeft = true;
				break;

			case 'ArrowDown':
			case 'KeyS':
				this.moveBackward = true;
				break;

			case 'ArrowRight':
			case 'KeyD':
				this.moveRight = true;
				break;

			case 'Space':
				this.moveUp = true;
				break;

			case 'LeftShift':
				this.moveDown = true;
				break;

		}

	};

	onKeyUp ( event: KeyboardEvent ) 
	{

		switch ( event.code ) {

			case 'ArrowUp':
			case 'KeyW':
				this.moveForward = false;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				this.moveLeft = false;
				break;

			case 'ArrowDown':
			case 'KeyS':
				this.moveBackward = false;
				break;

			case 'ArrowRight':
			case 'KeyD':
				this.moveRight = false;
				break;

			case 'Space':
				this.moveUp = false;
				break;

			case 'LeftShift':
				this.moveDown = false;
				break;

		}

	};

	dispose()
	{
		window.removeEventListener( 'keydown', this.onKeyDown.bind( this ) );
		window.removeEventListener( 'keyup', this.onKeyUp.bind( this ) );

	};

	update(delta: number)
	{

		if ( this.enabled === false ) return;

		if ( this.heightSpeed ) {

			const y = MathUtils.clamp( this.camera.position.y, this.heightMin, this.heightMax );
			const heightDelta = y - this.heightMin;
			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		const actualMoveSpeed = delta * this.movementSpeed;
		if ( this.moveForward || this.autoForward && ! this.moveBackward ) this.camera.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		if ( this.moveBackward ) this.camera.translateZ( actualMoveSpeed );
		if ( this.moveLeft ) this.camera.translateX( - actualMoveSpeed );
		if ( this.moveRight ) this.camera.translateX( actualMoveSpeed );
		if ( this.moveUp ) this.camera.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.camera.translateY( - actualMoveSpeed );
		let actualLookSpeed = delta * this.lookSpeed;

		if ( ! this.activeLook ) {

			actualLookSpeed = 0;

		}

		let verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

	}

	

}