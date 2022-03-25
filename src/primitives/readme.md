# Primitives : A memory management strategy

## Creation
All primitives are based around a TypedArray, however to prevent cumbersome and intensive construction of a new binary array each time a primitive is created, js arrays can be used in place as the backing value.

For example, float3
```javascript

export class float3{

    value: Float32Array | [number, number, number]

    constructor(array: Float32Array | [number, number, number]) {
        this.value = array;
    }

    ...
}

```
It accepts either a traditional JS array or a TypedArray. This allows developers an easy API surface using JS Arrays. Later behind the scenes, ConbiniEngine swaps these values out for slices of a contiguous FLoat32Array for fast and efficient processing by the Systems.
