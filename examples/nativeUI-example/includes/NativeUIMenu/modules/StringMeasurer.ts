import game from 'natives';
import { Screen } from "../utils/Screen";
import ResText from "./ResText";

export default class StringMeasurer {
    public static MeasureStringWidthNoConvert(input: string) {
        game.beginTextCommandGetWidth("STRING");
        ResText.AddLongString(input);
        game.setTextFont(0);
        game.setTextScale(0.35, 0.35);
        return game.endTextCommandGetWidth(true);
	}

	public static MeasureString(str: string) {
		const screenw = Screen.width;
		const screenh = Screen.height;
		const height = 1080.0;
		const ratio = screenw / screenh;
		const width = height * ratio;
		return this.MeasureStringWidthNoConvert(str) * width;
	}
}
