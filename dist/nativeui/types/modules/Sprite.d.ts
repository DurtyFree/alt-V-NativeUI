import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
export default class Sprite {
    TextureName: string;
    Pos: Point;
    Size: Size;
    Heading: number;
    Color: Color;
    Visible: boolean;
    private _textureDict;
    constructor(textureDict: string, textureName: string, pos: Point, size: Size, heading?: number, color?: Color);
    LoadTextureDictionary(): void;
    private requestTextureDictPromise;
    set TextureDict(v: string);
    get TextureDict(): string;
    get IsTextureDictionaryLoaded(): boolean;
    Draw(textureDictionary?: string, textureName?: string, pos?: Point, size?: Size, heading?: number, color?: Color, loadTexture?: boolean): void;
}
