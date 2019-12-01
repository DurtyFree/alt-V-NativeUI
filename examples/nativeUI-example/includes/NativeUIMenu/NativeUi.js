import * as alt from 'alt';
import game from 'natives';
import BadgeStyle from "./enums/BadgeStyle";
import Font from "./enums/Font";
import Alignment from './enums/Alignment';
import Control from './enums/Control';
import UIMenuCheckboxItem from "./items/UIMenuCheckboxItem";
import UIMenuItem from "./items/UIMenuItem";
import UIMenuListItem from "./items/UIMenuListItem";
import UIMenuDynamicListItem from "./items/UIMenuDynamicListItem";
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
import { Screen } from "./utils/Screen";
import InstructionalButton from './modules/InstructionalButton';
import Scaleform from './utils/Scaleform';
let menuPool = [];
export default class NativeUI {
    constructor(title, subtitle, offset, spriteLibrary, spriteName) {
        this.Id = UUIDV4();
        this._visible = true;
        this.counterPretext = "";
        this.counterOverride = undefined;
        this.instructionalButtons = [];
        this.lastUpDownNavigation = 0;
        this.lastLeftRightNavigation = 0;
        this.extraOffset = 0;
        this.ParentMenu = null;
        this.ParentItem = null;
        this._titleScale = 1.15;
        this.WidthOffset = 0;
        this.MouseControlsEnabled = false;
        this._buttonsEnabled = true;
        this._justOpened = true;
        this._justOpenedFromPool = false;
        this._justClosedFromPool = false;
        this._poolOpening = null;
        this.safezoneOffset = new Point(0, 0);
        this._activeItem = 1000;
        this.MaxItemsOnScreen = 9;
        this._maxItem = this.MaxItemsOnScreen;
        this.selectTextLocalized = alt.getGxtText("HUD_INPUT2");
        this.backTextLocalized = alt.getGxtText("HUD_INPUT3");
        this.recalculateDescriptionNextFrame = 1;
        this.AUDIO_LIBRARY = "HUD_FRONTEND_DEFAULT_SOUNDSET";
        this.AUDIO_UPDOWN = "NAV_UP_DOWN";
        this.AUDIO_LEFTRIGHT = "NAV_LEFT_RIGHT";
        this.AUDIO_SELECT = "SELECT";
        this.AUDIO_BACK = "BACK";
        this.AUDIO_ERROR = "ERROR";
        this.MenuItems = [];
        this.IndexChange = new LiteEvent();
        this.ListChange = new LiteEvent();
        this.DynamicListChange = new LiteEvent();
        this.SliderChange = new LiteEvent();
        this.CheckboxChange = new LiteEvent();
        this.ItemSelect = new LiteEvent();
        this.MenuOpen = new LiteEvent();
        this.MenuClose = new LiteEvent();
        this.MenuChange = new LiteEvent();
        this.MouseEdgeEnabled = true;
        if (!(offset instanceof Point))
            offset = Point.Parse(offset);
        this.title = title;
        this.subtitle = subtitle;
        this.spriteLibrary = spriteLibrary || "commonmenu";
        this.spriteName = spriteName || "interaction_bgd";
        this.offset = new Point(offset.X, offset.Y);
        this.Children = new Map();
        this.instructionalButtonsScaleform = new Scaleform("instructional_buttons");
        this.UpdateScaleform();
        this._mainMenu = new Container(new Point(0, 0), new Size(700, 500), new Color(0, 0, 0, 0));
        this._logo = new Sprite(this.spriteLibrary, this.spriteName, new Point(0 + this.offset.X, 0 + this.offset.Y), new Size(431, 107));
        this._mainMenu.addItem((this._title = new ResText(this.title, new Point(215 + this.offset.X, 20 + this.offset.Y), this._titleScale, new Color(255, 255, 255), 1, Alignment.Centered)));
        if (this.subtitle !== "") {
            this._mainMenu.addItem(new ResRectangle(new Point(0 + this.offset.X, 107 + this.offset.Y), new Size(431, 37), new Color(0, 0, 0, 255)));
            this._mainMenu.addItem((this._subtitle = new ResText(this.subtitle, new Point(8 + this.offset.X, 110 + this.offset.Y), 0.35, new Color(255, 255, 255), 0, Alignment.Left)));
            if (this.subtitle.startsWith("~")) {
                this.counterPretext = this.subtitle.substr(0, 3);
            }
            this._counterText = new ResText("", new Point(425 + this.offset.X, 110 + this.offset.Y), 0.35, new Color(255, 255, 255), 0, Alignment.Right);
            this.extraOffset += 37;
        }
        this._upAndDownSprite = new Sprite("commonmenu", "shop_arrows_upanddown", new Point(190 + this.offset.X, 147 +
            37 * (this.MaxItemsOnScreen + 1) +
            this.offset.Y -
            37 +
            this.extraOffset), new Size(50, 50));
        this._extraRectangleUp = new ResRectangle(new Point(0 + this.offset.X, 144 +
            38 * (this.MaxItemsOnScreen + 1) +
            this.offset.Y -
            37 +
            this.extraOffset), new Size(431, 18), new Color(0, 0, 0, 200));
        this._extraRectangleDown = new ResRectangle(new Point(0 + this.offset.X, 144 +
            18 +
            38 * (this.MaxItemsOnScreen + 1) +
            this.offset.Y -
            37 +
            this.extraOffset), new Size(431, 18), new Color(0, 0, 0, 200));
        this._descriptionBar = new ResRectangle(new Point(this.offset.X, 123), new Size(431, 4), Color.Black);
        this._descriptionRectangle = new Sprite("commonmenu", "gradient_bgd", new Point(this.offset.X, 127), new Size(431, 30));
        this._descriptionText = new ResText("", new Point(this.offset.X + 5, 125), 0.35, new Color(255, 255, 255, 255), Font.ChaletLondon, Alignment.Left);
        this._background = new Sprite("commonmenu", "gradient_bgd", new Point(this.offset.X, 144 + this.offset.Y - 37 + this.extraOffset), new Size(290, 25));
        this._visible = false;
        alt.everyTick(this.render.bind(this));
    }
    get TitleScale() {
        return this._titleScale;
    }
    set TitleScale(scale) {
        this._titleScale = scale;
    }
    get Visible() {
        return this._visible;
    }
    set Visible(toggle) {
        this._visible = toggle;
        Common.PlaySound(this.AUDIO_BACK, this.AUDIO_LIBRARY);
        this.UpdateScaleform();
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
                    if (previousMenu !== this._poolOpening && previousMenu !== null) {
                        previousMenu._justClosedFromPool = true;
                        previousMenu.Visible = false;
                    }
                }
            }
        }
        else {
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
                }
                if (menuPool.length) {
                    this._poolOpening = menuPool[menuPool.length - 1];
                    menuPool[menuPool.length - 1].Visible = true;
                }
            }
            if (menuPool.length === 0) {
                game.setMouseCursorSprite(1);
            }
        }
    }
    get CurrentSelection() {
        return this._activeItem % this.MenuItems.length;
    }
    set CurrentSelection(v) {
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
        this._activeItem = 1000 - (1000 % this.MenuItems.length) + v;
        if (this.CurrentSelection > this._maxItem) {
            this._maxItem = this.CurrentSelection;
            this._minItem = this.CurrentSelection - this.MaxItemsOnScreen;
        }
        else if (this.CurrentSelection < this._minItem) {
            this._maxItem = this.MaxItemsOnScreen + this.CurrentSelection;
            this._minItem = this.CurrentSelection;
        }
        this.UpdateDescriptionCaption();
    }
    DisableInstructionalButtons(disable) {
        this._buttonsEnabled = !disable;
    }
    AddInstructionalButton(button) {
        this.instructionalButtons.push(button);
    }
    RemoveInstructionalButton(button) {
        for (let i = 0; i < this.instructionalButtons.length; i++) {
            if (this.instructionalButtons[i] === button) {
                this.instructionalButtons.splice(i, 1);
            }
        }
    }
    RecalculateDescriptionPosition() {
        const count = (this.MenuItems.length > this.MaxItemsOnScreen + 1) ? this.MaxItemsOnScreen + 2 : this.MenuItems.length;
        this._descriptionBar.size = new Size(431 + this.WidthOffset, 4);
        this._descriptionRectangle.size = new Size(431 + this.WidthOffset, 30);
        this._descriptionBar.pos = new Point(this.offset.X, 149 - 37 + this.extraOffset + this.offset.Y);
        this._descriptionRectangle.pos = new Point(this.offset.X, 149 - 37 + this.extraOffset + this.offset.Y);
        this._descriptionText.pos = new Point(this.offset.X + 8, 155 - 37 + this.extraOffset + this.offset.Y);
        this._descriptionBar.pos = new Point(this.offset.X, 38 * count + this._descriptionBar.pos.Y);
        this._descriptionRectangle.pos = new Point(this.offset.X, 38 * count + this._descriptionRectangle.pos.Y);
        this._descriptionText.pos = new Point(this.offset.X + 8, 38 * count + this._descriptionText.pos.Y);
    }
    SetMenuWidthOffset(widthOffset) {
        this.WidthOffset = widthOffset;
        if (this._logo != null) {
            this._logo.size = new Size(431 + this.WidthOffset, 107);
        }
        this._mainMenu.Items[0].pos = new Point((this.WidthOffset + this.offset.X + 431) / 2, 20 + this.offset.Y);
        if (this._counterText) {
            this._counterText.pos = new Point(425 + this.offset.X + widthOffset, 110 + this.offset.Y);
        }
        if (this._mainMenu.Items.length >= 2) {
            const tmp = this._mainMenu.Items[1];
            tmp.size = new Size(431 + this.WidthOffset, 37);
        }
    }
    AddItem(item) {
        if (this._justOpened)
            this._justOpened = false;
        item.Offset = this.offset;
        item.Parent = this;
        item.SetVerticalPosition(this.MenuItems.length * 25 - 37 + this.extraOffset);
        this.MenuItems.push(item);
        this.RefreshIndex();
    }
    RemoveItem(item) {
        for (let i = 0; i < this.MenuItems.length; i++) {
            if (this.MenuItems[i] === item) {
                this.MenuItems.splice(i, 1);
            }
        }
        this.RefreshIndex();
    }
    RefreshIndex() {
        if (this.MenuItems.length == 0) {
            this._activeItem = 1000;
            this._maxItem = this.MaxItemsOnScreen;
            this._minItem = 0;
            return;
        }
        for (let i = 0; i < this.MenuItems.length; i++)
            this.MenuItems[i].Selected = false;
        this._activeItem = 1000 - (1000 % this.MenuItems.length);
        this._maxItem = this.MaxItemsOnScreen;
        this._minItem = 0;
        if (this._visible) {
            this.UpdateDescriptionCaption();
        }
    }
    Clear() {
        this.MenuItems = [];
        this.RecalculateDescriptionPosition();
    }
    Open() {
        this.Visible = true;
    }
    CleanUp(closeChildren = false) {
        if (closeChildren) {
            this.Children.forEach(m => {
                m.Close(true);
            });
        }
        this.RefreshIndex();
    }
    Close(closeChildren = false) {
        this.Visible = false;
        this.CleanUp(closeChildren);
        this.MenuClose.emit(true);
    }
    set Subtitle(text) {
        this.subtitle = text;
        this._subtitle.caption = text;
    }
    GoLeft() {
        if (!(this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) ||
            !this.MenuItems[this.CurrentSelection].Enabled)
            return;
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            if (it.Collection.length == 0)
                return;
            it.Index--;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.ListChange.emit(it, it.Index);
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            if (it.SelectedValue <= it.LowerThreshold) {
                it.SelectedValue = it.UpperThreshold;
            }
            else {
                it.SelectedValue -= it.LeftMoveThreshold;
            }
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.DynamicListChange.emit(it, it.SelectedValue);
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) {
            const it = this.MenuItems[this.CurrentSelection];
            it.Index = it.Index - 1;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.SliderChange.emit(it, it.Index, it.IndexToItem(it.Index));
        }
    }
    GoRight() {
        if (!(this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) ||
            !this.MenuItems[this.CurrentSelection].Enabled)
            return;
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            if (it.Collection.length == 0)
                return;
            it.Index++;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.ListChange.emit(it, it.Index);
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            if (it.SelectedValue >= it.UpperThreshold) {
                it.SelectedValue = it.LowerThreshold;
            }
            else {
                it.SelectedValue += it.RightMoveThreshold;
            }
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.DynamicListChange.emit(it, it.SelectedValue);
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) {
            const it = this.MenuItems[this.CurrentSelection];
            it.Index++;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.SliderChange.emit(it, it.Index, it.IndexToItem(it.Index));
        }
    }
    SelectItem() {
        if (!this.MenuItems[this.CurrentSelection].Enabled) {
            Common.PlaySound(this.AUDIO_ERROR, this.AUDIO_LIBRARY);
            return;
        }
        const it = this.MenuItems[this.CurrentSelection];
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuCheckboxItem) {
            it.Checked = !it.Checked;
            Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
            this.CheckboxChange.emit(it, it.Checked);
        }
        else {
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
    IsMouseInListItemArrows(item, topLeft, safezone) {
        game.beginTextCommandGetWidth("jamyfafi");
        game.addTextComponentSubstringPlayerName(item.Text);
        let res = Screen.ResolutionMaintainRatio();
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
    ProcessMouse() {
        if (!this.Visible ||
            this._justOpened ||
            this.MenuItems.length == 0 ||
            !this.MouseControlsEnabled) {
            this.MenuItems.filter(i => i.Hovered).forEach(i => (i.Hovered = false));
            return;
        }
        alt.showCursor(true);
        let limit = this.MenuItems.length - 1;
        let counter = 0;
        if (this.MenuItems.length > this.MaxItemsOnScreen + 1)
            limit = this._maxItem;
        if (Screen.IsMouseInBounds(new Point(0, 0), new Size(30, 1080)) &&
            this.MouseEdgeEnabled) {
            game.setGameplayCamRelativeHeading(game.getGameplayCamRelativeHeading() + 5.0);
            game.setMouseCursorSprite(6);
        }
        else if (Screen.IsMouseInBounds(new Point(Screen.ResolutionMaintainRatio().Width - 30.0, 0), new Size(30, 1080)) &&
            this.MouseEdgeEnabled) {
            game.setGameplayCamRelativeHeading(game.getGameplayCamRelativeHeading() - 5.0);
            game.setMouseCursorSprite(7);
        }
        else if (this.MouseEdgeEnabled) {
            game.setMouseCursorSprite(1);
        }
        for (let i = this._minItem; i <= limit; i++) {
            let xpos = this.offset.X;
            let ypos = this.offset.Y + 144 - 37 + this.extraOffset + counter * 38;
            let yposSelected = this.offset.Y + 144 - 37 + this.extraOffset + this.safezoneOffset.Y + this.CurrentSelection * 38;
            let xsize = 431 + this.WidthOffset;
            const ysize = 38;
            const uiMenuItem = this.MenuItems[i];
            if (Screen.IsMouseInBounds(new Point(xpos, ypos), new Size(xsize, ysize))) {
                uiMenuItem.Hovered = true;
                const res = this.IsMouseInListItemArrows(this.MenuItems[i], new Point(xpos, ypos), 0);
                if (uiMenuItem.Hovered && res == 1 && (this.MenuItems[i] instanceof UIMenuListItem || this.MenuItems[i] instanceof UIMenuDynamicListItem)) {
                    game.setMouseCursorSprite(5);
                }
                if (game.isControlJustPressed(0, 24) ||
                    game.isDisabledControlJustPressed(0, 24))
                    if (uiMenuItem.Selected && uiMenuItem.Enabled) {
                        if ((this.MenuItems[i] instanceof UIMenuListItem || this.MenuItems[i] instanceof UIMenuDynamicListItem) &&
                            this.IsMouseInListItemArrows(this.MenuItems[i], new Point(xpos, ypos), 0) > 0) {
                            switch (res) {
                                case 1:
                                    Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
                                    this.MenuItems[i].fireEvent();
                                    this.ItemSelect.emit(this.MenuItems[i], i);
                                    break;
                                case 2:
                                    let it = this.MenuItems[i];
                                    if ((it.Collection == null
                                        ? it.Items.Count
                                        : it.Collection.Count) > 0) {
                                        it.Index++;
                                        Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
                                        this.ListChange.emit(it, it.Index);
                                    }
                                    break;
                            }
                        }
                        else
                            this.SelectItem();
                    }
                    else if (!uiMenuItem.Selected) {
                        this.CurrentSelection = i;
                        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
                        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
                        this.SelectItem();
                        this.UpdateDescriptionCaption();
                        this.UpdateScaleform();
                    }
                    else if (!uiMenuItem.Enabled && uiMenuItem.Selected) {
                        Common.PlaySound(this.AUDIO_ERROR, this.AUDIO_LIBRARY);
                    }
            }
            else
                uiMenuItem.Hovered = false;
            counter++;
        }
        const extraY = 144 +
            38 * (this.MaxItemsOnScreen + 1) +
            this.offset.Y -
            37 +
            this.extraOffset +
            this.safezoneOffset.Y;
        const extraX = this.safezoneOffset.X + this.offset.X;
        if (this.MenuItems.length <= this.MaxItemsOnScreen + 1)
            return;
        if (Screen.IsMouseInBounds(new Point(extraX, extraY), new Size(431 + this.WidthOffset, 18))) {
            this._extraRectangleUp.color = new Color(30, 30, 30, 255);
            if (game.isControlJustPressed(0, 24) ||
                game.isDisabledControlJustPressed(0, 24)) {
                if (this.MenuItems.length > this.MaxItemsOnScreen + 1)
                    this.GoUpOverflow();
                else
                    this.GoUp();
            }
        }
        else
            this._extraRectangleUp.color = new Color(0, 0, 0, 200);
        if (Screen.IsMouseInBounds(new Point(extraX, extraY + 18), new Size(431 + this.WidthOffset, 18))) {
            this._extraRectangleDown.color = new Color(30, 30, 30, 255);
            if (game.isControlJustPressed(0, 24) ||
                game.isDisabledControlJustPressed(0, 24)) {
                if (this.MenuItems.length > this.MaxItemsOnScreen + 1)
                    this.GoDownOverflow();
                else
                    this.GoDown();
            }
        }
        else
            this._extraRectangleDown.color = new Color(0, 0, 0, 200);
    }
    ProcessControl() {
        if (!this.Visible)
            return;
        if (this._justOpened) {
            this._justOpened = false;
            return;
        }
        if (game.isControlJustReleased(0, 177)) {
            this.GoBack();
        }
        if (this.MenuItems.length == 0)
            return;
        if (game.isControlPressed(0, 172) &&
            this.lastUpDownNavigation + 120 < Date.now()) {
            this.lastUpDownNavigation = Date.now();
            if (this.MenuItems.length > this.MaxItemsOnScreen + 1)
                this.GoUpOverflow();
            else
                this.GoUp();
            this.UpdateScaleform();
        }
        else if (game.isControlJustReleased(0, 172)) {
            this.lastUpDownNavigation = 0;
        }
        else if (game.isControlPressed(0, 173) &&
            this.lastUpDownNavigation + 120 < Date.now()) {
            this.lastUpDownNavigation = Date.now();
            if (this.MenuItems.length > this.MaxItemsOnScreen + 1)
                this.GoDownOverflow();
            else
                this.GoDown();
            this.UpdateScaleform();
        }
        else if (game.isControlJustReleased(0, 173)) {
            this.lastUpDownNavigation = 0;
        }
        else if (game.isControlPressed(0, 174) &&
            this.lastLeftRightNavigation + 100 < Date.now()) {
            this.lastLeftRightNavigation = Date.now();
            this.GoLeft();
        }
        else if (game.isControlJustReleased(0, 174)) {
            this.lastLeftRightNavigation = 0;
        }
        else if (game.isControlPressed(0, 175) &&
            this.lastLeftRightNavigation + 100 < Date.now()) {
            this.lastLeftRightNavigation = Date.now();
            this.GoRight();
        }
        else if (game.isControlJustReleased(0, 175)) {
            this.lastLeftRightNavigation = 0;
        }
        else if (game.isControlJustPressed(0, 201)) {
            this.SelectItem();
        }
    }
    GoUpOverflow() {
        if (this.MenuItems.length <= this.MaxItemsOnScreen + 1)
            return;
        if (this._activeItem % this.MenuItems.length <= this._minItem) {
            if (this._activeItem % this.MenuItems.length == 0) {
                this._minItem = this.MenuItems.length - this.MaxItemsOnScreen - 1;
                this._maxItem = this.MenuItems.length - 1;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem = 1000 - (1000 % this.MenuItems.length);
                this._activeItem += this.MenuItems.length - 1;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
            else {
                this._minItem--;
                this._maxItem--;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem--;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
        }
        else {
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
            this._activeItem--;
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        }
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }
    GoUp() {
        if (this.MenuItems.length > this.MaxItemsOnScreen + 1)
            return;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
        this._activeItem--;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }
    GoDownOverflow() {
        if (this.MenuItems.length <= this.MaxItemsOnScreen + 1)
            return;
        if (this._activeItem % this.MenuItems.length >= this._maxItem) {
            if (this._activeItem % this.MenuItems.length ==
                this.MenuItems.length - 1) {
                this._minItem = 0;
                this._maxItem = this.MaxItemsOnScreen;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem = 1000 - (1000 % this.MenuItems.length);
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
            else {
                this._minItem++;
                this._maxItem++;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem++;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
        }
        else {
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
            this._activeItem++;
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        }
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }
    GoDown() {
        if (this.MenuItems.length > this.MaxItemsOnScreen + 1)
            return;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
        this._activeItem++;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }
    GoBack() {
        this.Visible = false;
        if (this.ParentMenu != null) {
            this.ParentMenu.Visible = true;
            this.MenuChange.emit(this.ParentMenu, false);
        }
        else {
            this.CleanUp(true);
        }
        this.MenuClose.emit(false);
    }
    BindMenuToItem(menuToBind, itemToBindTo) {
        if (!this.MenuItems.includes(itemToBindTo)) {
            this.AddItem(itemToBindTo);
        }
        menuToBind.ParentMenu = this;
        menuToBind.ParentItem = itemToBindTo;
        this.Children.set(itemToBindTo.Id, menuToBind);
    }
    AddSubMenu(subMenu, itemToBindTo) {
        this.BindMenuToItem(subMenu, itemToBindTo);
    }
    ReleaseMenuFromItem(releaseFrom) {
        if (!this.Children.has(releaseFrom.Id))
            return false;
        const menu = this.Children.get(releaseFrom.Id);
        menu.ParentItem = null;
        menu.ParentMenu = null;
        this.Children.delete(releaseFrom.Id);
        return true;
    }
    UpdateDescriptionCaption() {
        if (this.MenuItems.length) {
            this._descriptionText.caption = this.MenuItems[this._activeItem % this.MenuItems.length].Description;
            this._descriptionText.Wrap = 400;
            this.recalculateDescriptionNextFrame++;
        }
    }
    CalculateDescription() {
        if (this.recalculateDescriptionNextFrame > 0) {
            this.recalculateDescriptionNextFrame--;
        }
        this.RecalculateDescriptionPosition();
        if (this.MenuItems.length > 0 && this._descriptionText.caption && this.MenuItems[this._activeItem % this.MenuItems.length].Description.trim() !== "") {
            const numLines = Screen.GetLineCount(this._descriptionText.caption, this._descriptionText.pos, this._descriptionText.font, this._descriptionText.scale, this._descriptionText.Wrap);
            this._descriptionRectangle.size = new Size(431 + this.WidthOffset, (numLines * 25) + 15);
            if (numLines === 0) {
                this.recalculateDescriptionNextFrame++;
            }
        }
    }
    UpdateScaleform() {
        if (!this.Visible || !this._buttonsEnabled)
            return;
        this.instructionalButtonsScaleform.callFunction("CLEAR_ALL");
        this.instructionalButtonsScaleform.callFunction("TOGGLE_MOUSE_BUTTONS", 0);
        this.instructionalButtonsScaleform.callFunction("CREATE_CONTAINER");
        this.instructionalButtonsScaleform.callFunction("SET_DATA_SLOT", 0, game.getControlInstructionalButton(2, Control.PhoneSelect, false), this.selectTextLocalized);
        this.instructionalButtonsScaleform.callFunction("SET_DATA_SLOT", 1, game.getControlInstructionalButton(2, Control.PhoneCancel, false), this.backTextLocalized);
        let count = 2;
        this.instructionalButtons.filter(b => b.ItemBind == null || this.MenuItems[this.CurrentSelection] == b.ItemBind).forEach((button) => {
            this.instructionalButtonsScaleform.callFunction("SET_DATA_SLOT", count, button.GetButtonId(), button.Text);
            count++;
        });
        this.instructionalButtonsScaleform.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", -1);
    }
    render() {
        if (!this.Visible)
            return;
        if (this._buttonsEnabled) {
            game.drawScaleformMovieFullscreen(this.instructionalButtonsScaleform.handle, 255, 255, 255, 255, 0);
            game.hideHudComponentThisFrame(6);
            game.hideHudComponentThisFrame(7);
            game.hideHudComponentThisFrame(9);
        }
        if (this._justOpened) {
            if (this._logo != null && !this._logo.IsTextureDictionaryLoaded)
                this._logo.LoadTextureDictionary();
            if (!this._background.IsTextureDictionaryLoaded)
                this._background.LoadTextureDictionary();
            if (!this._descriptionRectangle.IsTextureDictionaryLoaded)
                this._descriptionRectangle.LoadTextureDictionary();
            if (!this._upAndDownSprite.IsTextureDictionaryLoaded)
                this._upAndDownSprite.LoadTextureDictionary();
            if (!this.recalculateDescriptionNextFrame)
                this.recalculateDescriptionNextFrame++;
        }
        this._mainMenu.Draw();
        this.ProcessMouse();
        this.ProcessControl();
        this._background.size =
            this.MenuItems.length > this.MaxItemsOnScreen + 1
                ? new Size(431 + this.WidthOffset, 38 * (this.MaxItemsOnScreen + 1))
                : new Size(431 + this.WidthOffset, 38 * this.MenuItems.length);
        this._background.Draw();
        if (this.recalculateDescriptionNextFrame) {
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
        if (this.MenuItems.length <= this.MaxItemsOnScreen + 1) {
            for (const item of this.MenuItems) {
                item.SetVerticalPosition(count * 38 - 37 + this.extraOffset);
                item.Draw();
                count++;
            }
            if (this._counterText && this.counterOverride) {
                this._counterText.caption = this.counterPretext + this.counterOverride;
                this._counterText.Draw();
            }
        }
        else {
            for (let index = this._minItem; index <= this._maxItem; index++) {
                let item = this.MenuItems[index];
                item.SetVerticalPosition(count * 38 - 37 + this.extraOffset);
                item.Draw();
                count++;
            }
            this._extraRectangleUp.size = new Size(431 + this.WidthOffset, 18);
            this._extraRectangleDown.size = new Size(431 + this.WidthOffset, 18);
            this._upAndDownSprite.pos = new Point(190 + this.offset.X + this.WidthOffset / 2, 147 +
                37 * (this.MaxItemsOnScreen + 1) +
                this.offset.Y -
                37 +
                this.extraOffset);
            this._extraRectangleUp.Draw();
            this._extraRectangleDown.Draw();
            this._upAndDownSprite.Draw();
            if (this._counterText) {
                if (!this.counterOverride) {
                    const cap = this.CurrentSelection + 1 + " / " + this.MenuItems.length;
                    this._counterText.caption = this.counterPretext + cap;
                }
                else {
                    this._counterText.caption =
                        this.counterPretext + this.counterOverride;
                }
                this._counterText.Draw();
            }
        }
        this._logo.Draw();
    }
}
export { NativeUI as Menu, UIMenuItem, UIMenuListItem, UIMenuDynamicListItem, UIMenuCheckboxItem, UIMenuSliderItem, BadgeStyle, Font, Alignment, Control, InstructionalButton, Point, Size, Color, ItemsCollection, ListItem };
