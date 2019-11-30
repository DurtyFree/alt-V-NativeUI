export default class Color {
    constructor(r, g, b, a = 255) {
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }
}
Color.Empty = new Color(0, 0, 0, 0);
Color.Transparent = new Color(0, 0, 0, 0);
Color.Black = new Color(0, 0, 0, 255);
Color.White = new Color(255, 255, 255, 255);
Color.WhiteSmoke = new Color(245, 245, 245, 255);
