import Scaleform from '../utils/Scaleform';
export default class Message {
    private static _messageVisible;
    private static _transitionOutTimeout;
    private static _transitionOutFinishedTimeout;
    private static _delayedTransitionInTimeout;
    private static _scaleform;
    private static _transitionOutTimeMs;
    private static _transitionOutAnimName;
    protected static Initialize(scaleForm: string, transitionOutAnimName: string): void;
    static get IsVisible(): boolean;
    protected static get Scaleform(): Scaleform;
    private static Load;
    private static SetDelayedTransition;
    static ShowCustomShard(funcName: string, time?: number, ...funcArgs: any[]): void;
    static ShowComplexCustomShard(messageHandler: {
        (): void;
    }, time?: number): void;
    protected static TransitionOut(): void;
    private static TransitionIn;
    private static SetTransitionOutTimer;
    protected static Render(): void;
}
