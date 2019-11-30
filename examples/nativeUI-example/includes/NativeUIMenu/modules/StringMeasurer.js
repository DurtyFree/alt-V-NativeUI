import game from 'natives';
import { Screen } from "../utils/Screen";
import Text from './Text';
export default class StringMeasurer {
    static MeasureStringWidthNoConvert(input) {
        game.beginTextCommandGetWidth("STRING");
        Text.AddLongString(input);
        game.setTextFont(0);
        game.setTextScale(0.35, 0.35);
        return game.endTextCommandGetWidth(true);
    }
    static MeasureString(str) {
        const screenw = Screen.width;
        const screenh = Screen.height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        const width = height * ratio;
        return this.MeasureStringWidthNoConvert(str) * width;
    }
}
