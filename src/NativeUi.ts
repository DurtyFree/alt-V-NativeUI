import * as alt from 'alt-client';
import game from 'natives';
import BadgeStyle from "./enums/BadgeStyle";
import Font from "./enums/Font";
import Alignment from './enums/Alignment';
import Control from './enums/Control';
import HudColor from './enums/HudColor';
import ChangeDirection from './enums/ChangeDirection';
import UIMenuCheckboxItem from "./items/UIMenuCheckboxItem";
import UIMenuItem from "./items/UIMenuItem";
import UIMenuListItem from "./items/UIMenuListItem";
import UIMenuAutoListItem from "./items/UIMenuAutoListItem";
import UIMenuSliderItem from "./items/UIMenuSliderItem";
import Container from "./modules/Container";
import ItemsCollection from "./modules/ItemsCollection";
import ListItem from "./modules/ListItem";
import ResRectangle from "./modules/ResRectangle";
import ResText from "./modules/ResText";
import Sprite from "./modules/Sprite";
import Color from "./utils/Color";
import Common from "./utils/Common";
import LiteEvent from "./utils/LiteEvent";
import Point from "./utils/Point";
import Size from "./utils/Size";
import UUIDV4 from "./utils/UUIDV4";
import Screen from "./utils/Screen";
import InstructionalButton from './modules/InstructionalButton';
import Scaleform from './utils/Scaleform';
import BigMessage from './modules/BigMessage';
import MidsizedMessage from './modules/MidsizedMessage';
import UIMenuDynamicListItem from './items/UIMenuDynamicListItem';

let menuPool: NativeUI[] = [];

export default class NativeUI {
    private _visible: boolean = true;
    private _counterPretext: string = "";
    private _counterOverride: string = undefined;
    private _spriteLibrary: string;
    private _spriteName: string;
    private _offset: Point;
    private _lastUpDownNavigation = 0;
    private _lastLeftRightNavigation = 0;
    private _extraOffset: number = 0;
    private _buttonsEnabled: boolean = true;
    private _justOpened: boolean = true;
    private _justOpenedFromPool: boolean = false;
    private _justClosedFromPool: boolean = false;
    private _poolOpening: NativeUI = null;
    private _safezoneOffset: Point = new Point(0, 0);
    private _activeItem: number = 1000;
    private _maxItemsOnScreen: number = 9;
    private _minItem: number;
    private _maxItem: number = this._maxItemsOnScreen;
    private _mouseEdgeEnabled: boolean = true;
    private _bannerSprite: Sprite = null;
    private _bannerRectangle: ResRectangle = null;
    private _recalculateDescriptionNextFrame: number = 1;

    private readonly _instructionalButtons: InstructionalButton[] = [];
    private readonly _instructionalButtonsScaleform: Scaleform;
    private readonly _defaultTitleScale: number = 1.15;
    private readonly _maxMenuItems: number = 1000;
    private readonly _mainMenu: Container;
    private readonly _upAndDownSprite: Sprite;
    private readonly _titleResText: ResText;
    private readonly _subtitleResText: ResText;
    private readonly _extraRectangleUp: ResRectangle;
    private readonly _extraRectangleDown: ResRectangle;
    private readonly _descriptionBar: ResRectangle;
    private readonly _descriptionRectangle: Sprite;
    private readonly _descriptionText: ResText;
    private readonly _counterText: ResText;
    private readonly _background: Sprite;

    public readonly Id: string = UUIDV4();
    public readonly SelectTextLocalized: string = alt.getGxtText("HUD_INPUT2");
    public readonly BackTextLocalized: string = alt.getGxtText("HUD_INPUT3");

    public WidthOffset: number = 0;
    public ParentMenu: NativeUI = null;
    public ParentItem: UIMenuItem = null;
    public Children: Map<string, NativeUI>; // (UUIDV4, NativeUI)
    public MouseControlsEnabled: boolean = false;
    public CloseableByUser: boolean = true;

    public AUDIO_LIBRARY: string = "HUD_FRONTEND_DEFAULT_SOUNDSET";
    public AUDIO_UPDOWN: string = "NAV_UP_DOWN";
    public AUDIO_LEFTRIGHT: string = "NAV_LEFT_RIGHT";
    public AUDIO_SELECT: string = "SELECT";
    public AUDIO_BACK: string = "BACK";
    public AUDIO_ERROR: string = "ERROR";

    public MenuItems: (| UIMenuItem | UIMenuListItem | UIMenuAutoListItem | UIMenuDynamicListItem | UIMenuSliderItem | UIMenuCheckboxItem)[] = [];

