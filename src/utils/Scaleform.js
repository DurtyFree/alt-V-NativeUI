import * as alt from 'alt-client';
import * as game from 'natives';
export default class Scaleform {
    constructor(scaleForm) {
        this._handle = 0;
        this.scaleForm = scaleForm;
        this._handle = game.requestScaleformMovie(this.scaleForm);
    }
    get handle() {
        return this._handle;
    }
    get isValid() {
        return this._handle != 0;
    }
    get isLoaded() {
        return game.hasScaleformMovieLoaded(this._handle);
    }
    callFunctionHead(funcName, ...args) {
        if (!this.isValid || !this.isLoaded)
            return;
        game.beginScaleformMovieMethod(this._handle, funcName);
        args.forEach((arg) => {
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
                        game.scaleformMovieMethodAddParamPlayerNameString(arg);
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
    callFunction(funcName, ...args) {
        this.callFunctionHead(funcName, ...args);
        game.endScaleformMovieMethod();
    }
    callFunctionReturn(funcName, ...args) {
        this.callFunctionHead(funcName, ...args);
        return game.endScaleformMovieMethodReturnValue();
    }
    render2D() {
        if (!this.isValid || !this.isLoaded)
            return;
        game.drawScaleformMovieFullscreen(this._handle, 255, 255, 255, 255, 0);
    }
    recreate() {
        if (!this.isValid || !this.isLoaded)
            return;
        game.setScaleformMovieAsNoLongerNeeded(this._handle);
        this._handle = game.requestScaleformMovie(this.scaleForm);
    }
    destroy() {
        if (!this.isValid)
            return;
        game.setScaleformMovieAsNoLongerNeeded(this._handle);
        this._handle = 0;
    }
}
