import { Color } from './color.js';
import { Palette } from './palette.js';
import { Picker } from './picker.js';

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
        friction: 0.93    // higher is more slippery
    });

// load font
await new FontFace('Nunito', 'url(media/fonts/nunito.woff2)').load().then(f => {
    document.fonts.add(f);
});

// manage colors
const p = new Palette({app, viewport});

// update viewport on mobile devices and on page load
screen.orientation.addEventListener('change', () => {
    viewport.top = p.bounds.top - 20;
    viewport.left = p.bounds.left - 20;
    viewport.fit(false, p.bounds.right - p.bounds.left + 40, p.bounds.bottom - p.bounds.top + 40);
});
screen.orientation.dispatchEvent(new Event('change'));

// viewport manages clicks in world space
viewport.on('clicked', e => {
    p.click(e.world);
});

// recentering
viewport.on('moved-end', e => {
    console.log(e);
    const rec = document.getElementById('recenter');
    if (
        e.right < p.bounds.left
        || e.left > p.bounds.right
        || e.bottom < p.bounds.top
        || e.top > p.bounds.bottom
        || e.scaled < 0.1
    ) rec.classList.add('show');
    else rec.classList.remove('show');
});

const c = new Picker();

// open help on first start
if (!Cookies.get('firstTime')) {
    Cookies.set('firstTime', 'no');
    document.getElementById('info').togglePopover();
}

// update canvas sizes on resize
window.addEventListener('resize', () => {
    viewport.resize(window.innerWidth, window.innerHeight, viewport.worldWidth, viewport.worldHeight);
    c.canvases().forEach(el => {
        el.width = el.clientWidth;
        el.height = el.clientHeight;
    });
    c.update(true);
    screen.orientation.dispatchEvent(new Event('change'));
});

// tie ranges with value display
document.querySelectorAll('.range input').forEach(el => {
    const counterpart = document.querySelector('[name=' + el.name + 'Val]');
    el.oninput = (e) => counterpart.value = e.target.value;
    counterpart.oninput = (e) => {
        el.value = e.target.value;
        c.update(true);
    };
});

document.getElementById('recenter').addEventListener('click', e => {
    screen.orientation.dispatchEvent(new Event('change'));
});