    // Events
    public readonly IndexChange = new LiteEvent();
    public readonly ListChange = new LiteEvent();
    public readonly AutoListChange = new LiteEvent();
    public readonly DynamicListChange = new LiteEvent();
    public readonly SliderChange = new LiteEvent();
    //public readonly SliderSelect = new LiteEvent();
    public readonly CheckboxChange = new LiteEvent();
    public readonly ItemSelect = new LiteEvent();
    public readonly MenuOpen = new LiteEvent();
    public readonly MenuClose = new LiteEvent();
    public readonly MenuChange = new LiteEvent();

    public GetSpriteBanner(): Sprite {
        return this._bannerSprite;
    }

    public GetRectangleBanner(): ResRectangle {
        return this._bannerRectangle;
    }

    public GetTitle(): ResText {
        return this._titleResText;
    }

    public get MaxItemsVisible(): number {
        return this._maxItemsOnScreen;
    }

    public set MaxItemsVisible(value: number) {
        this._maxItemsOnScreen = value;
        this._maxItem = value;
    }

    public get Title(): string {
        return this._titleResText.Caption;
    }

    public set Title(text: string) {
        this._titleResText.Caption = text;
    }

    public get GetSubTitle(): ResText {
        return this._titleResText;
    }

    public get SubTitle(): string {
        return this._titleResText.Caption;
    }
    
    public set SubTitle(text: string) {
        this._subtitleResText.Caption = text;
    }

    public get Visible() {
        return this._visible;
    }
    public set Visible(toggle: boolean) { // Menu pools don't work with submenus
        this._visible = toggle;
        Common.PlaySound(this.AUDIO_BACK, this.AUDIO_LIBRARY);
        this.UpdateScaleform();
		/*if(!toggle) {
			alt.emit('server:clientDebug', `Visible = false. _justOpenedFromPool: ${this._justOpenedFromPool}`);
		}*/
        if (toggle) {
            this.UpdateDescriptionCaption();
        }
        if (this._justOpenedFromPool === true) {
            this._justOpenedFromPool = false;
            return;
        }
        if (toggle) {
            this._justOpened = true;
            this.MenuOpen.emit();

            if (this.ParentMenu === null) {
                if (!menuPool.includes(this) && this !== this._poolOpening) {
                    const previousMenu = (menuPool.length) ? menuPool[menuPool.length - 1] : null;
                    menuPool.push(this);
                    //alt.emit('server:clientDebug', 'Adding to menu pool ' + menuPool.length);
                    if (previousMenu !== this._poolOpening && previousMenu !== null) {
                        previousMenu._justClosedFromPool = true;
                        previousMenu.Visible = false;
                        //alt.emit('server:clientDebug', 'Closing current');
                    }
                }
            }
        } else {
            if (this._justClosedFromPool === true) {
                this._justClosedFromPool = false;
                return;
            }
            if (this.ParentMenu === null && menuPool.includes(this) && menuPool.length) {
                if (menuPool[menuPool.length - 1] === this) {
                    menuPool.pop();
                    this._justOpenedFromPool = true;
                    if (!menuPool.length) {
                        this._poolOpening = null;
                    }
                    //alt.emit('server:clientDebug', 'Removing from menu pool ' + menuPool.length);
                }
                if (menuPool.length) {
                    this._poolOpening = menuPool[menuPool.length - 1];
                    menuPool[menuPool.length - 1].Visible = true;
                    //alt.emit('server:clientDebug', 'Pool opening next in line menu');
                }
            }
            if (menuPool.length === 0) {
                game.setMouseCursorSprite(1);
            }
        }
    }

    public get CurrentSelection() {
        return this._activeItem % this.MenuItems.length;
    }
    public set CurrentSelection(v) {
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
        this._activeItem = this._maxMenuItems - (this._maxMenuItems % this.MenuItems.length) + v;
        if (this.CurrentSelection > this._maxItem) {
            this._maxItem = this.CurrentSelection;
            this._minItem = this.CurrentSelection - this._maxItemsOnScreen;
        } else if (this.CurrentSelection < this._minItem) {
            this._maxItem = this._maxItemsOnScreen + this.CurrentSelection;
            this._minItem = this.CurrentSelection;
        }
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }

