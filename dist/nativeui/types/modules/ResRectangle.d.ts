import Point from "../utils/Point";
import Size from "../utils/Size";
import Rectangle from "./Rectangle";
import Color from '../utils/Color';
export default class ResRectangle extends Rectangle {
    constructor(pos: Point, size: Size, color: Color);
    Draw(): void;
    Draw(offset: any): void;
    Draw(pos: Point | Size, size: Size, color: Color): void;
}
