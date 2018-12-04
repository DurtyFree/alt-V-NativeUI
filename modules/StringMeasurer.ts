import { Screen } from "../utils/Screen";
import ResText from "./ResText";

export default class StringMeasurer {
	public static MeasureStringWidthNoConvert(input: string) {
		mp.game.ui.setTextEntryForWidth("STRING");
		ResText.AddLongString(input);
		mp.game.ui.setTextFont(0);
		mp.game.ui.setTextScale(0.35, 0.35);
		return mp.game.ui.getTextScreenWidth(false);
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