    constructor(title: string, subtitle: string, offset: Point, spriteLibrary?: string, spriteName?: string) {
        if (!(offset instanceof Point)) offset = Point.Parse(offset);

        this._spriteLibrary = spriteLibrary || "commonmenu";
        this._spriteName = spriteName || "interaction_bgd";
        this._offset = new Point(offset.X, offset.Y);
        this.Children = new Map();

        this._instructionalButtonsScaleform = new Scaleform("instructional_buttons");
        this.UpdateScaleform();

        // Create everything
        this._mainMenu = new Container(new Point(0, 0), new Size(700, 500), new Color(0, 0, 0, 0));
        this._bannerSprite = new Sprite(this._spriteLibrary, this._spriteName, new Point(0 + this._offset.X, 0 + this._offset.Y), new Size(431, 107));
        this._mainMenu.addItem(
            (this._titleResText = new ResText(title, new Point(215 + this._offset.X, 20 + this._offset.Y), this._defaultTitleScale, new Color(255, 255, 255), 1, Alignment.Centered))
        );

        if (subtitle !== "") {
            this._mainMenu.addItem(
                new ResRectangle(new Point(0 + this._offset.X, 107 + this._offset.Y), new Size(431, 37), new Color(0, 0, 0, 255))
            );
            this._mainMenu.addItem(
                (this._subtitleResText = new ResText(subtitle, new Point(8 + this._offset.X, 110 + this._offset.Y), 0.35, new Color(255, 255, 255), 0, Alignment.Left))
            );
            if (subtitle.startsWith("~")) {
                this._counterPretext = subtitle.substr(0, 3);
            }
            this._counterText = new ResText("", new Point(425 + this._offset.X, 110 + this._offset.Y), 0.35, new Color(255, 255, 255), 0, Alignment.Right);
            this._extraOffset += 37;
        }

        this._upAndDownSprite = new Sprite(
            "commonmenu",
            "shop_arrows_upanddown",
            new Point(190 + this._offset.X, 147 + 37 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset),
            new Size(50, 50)
        );

        this._extraRectangleUp = new ResRectangle(
            new Point(0 + this._offset.X, 144 + 38 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset),
            new Size(431, 18),
            new Color(0, 0, 0, 200)
        );

        this._extraRectangleDown = new ResRectangle(
            new Point(0 + this._offset.X, 144 + 18 + 38 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset),
            new Size(431, 18),
            new Color(0, 0, 0, 200)
        );

        this._descriptionBar = new ResRectangle(new Point(this._offset.X, 123), new Size(431, 4), Color.Black);
        this._descriptionRectangle = new Sprite("commonmenu", "gradient_bgd", new Point(this._offset.X, 127), new Size(431, 30));
        this._descriptionText = new ResText("", new Point(this._offset.X + 5, 125), 0.35, new Color(255, 255, 255, 255), Font.ChaletLondon, Alignment.Left);
        this._descriptionText.Wrap = 400;
        
        this._background = new Sprite("commonmenu", "gradient_bgd", new Point(this._offset.X, 144 + this._offset.Y - 37 + this._extraOffset), new Size(290, 25));
        this._visible = false;

        alt.everyTick(this.render.bind(this));
        //alt.log(`Created Native UI! ${this.title}`);
    }

    public DisableInstructionalButtons(disable: boolean) {
        this._buttonsEnabled = !disable;
    }

    public AddInstructionalButton(button: InstructionalButton): void {
        this._instructionalButtons.push(button);
    }

    public SetSpriteBannerType(spriteBanner: Sprite): void {
        this._bannerRectangle = null;
        this.AddSpriteBannerType(spriteBanner);
    }

    public SetRectangleBannerType(rectangle: ResRectangle): void {
        this._bannerSprite = null;
        this._bannerRectangle = rectangle;
        this._bannerRectangle.Pos = new Point(this._offset.X, this._offset.Y);
        this._bannerRectangle.Size = new Size(431 + this.WidthOffset, 107);
    }

    public AddSpriteBannerType(spriteBanner: Sprite): void {
        this._bannerSprite = spriteBanner;
        this._bannerSprite.Size = new Size(431 + this.WidthOffset, 107);
        this._bannerSprite.Pos = new Point(this._offset.X, this._offset.Y);
    }

    public SetNoBannerType(): void {
        this._bannerSprite = null;
        this._bannerRectangle = new ResRectangle(new Point(this._offset.X, this._offset.Y), new Size(431 + this.WidthOffset, 107), new Color(0, 0, 0, 0));
    }

    public RemoveInstructionalButton(button: InstructionalButton): void {
        for (let i = 0; i < this._instructionalButtons.length; i++) {
            if (this._instructionalButtons[i] === button) {
                this._instructionalButtons.splice(i, 1);
            }
        }
    }

    private RecalculateDescriptionPosition() {
        const count = (this.MenuItems.length > this._maxItemsOnScreen + 1) ? this._maxItemsOnScreen + 2 : this.MenuItems.length;

        this._descriptionBar.Size = new Size(431 + this.WidthOffset, 4);
        this._descriptionRectangle.Size = new Size(431 + this.WidthOffset, 30);

        this._descriptionBar.Pos = new Point(this._offset.X, 149 - 37 + this._extraOffset + this._offset.Y);
        this._descriptionRectangle.Pos = new Point(this._offset.X, 149 - 37 + this._extraOffset + this._offset.Y);
        this._descriptionText.Pos = new Point(this._offset.X + 8, 155 - 37 + this._extraOffset + this._offset.Y);

        this._descriptionBar.Pos = new Point(this._offset.X, 38 * count + this._descriptionBar.Pos.Y);
        this._descriptionRectangle.Pos = new Point(this._offset.X, 38 * count + this._descriptionRectangle.Pos.Y);
        this._descriptionText.Pos = new Point(this._offset.X + 8, 38 * count + this._descriptionText.Pos.Y);
    }

