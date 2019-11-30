import game from 'natives';
import Color from "../utils/Color";
import Point from "../utils/Point";
import IElement from "./IElement";
import Size from '../utils/Size';

export default class Text extends IElement {
	public caption: string;
	public pos: Point;
	public scale: number;
	public color: Color;
	public font: number;
    public centered: boolean;

	constructor(caption: string, pos: Point, scale: number, color: Color, font: number, centered: boolean) {
		super();
		this.caption = caption;
		this.pos = pos;
		this.scale = scale;
		this.color = color || new Color(255, 255, 255, 255);
		this.font = font || 0;
		this.centered = centered || false;
	}

    Draw(caption: Size, pos: Point, scale: number, color: Color, font: string | number, centered: boolean) {
		if (caption && !pos && !scale && !color && !font && !centered) {
			pos = new Point(this.pos.X + caption.Width, this.pos.Y + caption.Height);
			scale = this.scale;
			color = this.color;
			font = this.font;
			centered = this.centered;
		}
		const x = pos.X / 1280.0;
		const y = pos.Y / 720.0;

        game.setTextFont(parseInt(font as string));
        game.setTextScale(scale, scale);
        game.setTextColour(color.R, color.G, color.B, color.A);
        game.setTextCentre(centered);
        game.beginTextCommandDisplayText("STRING");
        Text.AddLongString(caption as any);
        game.endTextCommandDisplayText(x, y, 0);
    }

    public static AddLongString(str: string) {
        const strLen = 99;
        for (var i = 0; i < str.length; i += strLen) {
            const substr = str.substr(i, Math.min(strLen, str.length - i));
            game.addTextComponentSubstringPlayerName(substr);
        }
    }
}