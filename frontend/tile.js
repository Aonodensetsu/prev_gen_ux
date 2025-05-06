import { Color } from './color.js';

export class Tile {
    static _emptyTex;
    el;
    row;
    column;
    app;
    viewport;
    settings;
    color;
    name;
    desc_left;
    desc_right;

    constructor(
        {app, viewport, settings},
        color = null,
        {name, desc_left, desc_right} = {name: '', desc_left: '', desc_right: ''}
    ) {
        this.app = app;
        this.viewport = viewport;
        this.settings = settings;
        this.color = color;
        this.name = name;
        this.desc_left = desc_left;
        this.desc_right = desc_right;

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
        return this.reposition().update(this.color, {name: this.name, desc_left: this.desc_left, desc_right: this.desc_right});
    }

    update(color = null, {name, desc_left, desc_right} = {name: '', desc_left: '', desc_right: ''}) {
        // set new variables
        this.color = color;
        this.name = name;
        this.desc_left = desc_left;
        this.desc_right = desc_right;
        // clean previous draw
        while (this.el.children[0]) this.el.removeChild(this.el.children[0]);
        // empty tile case
        if (!this.color) {
            this.el.texture = Tile._emptyTex;
            return this
        }
        // filled tile case
        const g = new PIXI.Graphics();
        // main bg
        g.beginFill(this.color.hexNum);
        g.drawRect(0, 0, this.settings.grid_width, this.settings.grid_height - this.settings.bar_height);
        // darker bar
        g.beginFill(this.color.barColor.hexNum);
        g.drawRect(0, this.settings.grid_height - this.settings.bar_height, this.settings.grid_width, this.settings.bar_height);
        g.endFill();
        const t = this.app.renderer.generateTexture(g);
        this.el.texture = t;
        // name
        if (this.name) {
            // name itself
            const n = new PIXI.Text(this.name, {
                fontFamily: 'Nunito',
                fontSize: this.settings.name_size,
                fontWeight: 500,
                fill: this.color.textColor.hexNum,
                align: 'center'
            });
            n.anchor.set(0.5, 0.5);
            n.x = this.settings.grid_width / 2;
            n.y = this.settings.grid_height / 2 + this.settings.name_offset;
            n.updateText();
            this.el.addChild(n);
            // hex under name
            let hc = this.color.hex.padStart(6, '0');
            const h = new PIXI.Text(hc, {
                fontFamily: 'Nunito',
                fontSize: this.settings.hex_size,
                fontWeight: 500,
                fill: this.color.textColor.hexNum,
                align: 'center'
            });
            h.anchor.set(0.5, 0.5);
            h.x = this.settings.grid_width / 2;
            h.y = this.settings.grid_height / 2 + this.settings.hex_offset;
            h.updateText();
            this.el.addChild(h);
        } else {
            // hex with no name
            let hc = this.color.hex.padStart(6, '0');
            const h = new PIXI.Text(hc, {
                fontFamily: 'Nunito',
                fontSize: this.settings.hex_size_nameless,
                fontWeight: 500,
                fill: this.color.textColor.hexNum,
                align: 'center'
            });
            h.anchor.set(0.5, 0.5);
            h.x = this.settings.grid_width / 2;
            h.y = this.settings.grid_height / 2 + this.settings.hex_offset_nameless;
            h.updateText();
            this.el.addChild(h);
        }
        // description right
        if (this.desc_right) {
            const r = new PIXI.Text(this.desc_right, {
                fontFamily: 'Nunito',
                fontSize: this.settings.desc_size,
                fontWeight: 500,
                fill: this.color.textColor.hexNum,
                align: 'center'
            });
            r.anchor.set(1, 0);
            r.x = this.settings.grid_width - this.settings.desc_offset_x;
            r.y = this.settings.desc_offset_y;
            r.updateText();
            this.el.addChild(r);
        }
        // description left
        if (this.desc_left) {
            const r = new PIXI.Text(this.desc_left, {
                fontFamily: 'Nunito',
                fontSize: this.settings.desc_size,
                fontWeight: 500,
                fill: this.color.textColor.hexNum,
                align: 'center'
            });
            r.x = this.settings.desc_offset_x;
            r.y = this.settings.desc_offset_y;
            r.updateText();
            this.el.addChild(r);
        }
        return this;
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

