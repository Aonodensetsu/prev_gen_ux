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

        if (!Palette._settings) Palette._settings = PIXI.Texture.from('media/png/SettingsIcon.png');
        let settingsBtn = new PIXI.Sprite(Palette._settings);
        settingsBtn.tint = tint;
        settingsBtn.width = 100;
        settingsBtn.height = 100;
        settingsBtn.interactive = true;
        settingsBtn.on('pointerdown', () => this.clickSettings());
        settingsBtn.anchor.set(0, 1);
        settingsBtn.position.set(0, -20);
        viewport.addChild(settingsBtn);
        this.settingsBtn = settingsBtn;

        if (!Palette._info) Palette._info = PIXI.Texture.from('media/png/InfoIcon.png');
        let infoBtn = new PIXI.Sprite(Palette._info);
        infoBtn.tint = tint;
        infoBtn.width = 100;
        infoBtn.height = 100;
        infoBtn.interactive = true;
        infoBtn.on('pointerdown', () => this.showInfo());
        infoBtn.anchor.set(0, 1);
        infoBtn.position.set(0, -140);
        viewport.addChild(infoBtn);
        this.infoBtn = infoBtn;

        if (!Palette._trash) Palette._trash = PIXI.Texture.from('media/png/EraseIcon.png');
        let trashBtn = new PIXI.Sprite(Palette._trash);
        trashBtn.tint = tint;
        trashBtn.width = 100;
        trashBtn.height = 100;
        trashBtn.interactive = true;
        trashBtn.on('pointerdown', () => this.empty());
        trashBtn.anchor.set(0, 1);
        trashBtn.position.set(120, -20);
        viewport.addChild(trashBtn);
        this.trashBtn = trashBtn;

        if (!Palette._reset) Palette._reset = PIXI.Texture.from('media/png/ResetIcon.png');
        let resetBtn = new PIXI.Sprite(Palette._reset);
        resetBtn.tint = tint;
        resetBtn.width = 100;
        resetBtn.height = 100;
        resetBtn.interactive = true;
        resetBtn.on('pointerdown', () => this.defaultTiles());
        resetBtn.anchor.set(0, 1);
        resetBtn.position.set(120, -140);
        viewport.addChild(resetBtn);
        this.resetBtn = resetBtn;

        this.fill({row: 0, column: 0}).defaultTiles();

        document.querySelector('#edittile').addEventListener('submit', (e) => this.editTile(e));
        document.querySelector('#editsettings').addEventListener('submit', (e) => this.editSettings(e));
        document.querySelector('#info').addEventListener('submit', (e) => this.hideInfo(e));
    }

    moveHandles() {
        this.rowPlus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 100);
        this.rowMinus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 220);
        this.colPlus.position.set(this.columns * this.settings.grid_width - 100, this.rows * this.settings.grid_height + 20);
        this.colMinus.position.set(this.columns * this.settings.grid_width - 220, this.rows * this.settings.grid_height + 20);
        return this;
    }

    click({x, y}) {
        const row = Math.floor(y / this.settings.grid_height);
        if (row < 0) return this;
        if (row >= this.rows) return this;
        const column = Math.floor(x / this.settings.grid_width);
        if (column < 0) return this;
        if (column >= this.columns) return this;
        document.querySelector('#edittile [name=cause]').setAttribute('value', `${row},${column}`);
        this.tiles[row][column].click();
        return this;
    }

    editTile(e) {
        e.preventDefault();
        if (e.submitter.value === 'cancel') {
            e.target.hidePopover();
            this.viewport.pause = false;
            return;
        }
        const pos = e.target.cause.value.split(',').map(i => parseInt(i));
        if (e.submitter.value === 'clear') {
            this.tiles[pos[0]][pos[1]].update();
        }
        else if (e.submitter.value === 'edit') {
            const col = Color.fromOklch({L: e.target.lightness.value, C: e.target.chroma.value, h: e.target.hue.value});
            this.tiles[pos[0]][pos[1]].update(col, {name: e.target.name.value, desc_left: e.target.desc_left.value, desc_right: e.target.desc_right.value});
        }
        e.target.hidePopover();
        this.viewport.pause = false;
        return this;
    }

    clickSettings() {
        function t(e) { return e.parentElement.MDCTextField; }
        function s(e) { return e.MDCSwitch; }
        const form = document.querySelector('#editsettings');
        t(form.grid_height).value = this.settings.grid_height;
        t(form.grid_width).value = this.settings.grid_width;
        t(form.bar_height).value = this.settings.bar_height;
        t(form.name_offset).value = this.settings.name_offset;
        t(form.hex_offset).value = this.settings.hex_offset;
        t(form.hex_offset_nameless).value = this.settings.hex_offset_nameless;
        t(form.desc_offset_x).value = this.settings.desc_offset_x;
        t(form.desc_offset_y).value = this.settings.desc_offset_y;
        t(form.name_size).value = this.settings.name_size;
        t(form.hex_size).value = this.settings.hex_size;
        t(form.hex_size_nameless).value = this.settings.hex_size_nameless;
        t(form.desc_size).value = this.settings.desc_size;
        s(form.show_hash).selected = this.settings.show_hash;
        s(form.hex_upper).selected = this.settings.hex_upper;
        form.showPopover();
        this.viewport.pause = true;
        return this;
    }

    editSettings(e) {
        e.preventDefault();
        if (e.submitter.value === 'cancel') {
            e.target.hidePopover();
            this.viewport.pause = false;
            return;
        }
        const form = e.target;
        this.settings.grid_height = parseInt(form.grid_height.value);
        this.settings.grid_width = parseInt(form.grid_width.value);
        this.settings.bar_height = parseInt(form.bar_height.value);
        this.settings.name_offset = parseInt(form.name_offset.value);
        this.settings.hex_offset = parseInt(form.hex_offset.value);
        this.settings.hex_offset_nameless = parseInt(form.hex_offset_nameless.value);
        this.settings.desc_offset_x = parseInt(form.desc_offset_x.value);
        this.settings.desc_offset_y = parseInt(form.desc_offset_y.value);
        this.settings.name_size = parseInt(form.name_size.value);
        this.settings.hex_size = parseInt(form.hex_size.value);
        this.settings.hex_size_nameless = parseInt(form.hex_size_nameless.value);
        this.settings.desc_size = parseInt(form.desc_size.value);
        this.settings.show_hash = form.show_hash.MDCSwitch.selected;
        this.settings.hex_upper = form.hex_upper.MDCSwitch.selected;
        this.redraw();
        form.hidePopover();
        this.viewport.pause = false;
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

    empty() {
        while (this.rows > 1) this.deleteRow();
        while (this.columns > 1) this.deleteColumn();
        return this.fill({row: 0, column: 0});
    }

    defaultTiles() {
        while (this.rows > 4) this.deleteRow();
        while (this.columns > 8) this.deleteColumn();
        this.settings.update({});
        this.tiles.forEach(r => r.forEach(t => t.reposition()));
        return this.fill({row: 0, column: 0}, Color.fromHex('282828'), {name: 'bg', desc_left: '235', desc_right: '0'})
            .fill({row: 0, column: 1}, Color.fromHex('cc241d'), {name: 'red', desc_left: '124', desc_right: '1'})
            .fill({row: 0, column: 2}, Color.fromHex('98971a'), {name: 'green', desc_left: '106', desc_right: '2'})
            .fill({row: 0, column: 3}, Color.fromHex('d79921'), {name: 'yellow', desc_left: '172', desc_right: '3'})
            .fill({row: 0, column: 4}, Color.fromHex('458588'), {name: 'blue', desc_left: '66', desc_right: '4'})
            .fill({row: 0, column: 5}, Color.fromHex('b16286'), {name: 'purple', desc_left: '132', desc_right: '5'})
            .fill({row: 0, column: 6}, Color.fromHex('689d6a'), {name: 'aqua', desc_left: '72', desc_right: '6'})
            .fill({row: 0, column: 7}, Color.fromHex('a89984'), {name: 'gray', desc_left: '246', desc_right: '7'})
            .fill({row: 1, column: 0}, Color.fromHex('928374'), {name: 'gray', desc_left: '245', desc_right: '8'})
            .fill({row: 1, column: 1}, Color.fromHex('fb4934'), {name: 'red', desc_left: '167', desc_right: '9'})
            .fill({row: 1, column: 2}, Color.fromHex('b8bb26'), {name: 'green', desc_left: '142', desc_right: '10'})
            .fill({row: 1, column: 3}, Color.fromHex('fabd2f'), {name: 'yellow', desc_left: '214', desc_right: '11'})
            .fill({row: 1, column: 4}, Color.fromHex('83a598'), {name: 'blue', desc_left: '109', desc_right: '12'})
            .fill({row: 1, column: 5}, Color.fromHex('d3869b'), {name: 'purple', desc_left: '175', desc_right: '13'})
            .fill({row: 1, column: 6}, Color.fromHex('8ec07c'), {name: 'aqua', desc_left: '108', desc_right: '14'})
            .fill({row: 1, column: 7}, Color.fromHex('ebdbb2'), {name: 'fg', desc_left: '223', desc_right: '15'})
            .fill({row: 2, column: 0}, Color.fromHex('1d2021'), {name: 'bg0_h', desc_left: '234', desc_right: '0'})
            .fill({row: 2, column: 1}, Color.fromHex('282828'), {name: 'bg0', desc_left: '235', desc_right: '0'})
            .fill({row: 2, column: 2}, Color.fromHex('3c3836'), {name: 'bg1', desc_left: '237', desc_right: '-'})
            .fill({row: 2, column: 3}, Color.fromHex('504945'), {name: 'bg2', desc_left: '239', desc_right: '-'})
            .fill({row: 2, column: 4}, Color.fromHex('665c54'), {name: 'bg3', desc_left: '241', desc_right: '-'})
            .fill({row: 2, column: 5}, Color.fromHex('7c6f64'), {name: 'bg4', desc_left: '243', desc_right: '-'})
            .fill({row: 2, column: 6}, Color.fromHex('928374'), {name: 'gray', desc_left: '245', desc_right: '-'})
            .fill({row: 2, column: 7}, Color.fromHex('d65d0e'), {name: 'orange', desc_left: '166', desc_right: '-'})
            .fill({row: 3, column: 0})
            .fill({row: 3, column: 1}, Color.fromHex('32302f'), {name: 'bg0_s', desc_left: '236', desc_right: '0'})
            .fill({row: 3, column: 2}, Color.fromHex('a89984'), {name: 'fg4', desc_left: '246', desc_right: '7'})
            .fill({row: 3, column: 3}, Color.fromHex('bdae93'), {name: 'fg3', desc_left: '248', desc_right: '-'})
            .fill({row: 3, column: 4}, Color.fromHex('d5c4a1'), {name: 'fg2', desc_left: '250', desc_right: '-'})
            .fill({row: 3, column: 5}, Color.fromHex('ebdbb2'), {name: 'fg1', desc_left: '223', desc_right: '15'})
            .fill({row: 3, column: 6}, Color.fromHex('fbf1c7'), {name: 'fg0', desc_left: '229', desc_right: '-'})
            .fill({row: 3, column: 7}, Color.fromHex('fe8019'), {name: 'orange', desc_left: '208', desc_right: '-'})
            .moveHandles();
    }

    showInfo() {
        this.viewport.pause = true;
        document.querySelector('#info').showPopover();
    }

    hideInfo(e) {
        e.preventDefault();
        e.target.hidePopover();
        this.viewport.pause = false;
    }
}

