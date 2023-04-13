import Font from "../enums/Font.js";
import Point from "./Point.js";
import Size from "./Size.js";
export default class Screen {
    static Width: number;
    static Height: number;
    static get ResolutionMaintainRatio(): Size;
    static MousePosition(relative?: boolean): {
        X: number;
        Y: number;
    };
    static IsMouseInBounds(topLeft: Point, boxSize: Size): boolean;
    static GetTextWidth(text: string, font: Font, scale: number): number;
    static GetLineCount(text: string, position: Point, font: Font, scale: number, wrap: number): number;
}
