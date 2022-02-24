declare global {
    namespace JSX{
        export interface IntrinsicElements{
            entity: {
                id?: string;
                name?: string;
                [property: string]: any;
            },
            root: {
                enable_xr : boolean;
            }
            [tagName: string]: any;
        }
    }
}

export function h(tag: any, props: any, ...children: any[]){
	console.log(tag, props, children);
}