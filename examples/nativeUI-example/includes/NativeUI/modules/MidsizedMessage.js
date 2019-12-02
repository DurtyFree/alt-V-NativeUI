import * as alt from 'alt';
import Message from './Message';
export default class MidsizedMessage extends Message {
    static Initialize(scaleForm, transitionOutAnimName) {
        super.Initialize(scaleForm, transitionOutAnimName);
        alt.everyTick(() => this.Render());
    }
    static ShowMidsizedMessage(title, message = "", time = 5000) {
        this.ShowCustomShard("SHOW_MIDSIZED_MESSAGE", time, title, message);
    }
    static ShowMidsizedShardMessage(title, message, bgColor, useDarkerShard, condensed, time = 5000) {
        this.ShowCustomShard("SHOW_SHARD_MIDSIZED_MESSAGE", time, title, message, bgColor, useDarkerShard, condensed);
    }
}
MidsizedMessage.Initialize("MIDSIZED_MESSAGE", "SHARD_ANIM_OUT");
