import Alignment from "../enums/Alignment.js";
import Color from "../utils/Color.js";
import Point from "../utils/Point.js";
import Size from "../utils/Size.js";
import Text from "./Text.js";
export default class ResText extends Text {
    TextAlignment: Alignment;
    DropShadow: boolean;
    Outline: boolean;
    Wrap: number;
    get WordWrap(): Size;
    set WordWrap(value: Size);
    constructor(caption: string, pos: Point, scale: number, color?: Color, font?: number, centered?: Alignment);
    Draw(): void;
    Draw(offset: Size): void;
    Draw(caption: Size, pos: Point, scale: number, color: Color, font: string | number, arg2: any): void;
}
