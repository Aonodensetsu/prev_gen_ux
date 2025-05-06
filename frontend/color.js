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

    static linearToGamma(c) {
        return c >= 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
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

    static fromOklab({L, a, b}) {
        const l = (L + a * +0.3963377774 + b * +0.2158037573) ** 3;
        const m = (L + a * -0.1055613458 + b * -0.0638541728) ** 3;
        const s = (L + a * -0.0894841775 + b * -1.2914855480) ** 3;
        return new Color({
            r: Color.linearToGamma(l * +4.0767416621 + m * -3.3077115913 + s * +0.2309699292) * 255,
            g: Color.linearToGamma(l * -1.2684380046 + m * +2.6097574011 + s * -0.3413193965) * 255,
            b: Color.linearToGamma(l * -0.0041960863 + m * -0.7034186147 + s * +1.7076147010) * 255
        });
    }

    static fromHex(hex) {
        return Color.fromHexNum(parseInt(hex.replace('#', ''), 16));
    }

    static fromOklch({L, C, h}) {
        return Color.fromOklab({L: L / 100, a: C * Math.cos(h * Math.PI / 180), b: C * Math.sin(h * Math.PI / 180)});
    }
    static fromVar(val) {
        return Color.fromHex(getComputedStyle(document.body).getPropertyValue(val));
    }

    get hexNum() {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    }

    get hex() {
        return '#' + this.hexNum.toString(16);
    }

    get barColor() {
        const {L, a, b} = this.oklab;
        return Color.fromOklab({L: L * 0.9, a, b});
    }

    get textColor() {
        const {L, a, b} = this.oklab;
        const Ln = L <= 0.483 ? L * 0.9 + 0.3 : L * 0.75 - 0.15;
        return Color.fromOklab({L: Ln, a, b});
    }

    get oklab() {
        const r = Color.gammaToLinear(this.r / 255);
        const g = Color.gammaToLinear(this.g / 255);
        const b = Color.gammaToLinear(this.b / 255);
        const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
        const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
        const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
        return {
            L: l * +0.2104542553 + m * +0.7936177850 + s * -0.0040720468,
            a: l * +1.9779984951 + m * -2.4285922050 + s * +0.4505937099,
            b: l * +0.0259040371 + m * +0.7827717662 + s * -0.8086757660
        };
    }

    get oklch() {
        const {L, a, b} = this.oklab;
        return {
            L: L * 100,
            C: Math.sqrt(a * a + b * b),
            h: (Math.atan2(b, a) * 180 / Math.PI % 360 + 360) % 360
        };
    }
}

