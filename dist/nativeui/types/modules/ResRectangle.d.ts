import Point from "../utils/Point.js";
import Size from "../utils/Size.js";
import Rectangle from "./Rectangle.js";
import Color from '../utils/Color.js';
export default class ResRectangle extends Rectangle {
    constructor(pos: Point, size: Size, color: Color);
    Draw(): void;
    Draw(offset: any): void;
    Draw(pos: Point | Size, size: Size, color: Color): void;
}
