import * as alt from 'alt';
import game from 'natives';
import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import { Screen } from "../utils/Screen";

export default class Sprite {
    public TextureName: string;
    public pos: Point;
    public size: Size;
    public heading: number;
    public color: Color;
    public visible: boolean;
    private _textureDict: string;

    constructor(textureDict: string, textureName: string, pos: Point, size: Size, heading = 0, color = new Color(255, 255, 255)) {
        this.TextureDict = textureDict;
        this.TextureName = textureName;
        this.pos = pos;
        this.size = size;
        this.heading = heading;
        this.color = color;
        this.visible = true;
    }

    public LoadTextureDictionary() {
        this.requestTextureDictPromise(this._textureDict).then((succ) => { });
    }
    private requestTextureDictPromise(textureDict: string) {
        return new Promise((resolve, reject) => {
            game.requestStreamedTextureDict(textureDict, true);
            let inter = alt.setInterval(() => {
                if (game.hasStreamedTextureDictLoaded(textureDict)) {
                    alt.clearInterval(inter);
                    return resolve(true);
                }
            }, 10);
        });
    }

    public set TextureDict(v) {
        this._textureDict = v;
        if (!this.IsTextureDictionaryLoaded) this.LoadTextureDictionary();
    }
    public get TextureDict(): string {
        return this._textureDict;
    }

    public get IsTextureDictionaryLoaded() {
        return game.hasStreamedTextureDictLoaded(this._textureDict);
    }

    public Draw(textureDictionary?: string, textureName?: string, pos?: Point, size?: Size, heading?: number, color?: Color, loadTexture?: boolean) {
        textureDictionary = textureDictionary || this.TextureDict;
        textureName = textureName || this.TextureName;
        pos = pos || this.pos;
        size = size || this.size;
        heading = heading || this.heading;
        color = color || this.color;
        loadTexture = loadTexture || true;

        if (loadTexture) {
            if (!game.hasStreamedTextureDictLoaded(textureDictionary))
                game.requestStreamedTextureDict(textureDictionary, true);
        }

        const screenw = Screen.width;
        const screenh = Screen.height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        const width = height * ratio;

        const w = this.size.Width / width;
        const h = this.size.Height / height;
        const x = this.pos.X / width + w * 0.5;
        const y = this.pos.Y / height + h * 0.5;

        game.drawSprite(textureDictionary, textureName, x, y, w, h, heading, color.R, color.G, color.B, color.A, true);
    }
}
