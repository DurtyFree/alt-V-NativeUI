import * as alt from 'alt-client';
import BadgeStyle from "../enums/BadgeStyle";
import Font from "../enums/Font";
import Alignment from "../enums/Alignment";
import ChangeDirection from "../enums/ChangeDirection";
import ResText from "../modules/ResText";
import Sprite from "../modules/Sprite";
import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import Screen from "../utils/Screen";
import UIMenuItem from "./UIMenuItem";

interface SelectionChangeHandler {
    (item: UIMenuDynamicListItem, selectedValue: string, changeDirection: ChangeDirection): string
}

interface SelectedStartValueHandler {
    (): string
}

export default class UIMenuDynamicListItem extends UIMenuItem {
    protected _itemText: ResText;
    protected _arrowLeft: Sprite;
    protected _arrowRight: Sprite;

    private _currentOffset: number = 0;
    private _precaptionText: string = '';
    private _selectedValue: string;
    private readonly _selectedStartValueHandler: SelectedStartValueHandler = null;

    public readonly SelectionChangeHandler: SelectionChangeHandler = null;
    public SelectionChangeHandlerPromise(item: UIMenuDynamicListItem, selectedValue: string, changeDirection: ChangeDirection): Promise<unknown> {
        return new Promise((resolve, reject) => {
            let newSelectedValue: string = this.SelectionChangeHandler(item, selectedValue, changeDirection);
            resolve(newSelectedValue);
        });
    }

    public get PreCaptionText() {
        return this._precaptionText;
    }
    public set PreCaptionText(text) {
        if (!text) throw new Error("The pre caption text can't be null");
        if (typeof text !== 'string') throw new Error("The pre caption text must be a string");
        this._precaptionText = text;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue, this._itemText && this._itemText.Font ? this._itemText.Font : 0, 0.35);
    }

    public get SelectedValue(): string {
        return this._selectedValue;
    }
    public set SelectedValue(value: string) {
        this._selectedValue = value;
        if (value == undefined)
            return;

        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue, this._itemText && this._itemText.Font ? this._itemText.Font : 0, this._itemText && this._itemText.Scale ? this._itemText.Scale : 0.35);
    }

    constructor(text: string, selectionChangeHandler: { (item: UIMenuDynamicListItem, selectedValue: string, changeDirection: ChangeDirection): string }, description: string = "", selectedStartValueHandler: { (): string } = null, data: any = null) {
        super(text, description, data);

        if (!this.isVariableFunction(selectionChangeHandler)) {
            alt.logError(`[UIMenuDynamicListItem] ${text} is not created with a valid selectionChangeHandler, needs to be function. Please see docs.`);
        }
        if (!this.isVariableFunction(selectedStartValueHandler)) {
            alt.logError(`[UIMenuDynamicListItem] ${text} is not created with a valid selectedStartValueHandler, needs to be function. Please see docs.`);
        }

        this.SelectionChangeHandler = selectionChangeHandler;
        this._selectedStartValueHandler = selectedStartValueHandler;
        let y = 0;

        this._arrowLeft = new Sprite("commonmenu", "arrowleft", new Point(110, 105 + y), new Size(30, 30));
        this._arrowRight = new Sprite("commonmenu", "arrowright", new Point(280, 105 + y), new Size(30, 30));
        this._itemText = new ResText("", new Point(290, y + 104), 0.35, Color.White, Font.ChaletLondon, Alignment.Right);
    }

    public SetVerticalPosition(y: number) {
        this._arrowLeft.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._arrowRight.Pos = new Point(400 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._itemText.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, y + 147 + this.Offset.Y);
        super.SetVerticalPosition(y);
    }

    public SetRightLabel(text: string) {
        return this;
    }

    public SetRightBadge(badge: BadgeStyle) {
        return this;
    }

    public Draw() {
        super.Draw();
        if (this._selectedValue == undefined) {
            if (this._selectedStartValueHandler != null) {
                this.SelectedValue = this._selectedStartValueHandler();
            }
            else {
                this._selectedValue = "";
            }
        }

        const offset = this._currentOffset;

        this._itemText.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);

        this._itemText.Caption = this.PreCaptionText + this._selectedValue;

        this._arrowLeft.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._arrowRight.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);

        this._arrowLeft.Pos = new Point(380 - offset + this.Offset.X + this.Parent.WidthOffset, this._arrowLeft.Pos.Y);

        if (this.Selected) {
            this._arrowLeft.Draw();
            this._arrowRight.Draw();
            this._itemText.Pos = new Point(405 + this.Offset.X + this.Parent.WidthOffset, this._itemText.Pos.Y);
        } else {
            this._itemText.Pos = new Point(420 + this.Offset.X + this.Parent.WidthOffset, this._itemText.Pos.Y);
        }
        this._itemText.Draw();
    }

    private isVariableFunction(functionToCheck: any): boolean {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
}