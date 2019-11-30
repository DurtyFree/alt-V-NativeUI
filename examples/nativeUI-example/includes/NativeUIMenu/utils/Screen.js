import game from 'natives';
const gameScreen = game.getActiveScreenResolution(0, 0);
export const Screen = {
    width: gameScreen[1],
    height: gameScreen[2]
};
