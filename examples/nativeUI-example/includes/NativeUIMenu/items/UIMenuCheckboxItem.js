import Sprite from "../modules/Sprite";
import Color from "../utils/Color";
import LiteEvent from "../utils/LiteEvent";
import Point from "../utils/Point";
import Size from "../utils/Size";
import UIMenuItem from "./UIMenuItem";
export default class UIMenuCheckboxItem extends UIMenuItem {
    constructor(text, check = false, description = "") {
        super(text, description);
        this.OnCheckedChanged = new LiteEvent();
        this.Checked = false;
        const y = 0;
        this._checkedSprite = new Sprite("commonmenu", "shop_box_blank", new Point(410, y + 95), new Size(50, 50));
        this.Checked = check;
    }
    get CheckedChanged() {
        return this.OnCheckedChanged.expose();
    }
    SetVerticalPosition(y) {
        super.SetVerticalPosition(y);
        this._checkedSprite.pos = new Point(380 + this.Offset.X + this.Parent.WidthOffset, y + 138 + this.Offset.Y);
    }
    Draw() {
        super.Draw();
        this._checkedSprite.pos = this._checkedSprite.pos = new Point(380 + this.Offset.X + this.Parent.WidthOffset, this._checkedSprite.pos.Y);
        const isDefaultHightlitedForeColor = this.HighlightedForeColor == UIMenuItem.DefaultHighlightedForeColor;
        if (this.Selected && isDefaultHightlitedForeColor) {
            this._checkedSprite.TextureName = this.Checked
                ? "shop_box_tickb"
                : "shop_box_blankb";
        }
        else {
            this._checkedSprite.TextureName = this.Checked
                ? "shop_box_tick"
                : "shop_box_blank";
        }
        this._checkedSprite.color = this.Enabled
            ? this.Selected && !isDefaultHightlitedForeColor
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._checkedSprite.Draw();
    }
    SetRightBadge(badge) {
        return this;
    }
    SetRightLabel(text) {
        return this;
    }
}
