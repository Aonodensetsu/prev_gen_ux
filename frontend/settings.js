export class Settings {
    constructor(args) {
        this.update(args);
    }

    update({
               grid_height = 168,
               grid_width = 224,
               bar_height = 10,
               name_offset = -10,
               hex_offset = 35,
               hex_offset_nameless = 0,
               desc_offset_x = 15,
               desc_offset_y = 20,
               name_size = 40,
               hex_size = 26,
               hex_size_nameless = 34,
               desc_size = 26,
           }) {
        this.grid_height = grid_height;
        this.grid_width = grid_width;
        this.bar_height = bar_height;
        this.name_offset = name_offset;
        this.hex_offset = hex_offset;
        this.hex_offset_nameless = hex_offset_nameless;
        this.desc_offset_x = desc_offset_x;
        this.desc_offset_y = desc_offset_y;
        this.name_size = name_size;
        this.hex_size = hex_size;
        this.hex_size_nameless = hex_size_nameless;
        this.desc_size = desc_size;
        return this;
    }
}

