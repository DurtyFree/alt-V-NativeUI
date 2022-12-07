import game from 'natives';
import UIMenuItem from "../items/UIMenuItem";
import Control from '../enums/Control';

export default class InstructionalButton {
    public Text: string;
    public get ItemBind(): UIMenuItem { return this._itemBind; }

    private _itemBind: UIMenuItem = null;
    private readonly _buttonString: string;
    private readonly _buttonControl: Control;
    private readonly _usingControls: boolean;

    /*
    * Add a dynamic button to the instructional buttons array.
    * Changes whether the controller is being used and changes depending on keybinds.
    * @param control GTA.Control that gets converted into a button.
    * @param keystring Custom keyboard button, like "I", or "O", or "F5".
    * @param text Help text that goes with the button.
    */
    constructor(text: string, control: Control, buttonString: string = null) {
        this.Text = text;
        this._buttonControl = control;
        this._usingControls = buttonString == null;
        this._buttonString = buttonString;
    }

    /* 
    * Bind this button to an item, so it's only shown when that item is selected.
    * @param item Item to bind to.
    */
    public BindToItem(item: UIMenuItem): void {
        this._itemBind = item;
    }

    public GetButtonId(): string {
        return this._usingControls ? game.getControlInstructionalButtonsString(2, this._buttonControl as number, false) : "t_" + this._buttonString;
    }
}
