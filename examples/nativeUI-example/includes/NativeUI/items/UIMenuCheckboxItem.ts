import BadgeStyle from "../enums/BadgeStyle";
import Sprite from "../modules/Sprite";
import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import UIMenuItem from "./UIMenuItem";

export default class UIMenuCheckboxItem extends UIMenuItem {
    private readonly _checkedSprite: Sprite;

    public Checked: boolean = false;

    constructor(text: string, check: boolean = false, description: string = "") {
        super(text, description);

        const y = 0;
        this._checkedSprite = new Sprite("commonmenu", "shop_box_blank", new Point(410, y + 95), new Size(50, 50));
        this.Checked = check;
    }

    public SetVerticalPosition(y: number) {
        super.SetVerticalPosition(y);
        this._checkedSprite.Pos = new Point(380 + this.Offset.X + this.Parent.WidthOffset, y + 138 + this.Offset.Y);
    }

    public Draw() {
        super.Draw();

        this._checkedSprite.Pos = this._checkedSprite.Pos = new Point(380 + this.Offset.X + this.Parent.WidthOffset, this._checkedSprite.Pos.Y);
        const isDefaultHightlitedForeColor = this.HighlightedForeColor == UIMenuItem.DefaultHighlightedForeColor;

        if (this.Selected && isDefaultHightlitedForeColor) {
            this._checkedSprite.TextureName = this.Checked
                ? "shop_box_tickb"
                : "shop_box_blankb";
        } else {
            this._checkedSprite.TextureName = this.Checked
                ? "shop_box_tick"
                : "shop_box_blank";
        }

        this._checkedSprite.Color = this.Enabled
            ? this.Selected && !isDefaultHightlitedForeColor
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._checkedSprite.Draw();
    }

    public SetRightBadge(badge: BadgeStyle) {
        return this;
    }

    public SetRightLabel(text: string) {
        return this;
    }
}
