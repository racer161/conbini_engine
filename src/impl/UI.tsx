import { tail } from 'lodash';
import * as rasterizeHTML from 'rasterizehtml';
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as ReactDOMServer from 'react-dom/server';
import { tailwind_uri } from './Tailwind';
import ReactTestUtils from 'react-dom/test-utils'; // ES6

//<link href="${tailwind_uri}" rel="stylesheet">
const render_template = (content: string) => `
<html>
    <link href="output.css" rel="stylesheet">
    ${content}
</html>`;

export async function drawJSXToCanvas(element : JSX.Element, canvas : HTMLCanvasElement, backingScale :number)
{
    const start = performance.now();
    
    const str = ReactDOMServer.renderToString(element);
    console.log(str)
    const dpi_scale = backingScale;

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    
    await rasterizeHTML.drawHTML(render_template(str), canvas, {
        zoom: dpi_scale,
        executeJs: false,
    });

    const end = performance.now();

    return end - start;
}

function backingScale() {
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        return window.devicePixelRatio;
    }
    return 1;
}

function scaleCanvasForRetina(canvas : HTMLCanvasElement, width? : number, height? : number, scale : number = backingScale()) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
  
    canvas.width = width * scale;
    canvas.height = height * scale;
}

function getMousePosition(canvas : HTMLCanvasElement, event : MouseEvent){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return {x: x, y: y};
}

export class ConbiniUIDocument
{
    //TODO: create a hidden document and use that to render the UI too
    //simulate mouse events
    //on update rasterizeHTML.drawDocument
    backingScale: number;
    document: Document;
    canvas: HTMLCanvasElement;
    root_element: HTMLElement;
    context_2d: CanvasRenderingContext2D;
    constructor(ui_element : JSX.Element, width : number, height : number)
    {
        this.backingScale = backingScale();
        this.root_element = document.createElement("div");
        this.root_element.style.width = width + "px";
        this.root_element.style.height = height + "px";

        

        document.body.appendChild(this.root_element);

        const react_root = ReactDOM.createRoot(this.root_element);
        react_root.render(ui_element);

        this.canvas = document.createElement("canvas");
        scaleCanvasForRetina(this.canvas, width, height);

        this.context_2d = this.canvas.getContext("2d");

        document.body.appendChild(this.canvas);
        this.draw();

        var self = this;

        const observer = new MutationObserver(function(mutationsList, observer) {
            self.draw();
        });

        this.canvas.addEventListener("mousedown", function(event) {
            const pos = getMousePosition(self.canvas, event);
            console.log("mousedown canvas", pos);

            const clicked_element = document.elementFromPoint(pos.x, pos.y);
            ReactTestUtils.Simulate.click(clicked_element);
            self.draw();

            //TODO: add hover event manually in rasterizeHTML
        });

        

        this.root_element.addEventListener("mousedown", function(event) {
            console.log("mousedown root", { x :  event.clientX, y : event.clientY });
        });

        observer.observe(this.root_element, {characterData: true, childList: true, attributes: false})
    }

    async draw()
    {
        const start = performance.now();

        this.context_2d.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const dpi_scale = this.backingScale;

        const html_string = render_template(this.root_element.innerHTML);

        const result = await rasterizeHTML.drawHTML(html_string, this.canvas, {
            zoom: dpi_scale,
            executeJs: false
        });
        const end = performance.now();
        console.log(`Rasterized in ${end - start}ms`);
    }
    
}