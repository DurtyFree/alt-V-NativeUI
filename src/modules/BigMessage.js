import * as alt from 'alt-client';
import Message from './Message';
export default class BigMessage extends Message {
    static Initialize(scaleForm, transitionOutAnimName) {
        super.Initialize(scaleForm, transitionOutAnimName);
        alt.everyTick(() => this.Render());
    }
    static ShowMissionPassedMessage(msg, subtitle = "", time = 5000) {
        this.ShowCustomShard("SHOW_MISSION_PASSED_MESSAGE", time, msg, subtitle, 100, true, 0, true);
    }
    static ShowColoredShard(msg, desc, textColor, bgColor, time = 5000) {
        this.ShowCustomShard("SHOW_SHARD_CENTERED_MP_MESSAGE", time, msg, desc, bgColor, textColor);
    }
    static ShowOldMessage(msg, time = 5000) {
        this.ShowCustomShard("SHOW_MISSION_PASSED_MESSAGE", time, msg);
    }
    static ShowSimpleShard(title, subtitle = "", time = 5000) {
        this.ShowCustomShard("SHOW_SHARD_CREW_RANKUP_MP_MESSAGE", time, title, subtitle);
    }
    static ShowRankupMessage(msg, subtitle, rank, time = 5000) {
        this.ShowCustomShard("SHOW_BIG_MP_MESSAGE", time, msg, subtitle, rank, "", "");
    }
    static ShowPlaneMessage(title, planeName, planeHash, time = 5000) {
        this.ShowCustomShard("SHOW_PLANE_MESSAGE", time, title, planeName, planeHash, "", "");
    }
    static ShowWeaponPurchasedMessage(bigMessage, weaponName, weaponHash, time = 5000) {
        this.ShowCustomShard("SHOW_WEAPON_PURCHASED", time, bigMessage, weaponName, weaponHash, "", 100);
    }
    static ShowWastedMessage(title, message, color, darkenBackground, time = 5000) {
        this.ShowCustomShard("SHOW_SHARD_WASTED_MP_MESSAGE", time, title, message, color, darkenBackground);
    }
    static ShowMpMessageLarge(msg, subtitle = "", time = 5000) {
        this.ShowComplexCustomShard(() => {
            this.Scaleform.callFunction("SHOW_CENTERED_MP_MESSAGE_LARGE", msg, subtitle, 100, true, 100);
            this.Scaleform.callFunction("TRANSITION_IN");
        }, time);
    }
}
BigMessage.Initialize("MP_BIG_MESSAGE_FREEMODE", "TRANSITION_OUT");
