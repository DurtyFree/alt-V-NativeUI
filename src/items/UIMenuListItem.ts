import BadgeStyle from "../enums/BadgeStyle";
import Font from "../enums/Font";
import ItemsCollection from "../modules/ItemsCollection";
import ListItem from "../modules/ListItem";
import ResText, { Alignment } from "../modules/ResText";
import Sprite from "../modules/Sprite";
import Color from "../utils/Color";
import LiteEvent from "../utils/LiteEvent";
import Point from "../utils/Point";
import Size from "../utils/Size";
import StringMeasurer from "../modules/StringMeasurer";
import UIMenuItem from "./UIMenuItem";

export default class UIMenuListItem extends UIMenuItem {
	protected _itemText: ResText;

	protected _arrowLeft: Sprite;
	protected _arrowRight: Sprite;

	private _holdTime: number;

	private currOffset: number = 0;

	private collection: Array<ListItem> = [];

	get Collection() {
		return this.collection;
	}
	set Collection(v) {
		if (!v) throw new Error("The collection can't be null");
		this.collection = v;
	}

	set SelectedItem(v: ListItem) {
		const idx = this.Collection.findIndex(li => li.Id === v.Id);
		if (idx > 0) this.Index = idx;
		else this.Index = 0;
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

	public ScrollingEnabled: boolean = true;

	public HoldTimeBeforeScroll: number = 200;

	private readonly OnListChanged = new LiteEvent();

	public get ListChanged() {
		return this.OnListChanged.expose();
	}

	protected _index: number = 0;

	get Index() {
		if (this.Collection == null) return -1;
		if (this.Collection != null && this.Collection.length == 0) return -1;

		return this._index % this.Collection.length;
	}
	set Index(value) {
		if (this.Collection == null) return;
		if (this.Collection != null && this.Collection.length == 0) return;

		this._index = 100000 - (100000 % this.Collection.length) + value;

		const caption =
			this.Collection.length >= this.Index
				? this.Collection[this.Index].DisplayText
				: " ";
		this.currOffset = StringMeasurer.MeasureString(caption);
	}

	constructor(
		text: string,
		description: string = "",
		collection: ItemsCollection = new ItemsCollection([]),
		startIndex: number = 0
	) {
		super(text, description);
		let y = 0;
		this.Collection = collection.getListItems();
		this.Index = startIndex;
		this._arrowLeft = new Sprite(
			"commonmenu",
			"arrowleft",
			new Point(110, 105 + y),
			new Size(30, 30)
		);
		this._arrowRight = new Sprite(
			"commonmenu",
			"arrowright",
			new Point(280, 105 + y),
			new Size(30, 30)
		);
		this._itemText = new ResText(
			"",
			new Point(290, y + 104),
			0.35,
			Color.White,
			Font.ChaletLondon,
			Alignment.Right
		);
	}

	public setCollection(collection: ItemsCollection) {
		this.Collection = collection.getListItems();
	}

	public setCollectionItem(
		index: number,
		item: ListItem | string,
		resetSelection: boolean = true
	) {
		if (index > this.Collection.length)
			// Placeholder for formatting
			throw new Error("Index out of bounds");
		if (typeof item === "string")
			// Placeholder for formatting
			item = new ListItem(item);

		this.Collection.splice(index, 1, item);

		if (resetSelection)
			// Placeholder for formatting
			this.Index = 0;
	}

	public SetVerticalPosition(y: number) {
		this._arrowLeft.pos = new Point(
			300 + this.Offset.X + this.Parent.WidthOffset,
			147 + y + this.Offset.Y
		);
		this._arrowRight.pos = new Point(
			400 + this.Offset.X + this.Parent.WidthOffset,
			147 + y + this.Offset.Y
		);
		this._itemText.pos = new Point(
			300 + this.Offset.X + this.Parent.WidthOffset,
			y + 147 + this.Offset.Y
		);
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
		const caption =
			this.Collection.length >= this.Index
				? this.Collection[this.Index].DisplayText
				: " ";
		const offset = this.currOffset;

		this._itemText.color = this.Enabled
			? this.Selected
				? this.HighlightedForeColor
				: this.ForeColor
			: new Color(163, 159, 148);

		this._itemText.caption = caption;

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

		this._arrowLeft.pos = new Point(
			375 - offset + this.Offset.X + this.Parent.WidthOffset,
			this._arrowLeft.pos.Y
		);

		if (this.Selected) {
			this._arrowLeft.Draw();
			this._arrowRight.Draw();
			this._itemText.pos = new Point(
				405 + this.Offset.X + this.Parent.WidthOffset,
				this._itemText.pos.Y
			);
		} else {
			this._itemText.pos = new Point(
				420 + this.Offset.X + this.Parent.WidthOffset,
				this._itemText.pos.Y
			);
		}
		this._itemText.Draw();
	}
}
