export class Settings {
    constructor(args) {
        this.update(args);
    }

    update({
               grid_height = 168,
               grid_width = 224,

           }) {
        this.grid_height = grid_height;
        this.grid_width = grid_width;

        return this;
    }
}

