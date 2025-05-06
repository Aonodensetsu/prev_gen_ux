import { Settings } from './settings.js';
import { Tile } from './tile.js';
import { Color } from './color.js';

export class Palette {
    // singleton
    static _self;
    // static textures
    static _minus;
    static _plus;

    // buttons
    colPlus;
    colMinus;
    rowPlus;
    rowMinus;

    // attributes
    tiles = [[]]; // 2d list of tiles, rows indexed first
    rows = 1;
    columns = 1;

    constructor({app, viewport, settings = new Settings({})}) {
        if (Palette._self) return Palette._self;
        Palette._self = this;

        const tint = Color.fromVar('--mdc-button-on-surface').hexNum;

        this.app = app;
        this.viewport = viewport;
        this.settings = settings;

        if (!Palette._plus) Palette._plus = PIXI.Texture.from('media/png/plusIcon.png');
        let colPlus = new PIXI.Sprite(Palette._plus);
        colPlus.width = 100;
        colPlus.height = 100;
        colPlus.tint = tint;
        colPlus.interactive = true;
        colPlus.on('pointerdown', () => this.addColumn());
        viewport.addChild(colPlus);
        this.colPlus = colPlus;

        let rowPlus = new PIXI.Sprite(Palette._plus);
        rowPlus.tint = tint;
        rowPlus.width = 100;
        rowPlus.height = 100;
        rowPlus.interactive = true;
        rowPlus.on('pointerdown', () => this.addRow());
        viewport.addChild(rowPlus);
        this.rowPlus = rowPlus;

        if (!Palette._minus) Palette._minus = PIXI.Texture.from('media/png/MinusIcon.png');
        let colMinus = new PIXI.Sprite(Palette._minus);
        colMinus.width = 100;
        colMinus.height = 100;
        colMinus.tint = tint;
        colMinus.interactive = true;
        colMinus.on('pointerdown', () => this.deleteColumn());
        viewport.addChild(colMinus);
        this.colMinus = colMinus;

        let rowMinus = new PIXI.Sprite(Palette._minus);
        rowMinus.tint = tint;
        rowMinus.width = 100;
        rowMinus.height = 100;
        rowMinus.interactive = true;
        rowMinus.on('pointerdown', () => this.deleteRow());
        viewport.addChild(rowMinus);
        this.rowMinus = rowMinus;

        this.fill({row: 0, column: 0}).defaultTiles();
    }

    moveHandles() {
        this.rowPlus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 100);
        this.rowMinus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 220);
        this.colPlus.position.set(this.columns * this.settings.grid_width - 100, this.rows * this.settings.grid_height + 20);
        this.colMinus.position.set(this.columns * this.settings.grid_width - 220, this.rows * this.settings.grid_height + 20);
        return this;
    }

    addColumn() {
        if (this.columns == 1) {
            this.colMinus.visible = true;
        }
        this.columns += 1;
        this.tiles.forEach((row, i) => {
            this.fill({row: i, column: this.columns - 1});
        });
        return this.moveHandles();
    }

    deleteColumn() {
        if (this.columns <= 1) return this;
        this.tiles.forEach(row => row.pop().undraw());
        this.columns -= 1;
        if (this.columns == 1) {
            this.colMinus.visible = false;
        }
        return this.moveHandles();
    }

    addRow() {
        if (this.rows == 1) {
            this.rowMinus.visible = true;
        }
        this.tiles.push([]);
        this.rows += 1;
        for (let i = 0; i < this.columns; i++) {
            this.fill({row: this.rows - 1, column: i});
        }
        return this.moveHandles();
    }

    deleteRow() {
        if (this.rows <= 1) return this;
        this.rows -= 1;
        if (this.rows == 1) {
            this.rowMinus.visible = false;
        }
        this.tiles.pop().forEach(tile => tile.undraw());
        return this.moveHandles();
    }

    fill({row, column}, color = null, {name, desc_left, desc_right} = {name: '', desc_left: '', desc_right: ''}) {
        while (this.columns <= column) this.addColumn();
        while (this.rows <= row) this.addRow();
        if (this.tiles[row][column]) this.tiles[row][column].update(color, {name, desc_left, desc_right});
        // this case will only happen inside addColumn/addRow, it's here to collapse the recursive calls
        else this.tiles[row][column] = new Tile({app: this.app, viewport: this.viewport, settings: this.settings}, color, {name, desc_left, desc_right}).draw({row, column});
        return this;
    }

    redraw() {
        this.tiles.forEach(row => {
            row.forEach(tile => {
                tile.redraw();
            });
        })
        return this.moveHandles();
    }

    defaultTiles() {
        while (this.rows > 4) this.deleteRow();
        while (this.columns > 8) this.deleteColumn();
        this.settings.update({});
        this.tiles.forEach(r => r.forEach(t => t.reposition()));
        return this.fill({row: 0, column: 0})
            .fill({row: 0, column: 1})
            .fill({row: 0, column: 2})
            .fill({row: 0, column: 3})
            .fill({row: 0, column: 4})
            .fill({row: 0, column: 5})
            .fill({row: 0, column: 6})
            .fill({row: 0, column: 7})
            .fill({row: 1, column: 0})
            .fill({row: 1, column: 1})
            .fill({row: 1, column: 2})
            .fill({row: 1, column: 3})
            .fill({row: 1, column: 4})
            .fill({row: 1, column: 5})
            .fill({row: 1, column: 6})
            .fill({row: 1, column: 7})
            .fill({row: 2, column: 0})
            .fill({row: 2, column: 1})
            .fill({row: 2, column: 2})
            .fill({row: 2, column: 3})
            .fill({row: 2, column: 4})
            .fill({row: 2, column: 5})
            .fill({row: 2, column: 6})
            .fill({row: 2, column: 7})
            .fill({row: 3, column: 0})
            .fill({row: 3, column: 1})
            .fill({row: 3, column: 2})
            .fill({row: 3, column: 3})
            .fill({row: 3, column: 4})
            .fill({row: 3, column: 5})
            .fill({row: 3, column: 6})
            .fill({row: 3, column: 7})
            .moveHandles();
    }
}

