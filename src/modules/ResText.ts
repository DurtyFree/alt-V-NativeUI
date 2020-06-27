import * as alt from 'alt-client';
import Alignment from "../enums/Alignment";
import game from 'natives';
import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import Text from "./Text";
import Screen from "../utils/Screen";

export default class ResText extends Text {
    public TextAlignment: Alignment = Alignment.Left;
    public DropShadow: boolean;
    public Outline: boolean;
    public Wrap: number = 0;

    public get WordWrap() {
        return new Size(this.Wrap, 0);
    }
    public set WordWrap(value) {
        this.Wrap = value.Width;
    }

    constructor(caption: string, pos: Point, scale: number, color?: Color, font?: number, centered?: Alignment) {
        super(caption, pos, scale, color || new Color(255, 255, 255), font || 0, false);
        if (centered) this.TextAlignment = centered;
    }

    public Draw(): void;
    public Draw(offset: Size): void;
    public Draw(caption: Size, pos: Point, scale: number, color: Color, font: string | number, arg2: any): void;

    public Draw(arg1?: any, pos?: Point, scale?: number, color?: Color, font?: string | number, arg2?: any, dropShadow?: boolean, outline?: boolean, wordWrap?: Size) {
        let caption = arg1;
        let centered = arg2;
        let textAlignment = arg2;
        if (!arg1) arg1 = new Size(0, 0);

        if (arg1 && !pos) {
            textAlignment = this.TextAlignment;
            caption = this.Caption;
            pos = new Point(this.Pos.X + arg1.Width, this.Pos.Y + arg1.Height);
            scale = this.Scale;
            color = this.Color;
            font = this.Font;
            if (centered == true || centered == false) {
                centered = this.Centered;
            } else {
                centered = undefined;
                dropShadow = this.DropShadow;
                outline = this.Outline;
                wordWrap = this.WordWrap;
            }
        }

        const screenw = Screen.Width;
        const screenh = Screen.Height;

        const height = 1080.0;
        const ratio = screenw / screenh;
        const width = height * ratio;

        const x = this.Pos.X / width;
        const y = this.Pos.Y / height;

        game.setTextFont(parseInt(font as string));
        game.setTextScale(1.0, scale);
        game.setTextColour(color.R, color.G, color.B, color.A);

        if (centered !== undefined) {
            game.setTextCentre(centered);
        } else {
            if (dropShadow) game.setTextDropshadow(2, 0, 0, 0, 0);

            if (outline) alt.logWarning("[NativeUI] ResText outline not working!");

            switch (textAlignment) {
                case Alignment.Centered:
                    game.setTextCentre(true);
                    break;
                case Alignment.Right:
                    game.setTextRightJustify(true);
                    game.setTextWrap(0.0, x);
                    break;
            }

            if (this.Wrap) {
                const xsize = (this.Pos.X + this.Wrap) / width;
                game.setTextWrap(x, xsize);
            }
        }

        game.beginTextCommandDisplayText("CELL_EMAIL_BCON");
        Text.AddLongString(caption as string);
        game.endTextCommandDisplayText(x, y, 0);
    }
}