import game from 'natives';

export default class Common {
    public static PlaySound(audioName: string, audioRef: string) {
        game.playSound(-1, audioName, audioRef, false, 0, true);
    }
}
