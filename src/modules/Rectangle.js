import game from 'natives';
import Point from "../utils/Point";
import Size from "../utils/Size";
import IElement from "./IElement";
export default class Rectangle extends IElement {
    constructor(pos, size, color) {
        super();
        this.Enabled = true;
        this.Pos = pos;
        this.Size = size;
        this.Color = color;
    }
    Draw(pos, size, color) {
        if (!pos)
            pos = new Size(0, 0);
        if (!size && !color) {
            pos = new Point(this.Pos.X + pos.Width, this.Pos.Y + pos.Height);
            size = this.Size;
            color = this.Color;
        }
        const w = size.Width / 1280.0;
        const h = size.Height / 720.0;
        const x = pos.X / 1280.0 + w * 0.5;
        const y = pos.Y / 720.0 + h * 0.5;
        game.drawRect(x, y, w, h, color.R, color.G, color.B, color.A, false);
    }
}
