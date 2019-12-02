import BadgeStyle from "../enums/BadgeStyle";
import Font from "../enums/Font";
import Alignment from "../enums/Alignment";
import ResText from "../modules/ResText";
import Sprite from "../modules/Sprite";
import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import Screen from "../utils/Screen";
import UIMenuItem from "./UIMenuItem";

export default class UIMenuAutoListItem extends UIMenuItem {
    public ScrollingEnabled: boolean = true;
    public HoldTimeBeforeScroll: number = 200;

    protected _itemText: ResText;
    protected _arrowLeft: Sprite;
    protected _arrowRight: Sprite;

    private _currentOffset: number = 0;
    private _leftMoveThreshold: number = 1;
    private _rightMoveThreshold: number = 1;
    private _lowerThreshold: number = 0;
    private _upperThreshold: number = 10;
    private _preText: string = '';
    private _value: number;
    
    public get PreCaptionText() {
        return this._preText;
    }
    public set PreCaptionText(text) {
        if (!text) throw new Error("The pre caption text can't be null");
        if (typeof text !== 'string') throw new Error("The pre caption text must be a string");
        this._preText = text;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._value.toString(), this._itemText && this._itemText.font ? this._itemText.font : 0, 0.35); // this._itemText && this._itemText.scale ? this._itemText.scale : 0.35
    }

    public get LeftMoveThreshold() {
        return this._leftMoveThreshold;
    }
    public set LeftMoveThreshold(amt) {
        if (!amt) throw new Error("The left threshold can't be null");
        this._leftMoveThreshold = amt;
    }

    public get RightMoveThreshold() {
        return this._rightMoveThreshold;
    }
    public set RightMoveThreshold(amt) {
        if (!amt) throw new Error("The right threshold can't be null");
        this._rightMoveThreshold = amt;
    }

    public get LowerThreshold() {
        return this._lowerThreshold;
    }
    public set LowerThreshold(amt) {
        if (typeof amt !== 'number' && !amt) throw new Error("The lower threshold can't be null");
        this._lowerThreshold = amt;
        if (this.SelectedValue < amt) {
            this.SelectedValue = amt;
        }
    }

    public get UpperThreshold() {
        return this._upperThreshold;
    }
    public set UpperThreshold(amt) {
        if (typeof amt !== 'number' && !amt) throw new Error("The upper threshold can't be null");
        this._upperThreshold = amt;
        if (this.SelectedValue > amt) {
            this.SelectedValue = amt;
        }
    }

    public get SelectedValue() {
        return this._value;
    }
    public set SelectedValue(v: number) {
        if (v < this._lowerThreshold || v > this._upperThreshold) throw new Error("The value can not be outside the lower or upper limits");

        this._value = v;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._value.toString(), this._itemText && this._itemText.font ? this._itemText.font : 0, this._itemText && this._itemText.scale ? this._itemText.scale : 0.35);
    }

    constructor(text: string, description: string = "", lowerThreshold: number = 0, upperThreshold: number = 10, startValue: number = 0, data: any = null) {
        super(text, description, data);

        let y = 0;
        this.LowerThreshold = lowerThreshold;
        this.UpperThreshold = upperThreshold;
        this.SelectedValue = (startValue < lowerThreshold || startValue > upperThreshold) ? lowerThreshold : startValue;
        this._arrowLeft = new Sprite("commonmenu", "arrowleft", new Point(110, 105 + y), new Size(30, 30));
        this._arrowRight = new Sprite("commonmenu", "arrowright", new Point(280, 105 + y), new Size(30, 30));
        this._itemText = new ResText("", new Point(290, y + 104), 0.35, Color.White, Font.ChaletLondon, Alignment.Right);
    }

    public SetVerticalPosition(y: number) {
        this._arrowLeft.pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._arrowRight.pos = new Point(400 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._itemText.pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, y + 147 + this.Offset.Y);
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
        const offset = this._currentOffset;

        this._itemText.color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);

        this._itemText.caption = this.PreCaptionText + this._value;

        this._arrowLeft.color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._arrowRight.color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);

        this._arrowLeft.pos = new Point(390 - offset + this.Offset.X + this.Parent.WidthOffset, this._arrowLeft.pos.Y);

        if (this.Selected) {
            this._arrowLeft.Draw();
            this._arrowRight.Draw();
            this._itemText.pos = new Point(405 + this.Offset.X + this.Parent.WidthOffset, this._itemText.pos.Y);
        } else {
            this._itemText.pos = new Point(420 + this.Offset.X + this.Parent.WidthOffset, this._itemText.pos.Y);
        }
        this._itemText.Draw();
    }
}