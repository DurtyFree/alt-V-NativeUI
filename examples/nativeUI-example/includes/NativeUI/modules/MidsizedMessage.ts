import * as alt from 'alt-client';
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

    public static ShowBridgesKnivesProgress(title: string, totalToDo: number, message: string, info: string, completed: number, time: number = 5000): void {
        this.ShowCustomShard("SHOW_BRIDGES_KNIVES_PROGRESS", time, title, totalToDo, message, info, completed);
    }

    public static ShowCondensedShardMessage(title: string, message: string, bgColor: HudColor, useDarkerShard: boolean, time: number = 5000): void {
        this.ShowCustomShard("SHOW_COND_SHARD_MESSAGE", time, title, message, bgColor, useDarkerShard);
    }

    public static ShowMidsizedShardMessage(title: string, message: string, bgColor: HudColor, useDarkerShard: boolean, useCondensedShard: boolean, time: number = 5000): void {
        this.ShowCustomShard("SHOW_SHARD_MIDSIZED_MESSAGE", time, title, message, bgColor, useDarkerShard, useCondensedShard);
    }
}
MidsizedMessage.Initialize("MIDSIZED_MESSAGE", "SHARD_ANIM_OUT");