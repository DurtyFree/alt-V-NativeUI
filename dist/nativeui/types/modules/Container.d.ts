import Size from "../utils/Size.js";
import Rectangle from "./Rectangle.js";
import Point from '../utils/Point.js';
import Color from '../utils/Color.js';
export default class Container extends Rectangle {
    Items: any[];
    constructor(pos: Point, size: Size, color: Color);
    addItem(item: any): void;
    Draw(offset?: Size): void;
}
