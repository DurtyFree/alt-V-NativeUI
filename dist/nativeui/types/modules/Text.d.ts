import Color from "../utils/Color";
import Point from "../utils/Point";
import IElement from "./IElement";
import Size from '../utils/Size';
export default class Text extends IElement {
    Caption: string;
    Pos: Point;
    Scale: number;
    Color: Color;
    Font: number;
    Centered: boolean;
    constructor(caption: string, pos: Point, scale: number, color: Color, font: number, centered: boolean);
    Draw(caption: Size, pos: Point, scale: number, color: Color, font: string | number, centered: boolean): void;
    static AddLongString(text: string): void;
}
export { Text };
