import Font from "../enums/Font";
import Alignment from "../enums/Alignment";
import ItemsCollection from "../modules/ItemsCollection";
import ListItem from "../modules/ListItem";
import ResText from "../modules/ResText";
import Sprite from "../modules/Sprite";
import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import Screen from "../utils/Screen";
import UIMenuItem from "./UIMenuItem";
export default class UIMenuListItem extends UIMenuItem {
    constructor(text, description = "", collection = new ItemsCollection([]), startIndex = 0, data = null) {
        super(text, description, data);
        this.ScrollingEnabled = true;
        this.HoldTimeBeforeScroll = 200;
        this._currentOffset = 0;
        this._itemsCollection = [];
        this._index = 0;
        let y = 0;
        this.Collection = collection.getListItems();
        this.Index = startIndex;
        this._arrowLeft = new Sprite("commonmenu", "arrowleft", new Point(110, 105 + y), new Size(30, 30));
        this._arrowRight = new Sprite("commonmenu", "arrowright", new Point(280, 105 + y), new Size(30, 30));
        this._itemText = new ResText("", new Point(290, y + 104), 0.35, Color.White, Font.ChaletLondon, Alignment.Right);
    }
    get Collection() {
        return this._itemsCollection;
    }
    set Collection(v) {
        if (!v)
            throw new Error("The collection can't be null");
        this._itemsCollection = v;
    }
    set SelectedItem(v) {
        const idx = this.Collection.findIndex(li => li.Id === v.Id);
        if (idx > 0)
            this.Index = idx;
        else
            this.Index = 0;
    }
    get SelectedItem() {
        return this.Collection.length > 0 ? this.Collection[this.Index] : null;
    }
    get SelectedValue() {
        return this.SelectedItem == null
            ? null
            : this.SelectedItem.Data == null
                ? this.SelectedItem.DisplayText
                : this.SelectedItem.Data;
    }
    get Index() {
        if (this.Collection == null)
            return -1;
        if (this.Collection != null && this.Collection.length == 0)
            return -1;
        return this._index % this.Collection.length;
    }
    set Index(value) {
        if (this.Collection == null)
            return;
        if (this.Collection != null && this.Collection.length == 0)
            return;
        this._index = 100000000 - (100000000 % this.Collection.length) + value;
        const caption = this.Collection.length >= this.Index
            ? this.Collection[this.Index].DisplayText
            : " ";
        this._currentOffset = Screen.GetTextWidth(caption, this._itemText && this._itemText.Font ? this._itemText.Font : 0, 0.35);
    }
    setCollection(collection) {
        this.Collection = collection.getListItems();
    }
    setCollectionItem(index, item, resetSelection = true) {
        if (index > this.Collection.length)
            throw new Error("Index out of bounds");
        if (typeof item === "string")
            item = new ListItem(item);
        this.Collection.splice(index, 1, item);
        if (resetSelection)
            this.Index = 0;
    }
    SetVerticalPosition(y) {
        this._arrowLeft.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._arrowRight.Pos = new Point(400 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._itemText.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, y + 147 + this.Offset.Y);
        super.SetVerticalPosition(y);
    }
    SetRightLabel(text) {
        return this;
    }
    SetRightBadge(badge) {
        return this;
    }
    Draw() {
        super.Draw();
        const caption = this.Collection.length >= this.Index
            ? this.Collection[this.Index].DisplayText
            : " ";
        const offset = this._currentOffset;
        this._itemText.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._itemText.Caption = caption;
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
        }
        else {
            this._itemText.Pos = new Point(420 + this.Offset.X + this.Parent.WidthOffset, this._itemText.Pos.Y);
        }
        this._itemText.Draw();
    }
}