    public SetMenuWidthOffset(widthOffset: number) {
        this.WidthOffset = widthOffset;
        if (this._bannerSprite != null) {
            this._bannerSprite.Size = new Size(431 + this.WidthOffset, 107);
        }
        this._mainMenu.Items[0].pos = new Point((this.WidthOffset + this._offset.X + 431) / 2, 20 + this._offset.Y);
        if (this._counterText) {
            this._counterText.Pos = new Point(425 + this._offset.X + widthOffset, 110 + this._offset.Y);
        }
        if (this._mainMenu.Items.length >= 2) {
            const tmp = this._mainMenu.Items[1];
            tmp.size = new Size(431 + this.WidthOffset, 37);
        }
        if (this._bannerRectangle != null) {
            this._bannerRectangle.Size = new Size(431 + this.WidthOffset, 107);
        }
    }

    public AddItem(item: UIMenuItem) {
        if (this._justOpened) this._justOpened = false;
        item.Offset = this._offset;
        item.Parent = this;
        item.SetVerticalPosition(this.MenuItems.length * 25 - 37 + this._extraOffset);
        this.MenuItems.push(item);

        this.RefreshIndex();
    }

    public RemoveItem(item: UIMenuItem) {
        for (let i = 0; i < this.MenuItems.length; i++) {
            if (this.MenuItems[i] === item) {
                this.MenuItems.splice(i, 1);
                break;
            }
        }
        this.RefreshIndex();
    }

    public RefreshIndex() {
        if (this.MenuItems.length == 0) {
            this._activeItem = this._maxMenuItems;
            this._maxItem = this._maxItemsOnScreen;
            this._minItem = 0;
            return;
        }
        for (let i = 0; i < this.MenuItems.length; i++)
            this.MenuItems[i].Selected = false;

        this._activeItem = this._maxMenuItems - (this._maxMenuItems % this.MenuItems.length);
        this._maxItem = this._maxItemsOnScreen;
        this._minItem = 0;
        if (this._visible) {
            this.UpdateDescriptionCaption();
        }
    }

    public Clear() {
        this.MenuItems = [];
        this.RecalculateDescriptionPosition();
    }

    public Open() {
        this.Visible = true;
    }

    private CleanUp(closeChildren: boolean = false) {
        if (closeChildren) {
            this.Children.forEach(m => {
                m.Close(true);
            });
        }
        //Reset current selected value of dynamic list items so they are dynamically set next draw
        this.MenuItems.filter(menuItem => menuItem instanceof UIMenuDynamicListItem).forEach((menuItem: UIMenuDynamicListItem) => {
            menuItem.SelectedValue = undefined;
        });
        this.RefreshIndex();
    }

    public Close(closeChildren: boolean = false) {
        this.Visible = false;
        this.CleanUp(closeChildren);
        this.MenuClose.emit(true);
    }

