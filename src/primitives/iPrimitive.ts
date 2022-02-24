export type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;


export interface IPrimitive extends ArrayLike<number>{
    ELEMENT_COUNT: number;
    BYTES_PER_ELEMENT: number;
}