import * as alt from 'alt-client';
import HudColor from '../enums/HudColor';
import Message from './Message';

export default class BigMessage extends Message {
    public static Initialize(scaleForm: string, transitionOutAnimName: string) {
        super.Initialize(scaleForm, transitionOutAnimName);
        alt.everyTick(() => this.Render());
    }

    public static ShowMissionPassedMessage(msg: string, subtitle: string = "", time: number = 5000): void {
        this.ShowCustomShard("SHOW_MISSION_PASSED_MESSAGE", time, msg, subtitle, 100, true, 0, true);
    }

    public static ShowColoredShard(msg: string, desc: string, textColor: HudColor, bgColor: HudColor, time: number = 5000): void {
        this.ShowCustomShard("SHOW_SHARD_CENTERED_MP_MESSAGE", time, msg, desc, bgColor as number, textColor as number);
    }

    public static ShowOldMessage(msg: string, time: number = 5000): void {
        this.ShowCustomShard("SHOW_MISSION_PASSED_MESSAGE", time, msg);
    }

    public static ShowSimpleShard(title: string, subtitle: string = "", time: number = 5000): void {
        this.ShowCustomShard("SHOW_SHARD_CREW_RANKUP_MP_MESSAGE", time, title, subtitle);
    }

    public static ShowRankupMessage(msg: string, subtitle: string, rank: number, time: number = 5000): void {
        this.ShowCustomShard("SHOW_BIG_MP_MESSAGE", time, msg, subtitle, rank, "", "");
    }

    public static ShowPlaneMessage(title: string, planeName: string, planeHash: number, time: number = 5000): void {
        this.ShowCustomShard("SHOW_PLANE_MESSAGE", time, title, planeName, planeHash, "", "");
    }

    public static ShowWeaponPurchasedMessage(bigMessage: string, weaponName: string, weaponHash: number, time: number = 5000): void {
        this.ShowCustomShard("SHOW_WEAPON_PURCHASED", time, bigMessage, weaponName, weaponHash, "", 100);
    }

    public static ShowWastedMessage(title: string, message: string, color: HudColor, darkenBackground: boolean, time: number = 5000): void {
        this.ShowCustomShard("SHOW_SHARD_WASTED_MP_MESSAGE", time, title, message, color as number, darkenBackground);
    }

    public static ShowMpMessageLarge(msg: string, subtitle: string = "", time: number = 5000): void {
        this.ShowComplexCustomShard(() => {
            this.Scaleform.callFunction("SHOW_CENTERED_MP_MESSAGE_LARGE", msg, subtitle, 100, true, 100);
            this.Scaleform.callFunction("TRANSITION_IN");
        }, time);
    }
}
BigMessage.Initialize("MP_BIG_MESSAGE_FREEMODE", "TRANSITION_OUT");