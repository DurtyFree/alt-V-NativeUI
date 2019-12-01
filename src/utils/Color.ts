export default class Color {
	public static Empty = new Color(0, 0, 0, 0);
	public static Transparent = new Color(0, 0, 0, 0);
	public static Black = new Color(0, 0, 0, 255);
	public static White = new Color(255, 255, 255, 255);
	public static WhiteSmoke = new Color(245, 245, 245, 255);

	public R: number;
	public G: number;
	public B: number;
    public A: number;

    constructor(r: number, g: number, b: number, a = 255) {
		this.R = r;
		this.G = g;
		this.B = b;
		this.A = a;
	}
}
