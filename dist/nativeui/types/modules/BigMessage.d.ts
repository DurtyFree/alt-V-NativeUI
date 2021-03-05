import HudColor from '../enums/HudColor';
import Message from './Message';
export default class BigMessage extends Message {
    static Initialize(scaleForm: string, transitionOutAnimName: string): void;
    static ShowMissionPassedMessage(msg: string, subtitle?: string, time?: number): void;
    static ShowColoredShard(msg: string, desc: string, textColor: HudColor, bgColor: HudColor, time?: number): void;
    static ShowOldMessage(msg: string, time?: number): void;
    static ShowSimpleShard(title: string, subtitle?: string, time?: number): void;
    static ShowRankupMessage(msg: string, subtitle: string, rank: number, time?: number): void;
    static ShowPlaneMessage(title: string, planeName: string, planeHash: number, time?: number): void;
    static ShowWeaponPurchasedMessage(bigMessage: string, weaponName: string, weaponHash: number, time?: number): void;
    static ShowWastedMessage(title: string, message: string, color: HudColor, darkenBackground: boolean, time?: number): void;
    static ShowMpMessageLarge(msg: string, subtitle?: string, time?: number): void;
}
