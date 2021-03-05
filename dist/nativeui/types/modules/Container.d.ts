import Size from "../utils/Size";
import Rectangle from "./Rectangle";
import Point from '../utils/Point';
import Color from '../utils/Color';
export default class Container extends Rectangle {
    Items: any[];
    constructor(pos: Point, size: Size, color: Color);
    addItem(item: any): void;
    Draw(offset?: Size): void;
}
