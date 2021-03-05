import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import IElement from "./IElement";
export default class Rectangle extends IElement {
    Pos: Point;
    Size: Size;
    Color: Color;
    constructor(pos: Point, size: Size, color: Color);
    Draw(pos: Point | Size, size: Size, color: Color): void;
}
