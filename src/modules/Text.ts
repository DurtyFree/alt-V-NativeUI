import game from 'natives';
import Color from "../utils/Color";
import Point from "../utils/Point";
import IElement from "./IElement";
import Size from '../utils/Size';

export default class Text extends IElement {
    public Caption: string;
    public Pos: Point;
    public Scale: number;
    public Color: Color;
    public Font: number;
    public Centered: boolean;

    constructor(caption: string, pos: Point, scale: number, color: Color, font: number, centered: boolean) {
        super();
        this.Caption = caption;
        this.Pos = pos;
        this.Scale = scale;
        this.Color = color || new Color(255, 255, 255, 255);
        this.Font = font || 0;
        this.Centered = centered || false;
    }

    public Draw(caption: Size, pos: Point, scale: number, color: Color, font: string | number, centered: boolean) {
        if (caption && !pos && !scale && !color && !font && !centered) {
            pos = new Point(this.Pos.X + caption.Width, this.Pos.Y + caption.Height);
            scale = this.Scale;
            color = this.Color;
            font = this.Font;
            centered = this.Centered;
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

    public static AddLongString(text: string) {
        if (!text.length)
            return;

        const maxStringLength = 99;

        for (let i = 0, position; i < text.length; i += maxStringLength) {
            let currentText = text.substr(i, i + maxStringLength);
            let currentIndex = i;
            if ((currentText.match(/~/g) || []).length % 2 !== 0) {
                position = currentText.lastIndexOf('~');
                //if(position > 0 && currentText[position - 1] === ' ') { // Doesn't the substring auto add a space?
                //	position--;
                //}
                i -= (maxStringLength - position);
            } else {
                position = Math.min(maxStringLength, text.length - currentIndex);
            }
            game.addTextComponentSubstringPlayerName(text.substr(currentIndex, position));
        }
    }
}

export {
    Text
}
