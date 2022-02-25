import { IPrimitive, TypedArray } from "../../primitives";

//Component Array is a hash map over the underlying ArrayBuffer | SharedArrayBuffer
//It maps the entity ID to the TypedArray data (which is itself an accessible/usable pointer to the underlying ArrayBuffer)
export abstract class ComponentArray<T extends TypedArray & IPrimitive>
{
    //this hack allows for the inheritance of the IPrimitive vector-like type definitions
    //and the IPrimitive interface requirement ensures that these values exist on the object at runtime
    private ELEMENT_COUNT : number;
    private BYTES_PER_ELEMENT : number;


    //A map given the ID of the entity get the TypedArray (subarray) of the component in the _data array
    private map: Map<string, number>;
    private buffer: SharedArrayBuffer;
    private accessor : T;
    readonly capacity: number;
    private length: number;

    private data: ArrayBuffer;
    
    get(id : string) : T
    {
        const offset = this.map.get(id) * this.ELEMENT_COUNT;
        //TODO: Type Check this. think harder lol
        return this.accessor.subarray(offset, offset + this.ELEMENT_COUNT) as T;
    }

    set(id : string, data : T | number[]) : void
    {
        if(!this.map.has(id)) throw new Error(`Entity ${id} does not exist in the ComponentArray`); 
        const offset = this.map.get(id) * this.ELEMENT_COUNT;
        this.accessor.set(data, offset);
    }

    push(id : string, value : number[]) : void {
        if(this.map.has(id)) throw new Error(`Entity ${id} already exists in the ComponentArray`);
        if(this.length >= this.capacity) throw new Error(`ComponentArray is full`);
        
        this.map.set(id, this.length);
        this.accessor.set(value, this.length * this.ELEMENT_COUNT);
        this.length += 1;
    }

    constructor(capacity : number, type : T) {
        this.ELEMENT_COUNT = type.ELEMENT_COUNT;
        this.BYTES_PER_ELEMENT = type.BYTES_PER_ELEMENT;

        this.capacity = capacity;
        this.length = 0;
        this.buffer = new SharedArrayBuffer(capacity * type.BYTES_PER_ELEMENT * type.ELEMENT_COUNT);
        this.accessor = type.constructor(this.buffer) as T;
        this.map = new Map<string, number>();
    }

}