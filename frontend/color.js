export class Color {
    r;
    g;
    b;
    clamped;

    // static fromRGB
    constructor({r, g, b}) {
        this.r = Color.clamp(r, 0, 255);
        this.g = Color.clamp(g, 0, 255);
        this.b = Color.clamp(b, 0, 255);
        this.clamped = r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0;
    }

    static clamp(v, min, max) {
        return Math.max(Math.min(v, max), min);
    }

    static gammaToLinear(c) {
        return c >= 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
    }

    static fromHexNum(hex) {
        return new Color({r: (hex >> 16) & 0xff, g: (hex >> 8) & 0xff, b: hex & 0xff});
    }

    static fromHex(hex) {
        return Color.fromHexNum(parseInt(hex.replace('#', ''), 16));
    }

    static fromVar(val) {
        return Color.fromHex(getComputedStyle(document.body).getPropertyValue(val));
    }

    get hexNum() {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    }
}

