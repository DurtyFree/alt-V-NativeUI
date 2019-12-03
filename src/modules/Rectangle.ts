import game from 'natives';
import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import IElement from "./IElement";

export default class Rectangle extends IElement {
	public Pos: Point;
	public Size: Size;
    public Color: Color;

	constructor(pos: Point, size: Size, color: Color) {
		super();
		this.Enabled = true;
		this.Pos = pos;
		this.Size = size;
		this.Color = color;
	}

    public Draw(pos: Point | Size, size: Size, color: Color) {
		if (!pos) pos = new Size(0, 0);
		if (!size && !color) {
            pos = new Point(this.Pos.X + (pos as Size).Width, this.Pos.Y + (pos as Size).Height);
			size = this.Size;
			color = this.Color;
		}
		const w = size.Width / 1280.0;
        const h = size.Height / 720.0;
        const x = (pos as Point).X / 1280.0 + w * 0.5;
        const y = (pos as Point).Y / 720.0 + h * 0.5;

        game.drawRect(x, y, w, h, color.R, color.G, color.B, color.A, false);
	}
}
