import * as alt from 'alt-client';
import * as game from 'natives';

export default class Scaleform {
    private _handle: number = 0;
    private scaleForm: string;

    public constructor(scaleForm: string) {
        this.scaleForm = scaleForm;
        this._handle = game.requestScaleformMovie(this.scaleForm);
    }

    public get handle(): number {
        return this._handle;
    }

    public get isValid(): boolean {
        return this._handle != 0;
    }

    public get isLoaded(): boolean {
        return game.hasScaleformMovieLoaded(this._handle);
    }

    private callFunctionHead(funcName: string, ...args: any[]): void {
        if (!this.isValid || !this.isLoaded)
            return;

        game.beginScaleformMovieMethod(this._handle, funcName);
        //alt.log("Running func head " + funcName + "(" + args + ") on " + this.handle + " (" + this.scaleForm + ")");

        args.forEach((arg: any) => {
            switch (typeof arg) {
                case "number":
                    {
                        if (Number(arg) === arg && arg % 1 !== 0) {
                            game.scaleformMovieMethodAddParamFloat(arg);
                        }
                        else {
                            game.scaleformMovieMethodAddParamInt(arg);
                        }
                    }
                case "string":
                    {
                        game.scaleformMovieMethodAddParamPlayerNameString(arg as string);
                        break;
                    }
                case "boolean":
                    {
                        game.scaleformMovieMethodAddParamBool(arg);
                        break;
                    }
                default:
                    {
                        alt.logError(`Unknown argument type ${typeof arg} = ${arg.toString()} passed to scaleform with handle ${this._handle}`);
                    }
            }
        });
    }

    public callFunction(funcName: string, ...args: any[]): void {
        this.callFunctionHead(funcName, ...args);
        game.endScaleformMovieMethod();
    }

    public callFunctionReturn(funcName: string, ...args: any[]): number {
        this.callFunctionHead(funcName, ...args);
        return game.endScaleformMovieMethodReturnValue();
    }

    public render2D(): void {
        if (!this.isValid || !this.isLoaded)
            return;
        game.drawScaleformMovieFullscreen(this._handle, 255, 255, 255, 255, 0);
    }

    public recreate(): void {
        if (!this.isValid || !this.isLoaded)
            return;
        game.setScaleformMovieAsNoLongerNeeded(this._handle);
        this._handle = game.requestScaleformMovie(this.scaleForm);
    }

    public destroy(): void {
        if (!this.isValid)
            return;
        game.setScaleformMovieAsNoLongerNeeded(this._handle);
        this._handle = 0;
    }
}