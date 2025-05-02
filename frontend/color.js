export class Color {
    r;
    g;
    b;
    clamped;

    static fromVar(val) {
        return Color.fromHex(getComputedStyle(document.body).getPropertyValue(val));
    }

    static fromHexNum(hex) {
        return new Color({r: (hex >> 16) & 0xff, g: (hex >> 8) & 0xff, b: hex & 0xff});
    }

    static fromHex(hex) {
        return Color.fromHexNum(parseInt(hex.replace('#', ''), 16));
    }

    get hexNum() {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    }
}