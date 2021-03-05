import HudColor from '../enums/HudColor';
import Message from './Message';
export default class MidsizedMessage extends Message {
    static Initialize(scaleForm: string, transitionOutAnimName: string): void;
    static ShowMidsizedMessage(title: string, message?: string, time?: number): void;
    static ShowBridgesKnivesProgress(title: string, totalToDo: number, message: string, info: string, completed: number, time?: number): void;
    static ShowCondensedShardMessage(title: string, message: string, bgColor: HudColor, useDarkerShard: boolean, time?: number): void;
    static ShowMidsizedShardMessage(title: string, message: string, bgColor: HudColor, useDarkerShard: boolean, useCondensedShard: boolean, time?: number): void;
}
