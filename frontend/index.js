import { Color } from './color.js';
import { Palette } from './palette.js';

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

// load font
await new FontFace('Nunito', 'url(fonts/nunito.woff2)').load().then(f => {
    document.fonts.add(f);
});

// manage colors
const p = new Palette({app, viewport});




