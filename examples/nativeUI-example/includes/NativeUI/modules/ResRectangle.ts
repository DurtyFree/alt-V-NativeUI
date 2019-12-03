import game from 'natives';
import Point from "../utils/Point";
import Size from "../utils/Size";
import Rectangle from "./Rectangle";
import Screen from "../utils/Screen";
import Color from '../utils/Color';

export default class ResRectangle extends Rectangle {
    constructor(pos: Point, size: Size, color: Color) {
		super(pos, size, color);
	}

    public Draw(): void;
    public Draw(offset: any): void;
    public Draw(pos: Point | Size, size: Size, color: Color): void;

    public Draw(pos?: Point | Size, size?: Size, color?: Color) {
		if (!pos) pos = new Size();
		if (pos && !size && !color) {
            pos = new Point(this.Pos.X + (pos as Size).Width, this.Pos.Y + (pos as Size).Height);
			size = this.Size;
			color = this.Color;
		}

        const screenw = Screen.Width;
		const screenh = Screen.Height;
		const height = 1080.0;
		const ratio = screenw / screenh;
		const width = height * ratio;

		const w = size.Width / width;
		const h = size.Height / height;
        const x = (pos as Point).X / width + w * 0.5;
        const y = (pos as Point).Y / height + h * 0.5;

        game.drawRect(x, y, w, h, color.R, color.G, color.B, color.A, false);
	}
}
