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

	constructor(
		textureDict,
		textureName,
		pos,
		size,
		heading = 0,
		color = new Color(255, 255, 255)
	) {
		this.TextureDict = textureDict;
		this.TextureName = textureName;
		this.pos = pos;
		this.size = size;
		this.heading = heading;
		this.color = color;
		this.visible = true;
	}

	LoadTextureDictionary() {
		mp.game.graphics.requestStreamedTextureDict(this._textureDict, true);
		while (!this.IsTextureDictionaryLoaded) {
			//@ts-ignore
			mp.game.wait(0);
		}
	}

	set TextureDict(v) {
		this._textureDict = v;
		if (!this.IsTextureDictionaryLoaded) this.LoadTextureDictionary();
	}
	get TextureDict(): string {
		return this._textureDict;
	}

	get IsTextureDictionaryLoaded() {
		return mp.game.graphics.hasStreamedTextureDictLoaded(this._textureDict);
	}

	Draw(
		textureDictionary?,
		textureName?,
		pos?,
		size?,
		heading?,
		color?,
		loadTexture?
	) {
		textureDictionary = textureDictionary || this.TextureDict;
		textureName = textureName || this.TextureName;
		pos = pos || this.pos;
		size = size || this.size;
		heading = heading || this.heading;
		color = color || this.color;
		loadTexture = loadTexture || true;

		if (loadTexture) {
			if (!mp.game.graphics.hasStreamedTextureDictLoaded(textureDictionary))
				mp.game.graphics.requestStreamedTextureDict(textureDictionary, true);
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

		mp.game.graphics.drawSprite(
			textureDictionary,
			textureName,
			x,
			y,
			w,
			h,
			heading,
			color.R,
			color.G,
			color.B,
			color.A
		);
	}
}
