import Color from "../utils/Color.js";
import Point from "../utils/Point.js";
import Size from "../utils/Size.js";
import IElement from "./IElement.js";
export default class Rectangle extends IElement {
    Pos: Point;
    Size: Size;
    Color: Color;
    constructor(pos: Point, size: Size, color: Color);
    Draw(pos: Point | Size, size: Size, color: Color): void;
}
