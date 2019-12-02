import * as alt from 'alt';
import HudColor from '../enums/HudColor';
import Message from './Message';

export default class MidsizedMessage extends Message {
    public static Initialize(scaleForm: string, transitionOutAnimName: string) {
        super.Initialize(scaleForm, transitionOutAnimName);
        alt.everyTick(() => this.Render());
    }

    public static ShowMidsizedMessage(title: string, message: string = "", time: number = 5000): void {
        this.ShowCustomShard("SHOW_MIDSIZED_MESSAGE", time, title, message);
    }

    public static ShowMidsizedShardMessage(title: string, message: string, bgColor: HudColor, useDarkerShard: boolean, condensed: boolean, time: number = 5000): void {
        this.ShowCustomShard("SHOW_SHARD_MIDSIZED_MESSAGE", time, title, message, bgColor, useDarkerShard, condensed);
    }
}
MidsizedMessage.Initialize("MIDSIZED_MESSAGE", "SHARD_ANIM_OUT");