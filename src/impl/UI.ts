import { tail } from 'lodash';
import * as rasterizeHTML from 'rasterizehtml';
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as ReactDOMServer from 'react-dom/server';
import { tailwind_uri } from './Tailwind';

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
    const dpi_scale = backingScale;

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    
    await rasterizeHTML.drawHTML(render_template(str), canvas, {
        zoom: dpi_scale,
        executeJs: false
    });
    
    const end = performance.now();

    return end - start;
}
