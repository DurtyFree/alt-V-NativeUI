import * as alt from 'alt-client';
import game from 'natives';
import Size from "./Size";
import Text from '../modules/Text';
const gameScreen = game.getActiveScreenResolution(0, 0);
export default class Screen {
    static get ResolutionMaintainRatio() {
        const ratio = Screen.Width / Screen.Height;
        const width = 1080.0 * ratio;
        return new Size(width, 1080.0);
    }
    static MousePosition(relative = false) {
        const res = Screen.ResolutionMaintainRatio;
        const cursor = alt.getCursorPos();
        let [mouseX, mouseY] = [cursor.x, cursor.y];
        if (relative)
            [mouseX, mouseY] = [cursor.x / res.Width, cursor.y / res.Height];
        return {
            X: mouseX,
            Y: mouseY
        };
    }
    static IsMouseInBounds(topLeft, boxSize) {
        const mousePosition = Screen.MousePosition();
        return (mousePosition.X >= topLeft.X &&
            mousePosition.X <= topLeft.X + boxSize.Width &&
            (mousePosition.Y > topLeft.Y && mousePosition.Y < topLeft.Y + boxSize.Height));
    }
    static GetTextWidth(text, font, scale) {
        game.beginTextCommandGetWidth("CELL_EMAIL_BCON");
        Text.AddLongString(text);
        game.setTextFont(font);
        game.setTextScale(1.0, scale);
        const width = game.endTextCommandGetWidth(true);
        const res = Screen.ResolutionMaintainRatio;
        return res.Width * width;
    }
    static GetLineCount(text, position, font, scale, wrap) {
        game.beginTextCommandLineCount("CELL_EMAIL_BCON");
        Text.AddLongString(text);
        const res = Screen.ResolutionMaintainRatio;
        const x = position.X / res.Width;
        const y = position.Y / res.Height;
        game.setTextFont(font);
        game.setTextScale(1.0, scale);
        if (wrap > 0) {
            const start = position.X / res.Width;
            const end = start + (wrap / res.Width);
            game.setTextWrap(x, end);
        }
        let lineCount = game.endTextCommandLineCount(x, y);
        return lineCount;
    }
}
Screen.Width = gameScreen[1];
Screen.Height = gameScreen[2];
