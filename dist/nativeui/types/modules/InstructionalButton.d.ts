import UIMenuItem from "../items/UIMenuItem";
import Control from '../enums/Control';
export default class InstructionalButton {
    Text: string;
    get ItemBind(): UIMenuItem;
    private _itemBind;
    private readonly _buttonString;
    private readonly _buttonControl;
    private readonly _usingControls;
    constructor(text: string, control: Control, buttonString?: string);
    BindToItem(item: UIMenuItem): void;
    GetButtonId(): string;
}
