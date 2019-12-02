import game from 'natives';
export default class Common {
    static PlaySound(audioName, audioRef) {
        game.playSound(-1, audioName, audioRef, false, 0, true);
    }
}
