import game from 'natives';
export default class InstructionalButton {
    constructor(text, control, buttonString = null) {
        this._itemBind = null;
        this.Text = text;
        this._buttonControl = control;
        this._usingControls = buttonString == null;
        this._buttonString = buttonString;
    }
    get ItemBind() { return this._itemBind; }
    BindToItem(item) {
        this._itemBind = item;
    }
    GetButtonId() {
        return this._usingControls ? game.getControlInstructionalButton(2, this._buttonControl, false) : "t_" + this._buttonString;
    }
}
