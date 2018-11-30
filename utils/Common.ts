export default class Common {
	public static PlaySound(audioName: string, audioRef: string) {
		mp.game.audio.playSound(-1, audioName, audioRef, false, 0, true);
	}
}
