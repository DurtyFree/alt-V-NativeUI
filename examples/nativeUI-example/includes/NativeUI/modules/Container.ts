import game from 'natives';
import Size from "../utils/Size";
import Rectangle from "./Rectangle";
import Screen from "../utils/Screen";
import Point from '../utils/Point';
import Color from '../utils/Color';

export default class Container extends Rectangle {
    public Items: any[];

    constructor(pos: Point, size: Size, color: Color) {
        super(pos, size, color);
        this.Items = [];
    }

    addItem(item: any) {
        this.Items.push(item);
    }

    Draw(offset?: Size) {
        if (!this.Enabled) return;
        offset = offset || new Size();
        const screenw = Screen.Width;
        const screenh = Screen.Height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        const width = height * ratio;

        const w = this.Size.Width / width;
        const h = this.Size.Height / height;
        const x = (this.Pos.X + offset.Width) / width + w * 0.5;
        const y = (this.Pos.Y + offset.Height) / height + h * 0.5;

        game.drawRect(x, y, w, h, this.Color.R, this.Color.G, this.Color.B, this.Color.A, false);

        for (var item of this.Items)
            item.Draw(new Size(this.Pos.X + offset.Width, this.Pos.Y + offset.Height));
    }
}