    public GoLeft() {
        if (!(this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuAutoListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) ||
            !this.MenuItems[this.CurrentSelection].Enabled)
            return;

        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) {
            const it = <UIMenuListItem>this.MenuItems[this.CurrentSelection];
            if (it.Collection.length == 0) return;
            it.Index--;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.ListChange.emit(it, it.Index);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuAutoListItem) {
            const it = <UIMenuAutoListItem>this.MenuItems[this.CurrentSelection];
            if (it.SelectedValue <= it.LowerThreshold) {
                it.SelectedValue = it.UpperThreshold;
            } else {
                it.SelectedValue -= it.LeftMoveThreshold;
            }
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.AutoListChange.emit(it, it.SelectedValue, ChangeDirection.Left);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) {
            const it = <UIMenuDynamicListItem>this.MenuItems[this.CurrentSelection];
            it.SelectionChangeHandlerPromise(it, it.SelectedValue, ChangeDirection.Left).then((newSelectedValue: string) => {
                it.SelectedValue = newSelectedValue;
                this.DynamicListChange.emit(it, it.SelectedValue, ChangeDirection.Left);
            });
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) {
            const it = <UIMenuSliderItem>this.MenuItems[this.CurrentSelection];
            it.Index = it.Index - 1;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.SliderChange.emit(it, it.Index, it.IndexToItem(it.Index));
            this.UpdateDescriptionCaption();
        }
    }

    public GoRight() {
        if (!(this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuAutoListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) ||
            !this.MenuItems[this.CurrentSelection].Enabled)
            return;
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) {
            const it = <UIMenuListItem>this.MenuItems[this.CurrentSelection];
            if (it.Collection.length == 0) return;
            it.Index++;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.ListChange.emit(it, it.Index);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuAutoListItem) {
            const it = <UIMenuAutoListItem>this.MenuItems[this.CurrentSelection];
            if (it.SelectedValue >= it.UpperThreshold) {
                it.SelectedValue = it.LowerThreshold;
            } else {
                it.SelectedValue += it.RightMoveThreshold;
            }
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.AutoListChange.emit(it, it.SelectedValue, ChangeDirection.Right);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) {
            const it = <UIMenuDynamicListItem>this.MenuItems[this.CurrentSelection];
            it.SelectionChangeHandlerPromise(it, it.SelectedValue, ChangeDirection.Right).then((newSelectedValue: string) => {
                it.SelectedValue = newSelectedValue;
                this.DynamicListChange.emit(it, it.SelectedValue, ChangeDirection.Right);
            });
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) {
            const it = <UIMenuSliderItem>this.MenuItems[this.CurrentSelection];
            it.Index++;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.SliderChange.emit(it, it.Index, it.IndexToItem(it.Index));
            this.UpdateDescriptionCaption();
        }
    }

    public SelectItem() {
        if (!this.MenuItems[this.CurrentSelection].Enabled) {
            Common.PlaySound(this.AUDIO_ERROR, this.AUDIO_LIBRARY);
            return;
        }

        const it = <UIMenuCheckboxItem>this.MenuItems[this.CurrentSelection];
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuCheckboxItem) {
            it.Checked = !it.Checked;
            Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
            this.CheckboxChange.emit(it, it.Checked);
        } else {
            Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
            this.ItemSelect.emit(it, this.CurrentSelection);
            if (this.Children.has(it.Id)) {
                const subMenu = this.Children.get(it.Id);
                this.Visible = false;
                subMenu.Visible = true;
                this.MenuChange.emit(subMenu, true);
            }
        }
        it.fireEvent();
    }
    
    public HasCurrentSelectionChildren() {
        const it = <UIMenuCheckboxItem>this.MenuItems[this.CurrentSelection];
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuItem) {
            if (this.Children.has(it.Id)) {
                return true;
            }
        }
        return false;
    }
    
    public IsMouseInListItemArrows(item: UIMenuItem, topLeft: Point, safezone: any) {
        game.beginTextCommandGetWidth("jamyfafi");
        game.addTextComponentSubstringPlayerName(item.Text);
        let res = Screen.ResolutionMaintainRatio;
        let screenw = res.Width;
        let screenh = res.Height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        let width = height * ratio;
        const labelSize = game.endTextCommandGetWidth(false) * width * 0.35;

        const labelSizeX = 5 + labelSize + 10;
        const arrowSizeX = 431 - labelSizeX;
        return Screen.IsMouseInBounds(topLeft, new Size(labelSizeX, 38))
            ? 1
            : Screen.IsMouseInBounds(new Point(topLeft.X + labelSizeX, topLeft.Y), new Size(arrowSizeX, 38))
                ? 2
                : 0;
    }

    public ProcessMouse() {
        if (!this.Visible || this._justOpened || this.MenuItems.length == 0 || !this.MouseControlsEnabled) {
            this.MenuItems.filter(i => i.Hovered).forEach(i => (i.Hovered = false));
            return;
        }

        alt.showCursor(true);
        let limit = this.MenuItems.length - 1;
        let counter = 0;
        if (this.MenuItems.length > this._maxItemsOnScreen + 1)
            limit = this._maxItem;

        if (Screen.IsMouseInBounds(new Point(0, 0), new Size(30, 1080)) && this._mouseEdgeEnabled) {
            game.setGameplayCamRelativeHeading(game.getGameplayCamRelativeHeading() + 5.0);
            game.setMouseCursorSprite(6);
        } else if (Screen.IsMouseInBounds(new Point(Screen.ResolutionMaintainRatio.Width - 30.0, 0), new Size(30, 1080)) && this._mouseEdgeEnabled) {
            game.setGameplayCamRelativeHeading(game.getGameplayCamRelativeHeading() - 5.0);
            game.setMouseCursorSprite(7);
        } else if (this._mouseEdgeEnabled) {
            game.setMouseCursorSprite(1);
        }

        for (let i = this._minItem; i <= limit; i++) {
            let xpos = this._offset.X;
            let ypos = this._offset.Y + 144 - 37 + this._extraOffset + counter * 38;
            // let yposSelected = this._offset.Y + 144 - 37 + this._extraOffset + this._safezoneOffset.Y + this.CurrentSelection * 38;
            let xsize = 431 + this.WidthOffset;
            const ysize = 38;
            const uiMenuItem = this.MenuItems[i];

            if (Screen.IsMouseInBounds(new Point(xpos, ypos), new Size(xsize, ysize))) {
                uiMenuItem.Hovered = true;
                const res = this.IsMouseInListItemArrows(this.MenuItems[i], new Point(xpos, ypos), 0);
                if (uiMenuItem.Hovered && res == 1 && (this.MenuItems[i] instanceof UIMenuListItem || this.MenuItems[i] instanceof UIMenuAutoListItem || this.MenuItems[i] instanceof UIMenuDynamicListItem)) {
                    game.setMouseCursorSprite(5);
                }
                if (game.isControlJustReleased(0, 24) || game.isDisabledControlJustReleased(0, 24))
                    if (uiMenuItem.Selected && uiMenuItem.Enabled) {
                        if ((this.MenuItems[i] instanceof UIMenuListItem || this.MenuItems[i] instanceof UIMenuAutoListItem || this.MenuItems[i] instanceof UIMenuDynamicListItem)
                            && this.IsMouseInListItemArrows(this.MenuItems[i], new Point(xpos, ypos), 0) > 0) {
                            switch (res) {
                                case 1:
                                    Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
                                    //this.MenuItems[i].ItemActivate(this);
                                    this.MenuItems[i].fireEvent();
                                    this.ItemSelect.emit(this.MenuItems[i], i);
                                    break;
                                case 2:
                                    let it = <any>this.MenuItems[i];
                                    if ((it.Collection == null ? it.Items.Count : it.Collection.Count) > 0) {
                                        it.Index++;
                                        Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
                                        this.ListChange.emit(it, it.Index);
                                    }
                                    break;
                            }
                        } else
                            this.SelectItem();
                    } else if (!uiMenuItem.Selected) {
                        this.CurrentSelection = i;
                        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
                        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
                        this.SelectItem();
                        this.UpdateDescriptionCaption();
                        this.UpdateScaleform();
                    } else if (!uiMenuItem.Enabled && uiMenuItem.Selected) {
                        Common.PlaySound(this.AUDIO_ERROR, this.AUDIO_LIBRARY);
                    }
            } else
                uiMenuItem.Hovered = false;
            counter++;
        }

        const extraY = 144 + 38 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset + this._safezoneOffset.Y;
        const extraX = this._safezoneOffset.X + this._offset.X;

        if (this.MenuItems.length <= this._maxItemsOnScreen + 1)
            return;

        if (Screen.IsMouseInBounds(new Point(extraX, extraY), new Size(431 + this.WidthOffset, 18))) {
            this._extraRectangleUp.Color = new Color(30, 30, 30, 255);
            if (game.isControlJustPressed(0, 24) || game.isDisabledControlJustPressed(0, 24)) {
                if (this.MenuItems.length > this._maxItemsOnScreen + 1)
                    this.GoUpOverflow();
                else
                    this.GoUp();
            }
        } else
            this._extraRectangleUp.Color = new Color(0, 0, 0, 200);

        if (Screen.IsMouseInBounds(new Point(extraX, extraY + 18), new Size(431 + this.WidthOffset, 18))) {
            this._extraRectangleDown.Color = new Color(30, 30, 30, 255);
            if (game.isControlJustPressed(0, 24) || game.isDisabledControlJustPressed(0, 24)) {
                if (this.MenuItems.length > this._maxItemsOnScreen + 1)
                    this.GoDownOverflow();
                else
                    this.GoDown();
            }
        } else
            this._extraRectangleDown.Color = new Color(0, 0, 0, 200);
    }

    public ProcessControl() {
        if (!this.Visible)
            return;
        if (this._justOpened) {
            this._justOpened = false;
            return;
        }

        if (game.isControlJustReleased(0, 177)) { // Back            
            this.GoBack();
        }
        if (this.MenuItems.length == 0)
            return;

        if (game.isControlPressed(0, 172) && this._lastUpDownNavigation + 120 < Date.now()) { // Up
            this._lastUpDownNavigation = Date.now();
            if (this.MenuItems.length > this._maxItemsOnScreen + 1)
                this.GoUpOverflow();
            else
                this.GoUp();
            this.UpdateScaleform();
        } else if (game.isControlJustReleased(0, 172)) {
            this._lastUpDownNavigation = 0;
        } else if (game.isControlPressed(0, 173) && this._lastUpDownNavigation + 120 < Date.now()) { // Down
            this._lastUpDownNavigation = Date.now();
            if (this.MenuItems.length > this._maxItemsOnScreen + 1)
                this.GoDownOverflow();
            else
                this.GoDown();
            this.UpdateScaleform();
        } else if (game.isControlJustReleased(0, 173)) {
            this._lastUpDownNavigation = 0;
        } else if (game.isControlPressed(0, 174) && this._lastLeftRightNavigation + 100 < Date.now()) { // Left            
            this._lastLeftRightNavigation = Date.now();
            this.GoLeft();
        } else if (game.isControlJustReleased(0, 174)) {
            this._lastLeftRightNavigation = 0;
        } else if (game.isControlPressed(0, 175) && this._lastLeftRightNavigation + 100 < Date.now()) { // Right            
            this._lastLeftRightNavigation = Date.now();
            this.GoRight();
        } else if (game.isControlJustReleased(0, 175)) {
            this._lastLeftRightNavigation = 0;
        } else if (game.isControlJustReleased(0, 201)) { // Select            
            this.SelectItem();
        }
    }

    public GoUpOverflow() {
        if (this.MenuItems.length <= this._maxItemsOnScreen + 1)
            return;

        if (this._activeItem % this.MenuItems.length <= this._minItem) {
            if (this._activeItem % this.MenuItems.length == 0) {
                this._minItem = this.MenuItems.length - this._maxItemsOnScreen - 1;
                this._maxItem = this.MenuItems.length - 1;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem = this._maxMenuItems - (this._maxMenuItems % this.MenuItems.length);
                this._activeItem += this.MenuItems.length - 1;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            } else {
                this._minItem--;
                this._maxItem--;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem--;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
        } else {
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
            this._activeItem--;
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        }
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }

    public GoUp() {
        if (this.MenuItems.length > this._maxItemsOnScreen + 1)
            return;

        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
        this._activeItem--;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }

    public GoDownOverflow() {
        if (this.MenuItems.length <= this._maxItemsOnScreen + 1)
            return;

        if (this._activeItem % this.MenuItems.length >= this._maxItem) {
            if (this._activeItem % this.MenuItems.length == this.MenuItems.length - 1) {
                this._minItem = 0;
                this._maxItem = this._maxItemsOnScreen;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem = this._maxMenuItems - (this._maxMenuItems % this.MenuItems.length);
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            } else {
                this._minItem++;
                this._maxItem++;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem++;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
        } else {
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
            this._activeItem++;
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        }
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }

    public GoDown() {
        if (this.MenuItems.length > this._maxItemsOnScreen + 1)
            return;

        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
        this._activeItem++;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }

    public GoBack() {
        if (this.ParentMenu != null) {
            this.Visible = false;
            this.ParentMenu.Visible = true;
            this.MenuChange.emit(this.ParentMenu, false);
            this.MenuClose.emit(false);
        } else if (this.CloseableByUser) {
            this.Visible = false;
            this.CleanUp(true);
            this.MenuClose.emit(false);
        }
    }

    public BindMenuToItem(menuToBind: NativeUI, itemToBindTo: UIMenuItem) {
        if (!this.MenuItems.includes(itemToBindTo)) {
            this.AddItem(itemToBindTo);
        }

        menuToBind.ParentMenu = this;
        menuToBind.ParentItem = itemToBindTo;
        this.Children.set(itemToBindTo.Id, menuToBind);
    }

    public AddSubMenu(subMenu: NativeUI, itemToBindTo: UIMenuItem) {
        this.BindMenuToItem(subMenu, itemToBindTo);
    }

    public ReleaseMenuFromItem(releaseFrom: UIMenuItem) {
        if (!this.Children.has(releaseFrom.Id))
            return false;

        const menu: NativeUI = this.Children.get(releaseFrom.Id);
        menu.ParentItem = null;
        menu.ParentMenu = null;
        this.Children.delete(releaseFrom.Id);
        return true;
    }

    public UpdateDescriptionCaption() {
        if (this.MenuItems.length) {
            this._descriptionText.Caption = this.MenuItems[this._activeItem % this.MenuItems.length].Description;
            this._descriptionText.Wrap = 400;
            this._recalculateDescriptionNextFrame++;
        }
    }

    public CalculateDescription() {
        if(this.MenuItems.length <= 0)
            return;

        if (this._recalculateDescriptionNextFrame > 0) {
            this._recalculateDescriptionNextFrame--;
        }

        this.RecalculateDescriptionPosition();
        if (this.MenuItems.length > 0 && this._descriptionText.Caption && this.MenuItems[this._activeItem % this.MenuItems.length].Description.trim() !== "") {
            const numLines = Screen.GetLineCount(this._descriptionText.Caption, this._descriptionText.Pos, this._descriptionText.Font, this._descriptionText.Scale, this._descriptionText.Wrap);

            this._descriptionRectangle.Size = new Size(431 + this.WidthOffset, (numLines * 25) + 15);
            if (numLines === 0) {
                this._recalculateDescriptionNextFrame++;
            }
        }
    }

    public UpdateScaleform() {
        if (!this.Visible || !this._buttonsEnabled)
            return;
        this._instructionalButtonsScaleform.callFunction("CLEAR_ALL");
        this._instructionalButtonsScaleform.callFunction("TOGGLE_MOUSE_BUTTONS", 0 as number);
        this._instructionalButtonsScaleform.callFunction("CREATE_CONTAINER");

        this._instructionalButtonsScaleform.callFunction("SET_DATA_SLOT", 0 as number, game.getControlInstructionalButton(2, Control.PhoneSelect as number, false) as string, this.SelectTextLocalized as string);
        this._instructionalButtonsScaleform.callFunction("SET_DATA_SLOT", 1 as number, game.getControlInstructionalButton(2, Control.PhoneCancel as number, false) as string, this.BackTextLocalized as string);

        let count: number = 2;
        this._instructionalButtons.filter(b => b.ItemBind == null || this.MenuItems[this.CurrentSelection] == b.ItemBind).forEach((button) => {
            this._instructionalButtonsScaleform.callFunction("SET_DATA_SLOT", count as number, button.GetButtonId() as string, button.Text as string);
            count++;
        });

        this._instructionalButtonsScaleform.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", -1 as number);
    }

    private render() {
        if (!this.Visible)
            return;

        if (this._buttonsEnabled) {
            game.drawScaleformMovieFullscreen(this._instructionalButtonsScaleform.handle, 255, 255, 255, 255, 0);
            game.hideHudComponentThisFrame(6); // Vehicle Name
            game.hideHudComponentThisFrame(7); // Area Name
            game.hideHudComponentThisFrame(9); // Street Name
        }

        if (this._justOpened) {
            if (this._bannerSprite != null && !this._bannerSprite.IsTextureDictionaryLoaded)
                this._bannerSprite.LoadTextureDictionary();
            if (!this._background.IsTextureDictionaryLoaded)
                this._background.LoadTextureDictionary();
            if (!this._descriptionRectangle.IsTextureDictionaryLoaded)
                this._descriptionRectangle.LoadTextureDictionary();
            if (!this._upAndDownSprite.IsTextureDictionaryLoaded)
                this._upAndDownSprite.LoadTextureDictionary();
            if (!this._recalculateDescriptionNextFrame)
                this._recalculateDescriptionNextFrame++;
        }
        this._mainMenu.Draw();

        this.ProcessMouse();
        this.ProcessControl();

        this._background.Size = this.MenuItems.length > this._maxItemsOnScreen + 1
            ? new Size(431 + this.WidthOffset, 38 * (this._maxItemsOnScreen + 1))
            : new Size(431 + this.WidthOffset, 38 * this.MenuItems.length);
        this._background.Draw();

        if (this._recalculateDescriptionNextFrame) {
            this.CalculateDescription();
        }

        if (this.MenuItems.length > 0) {
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            if (this.MenuItems[this._activeItem % this.MenuItems.length].Description.trim() !== "") {
                this._descriptionBar.Draw();
                this._descriptionRectangle.Draw();
                this._descriptionText.Draw();
            }
        }

        let count = 0;
        if (this.MenuItems.length <= this._maxItemsOnScreen + 1) {
            for (const item of this.MenuItems) {
                item.SetVerticalPosition(count * 38 - 37 + this._extraOffset);
                item.Draw();
                count++;
            }
            if (this._counterText && this._counterOverride) {
                this._counterText.Caption = this._counterPretext + this._counterOverride;
                this._counterText.Draw();
            }
        } else {
            for (let index = this._minItem; index <= this._maxItem; index++) {
                let item = this.MenuItems[index];
                item.SetVerticalPosition(count * 38 - 37 + this._extraOffset);
                item.Draw();
                count++;
            }

            this._extraRectangleUp.Size = new Size(431 + this.WidthOffset, 18);
            this._extraRectangleDown.Size = new Size(431 + this.WidthOffset, 18);
            this._upAndDownSprite.Pos = new Point(190 + this._offset.X + this.WidthOffset / 2, 147 + 37 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset);

            this._extraRectangleUp.Draw();
            this._extraRectangleDown.Draw();
            this._upAndDownSprite.Draw();

            if (this._counterText) {
                if (!this._counterOverride) {
                    const cap = this.CurrentSelection + 1 + " / " + this.MenuItems.length;
                    this._counterText.Caption = this._counterPretext + cap;
                } else {
                    this._counterText.Caption = this._counterPretext + this._counterOverride;
                }
                this._counterText.Draw();
            }
        }
        
        if (this._bannerRectangle != null)
            this._bannerRectangle.Draw();

        if (this._bannerSprite != null)
            this._bannerSprite.Draw();
    }
}

export {
    NativeUI as Menu,
    UIMenuItem,
    UIMenuListItem,
    UIMenuAutoListItem,
    UIMenuDynamicListItem,
    UIMenuCheckboxItem,
    UIMenuSliderItem,
    BadgeStyle,
    ChangeDirection,
    Font,
    Alignment,
    Control,
    HudColor,
    Sprite,
    ResRectangle,
    InstructionalButton,
    Point,
    Size,
    Color,
    ItemsCollection,
    ListItem,
    BigMessage,
    MidsizedMessage
}