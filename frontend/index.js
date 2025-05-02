import { Color } from './color.js';

// initialize Material Design elements
mdc.autoInit();

// Pixi - 2D application canvas
const app = new PIXI.Application({
    background: Color.fromVar('--mdc-theme-surface').hexNum,
    resizeTo: window,
    autoStart: true
});
document.body.appendChild(app.view);

// pixi-viewport - ability to pan and zoom
const viewport = new pixi_viewport.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: window.innerWidth,
    worldHeight: window.innerHeight,
    events: app.renderer.events
});
app.stage.addChild(viewport);

// enable interactions
viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate({
        friction: 0.93  // higher is more slippery
    });

// HELLO WORLD
const text = new PIXI.Text('canvas', {
    fontFamily: 'Arial',
    fontSize: 36,
    fill: 0xffffff,
    align: 'center'
});
text.anchor.set(0.5);
text.x = app.renderer.width / 2;
text.y = app.renderer.height / 2;

viewport.addChild(text);



