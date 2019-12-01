import * as alt from 'alt';
import game from 'natives';
import Size from "./Size";
import Text from '../modules/Text';
const gameScreen = game.getActiveScreenResolution(0, 0);
export const Screen = {
    width: gameScreen[1],
    height: gameScreen[2],
    ResolutionMaintainRatio: () => {
        const ratio = Screen.width / Screen.height;
        const width = 1080.0 * ratio;
        return new Size(width, 1080.0);
    },
    getMousePosition: (relative = false) => {
        const res = Screen.ResolutionMaintainRatio();
        const cursor = alt.getCursorPos();
        let [mouseX, mouseY] = [cursor.x, cursor.y];
        if (relative)
            [mouseX, mouseY] = [cursor.x / res.Width, cursor.y / res.Height];
        return [mouseX, mouseY];
    },
    IsMouseInBounds: (topLeft, boxSize) => {
        const [mouseX, mouseY] = Screen.getMousePosition();
        return (mouseX >= topLeft.X &&
            mouseX <= topLeft.X + boxSize.Width &&
            (mouseY > topLeft.Y && mouseY < topLeft.Y + boxSize.Height));
    },
    GetTextWidth: (text, font, scale) => {
        game.beginTextCommandGetWidth("THREESTRINGS");
        Text.AddLongString(text);
        game.setTextFont(font);
        game.setTextScale(1.0, scale);
        const width = game.endTextCommandGetWidth(true);
        const res = Screen.ResolutionMaintainRatio();
        return res.Width * width;
    },
    GetLineCount: (text, position, font, scale, wrap) => {
        game.beginTextCommandLineCount("THREESTRINGS");
        Text.AddLongString(text);
        const res = Screen.ResolutionMaintainRatio();
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
};
