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
    protected _itemText: ResText;
    protected _arrowLeft: Sprite;
    protected _arrowRight: Sprite;

    private _currentOffset: number = 0;
    private _leftMoveThreshold: number = 1;
    private _rightMoveThreshold: number = 1;
    private _lowerThreshold: number = 0;
    private _upperThreshold: number = 10;
    private _preCaptionText: string = '';
    private _postCaptionText: string = '';
    private _selectedValue: number;
    
    public get PreCaptionText() {
        return this._preCaptionText;
    }
    public set PreCaptionText(text: string) {
        if (!text) throw new Error("The pre caption text can't be null");
        if (typeof text !== 'string') throw new Error("The pre caption text must be a string");
        this._preCaptionText = text;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue.toString() + this.PostCaptionText, this._itemText && this._itemText.Font ? this._itemText.Font : 0, 0.35); // this._itemText && this._itemText.scale ? this._itemText.scale : 0.35
    }

    public get PostCaptionText() {
        return this._postCaptionText;
    }
    public set PostCaptionText(text: string) {
        if (!text) throw new Error("The post caption text can't be null");
        if (typeof text !== 'string') throw new Error("The post caption text must be a string");
        this._postCaptionText = text;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue.toString() + this.PostCaptionText, this._itemText && this._itemText.Font ? this._itemText.Font : 0, 0.35); // this._itemText && this._itemText.scale ? this._itemText.scale : 0.35
    }

    public get LeftMoveThreshold() {
        return this._leftMoveThreshold;
    }
    public set LeftMoveThreshold(value: number) {
        if (!value) throw new Error("The left threshold can't be null");

        this._leftMoveThreshold = value;
    }

    public get RightMoveThreshold() {
        return this._rightMoveThreshold;
    }
    public set RightMoveThreshold(value: number) {
        if (!value) throw new Error("The right threshold can't be null");

        this._rightMoveThreshold = value;
    }

    public get LowerThreshold() {
        return this._lowerThreshold;
    }
    public set LowerThreshold(value: number) {
        if (typeof value !== 'number' && !value) throw new Error("The lower threshold can't be null");

        this._lowerThreshold = value;
        if (this.SelectedValue < value) {
            this.SelectedValue = value;
        }
    }

    public get UpperThreshold() {
        return this._upperThreshold;
    }
    public set UpperThreshold(value: number) {
        if (typeof value !== 'number' && !value) throw new Error("The upper threshold can't be null");

        this._upperThreshold = value;
        if (this.SelectedValue > value) {
            this.SelectedValue = value;
        }
    }

    public get SelectedValue() {
        return this._selectedValue;
    }
    public set SelectedValue(value: number) {
        if (value < this._lowerThreshold || value > this._upperThreshold) throw new Error("The value can not be outside the lower or upper limits");

        this._selectedValue = value;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue.toString() + this.PostCaptionText, this._itemText && this._itemText.Font ? this._itemText.Font : 0, this._itemText && this._itemText.Scale ? this._itemText.Scale : 0.35);
    }

    constructor(text: string, description: string = "", lowerThreshold: number = 0, upperThreshold: number = 10, startValue: number = 0, data: any = null) {
        super(text, description, data);

        let y = 0;
        this.LowerThreshold = lowerThreshold;
        this.UpperThreshold = lowerThreshold > upperThreshold ? lowerThreshold : upperThreshold;
        this.SelectedValue = (startValue < lowerThreshold || startValue > upperThreshold) ? lowerThreshold : startValue;
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
        const offset = this._currentOffset;

        this._itemText.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);

        this._itemText.Caption = this.PreCaptionText + this._selectedValue + this.PostCaptionText;

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
}