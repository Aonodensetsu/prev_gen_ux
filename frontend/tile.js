import { Color } from './color.js';

export class Tile {
    static _emptyTex;
    el;
    row;
    column;
    app;
    viewport;
    settings;

    constructor(
        {app, viewport, settings},
        color = null,
    ) {
        this.app = app;
        this.viewport = viewport;
        this.settings = settings;

        this.redrawStatic();
    }

    redrawStatic() {
        const g = new PIXI.Graphics();
        g.lineStyle({
            width: 2,
            color: Color.fromVar('--mdc-button-on-surface').hexNum
        });
        g.lineTo(this.settings.grid_width - 2, 0);
        g.lineTo(this.settings.grid_width - 2, this.settings.grid_height - 3);
        g.lineTo(0, this.settings.grid_height - 3);
        g.lineTo(0, -1);
        g.moveTo(0, 0);
        g.lineTo(this.settings.grid_width - 1, this.settings.grid_height - 3);
        Tile._emptyTex = this.app.renderer.generateTexture(g);
        return this;
    }

    reposition() {
        this.el.position.set(this.column * this.settings.grid_width, this.row * this.settings.grid_height);
        return this;
    }

    redraw() {
        if (this.settings.grid_width != Tile._emptyTex.width || this.settings.grid_height != Tile._emptyTex.height) {
            this.redrawStatic();
        }
        return this.reposition().update(this.color);
    }

    update(color = null) {
        // clean previous draw
        while (this.el.children[0]) this.el.removeChild(this.el.children[0]);

        this.el.texture = Tile._emptyTex;
        return this

    }

    draw({row, column}) {
        const s = new PIXI.Sprite();
        s.position.set(column * this.settings.grid_width, row * this.settings.grid_height);
        this.el = s;
        this.row = row;
        this.column = column;
        this.viewport.addChild(s);
        this.update();
        return this;
    }

    undraw() {
        this.viewport.removeChild(this.el);
        this.el = null;
        this.row = null;
        this.column = null;
        return this;
    }
}

