import * as alt from 'alt-client';
import BadgeStyle from "../enums/BadgeStyle";
import Font from "../enums/Font";
import Alignment from "../enums/Alignment";
import NativeUI from "../NativeUi";
import ResRectangle from "../modules/ResRectangle";
import ResText from "../modules/ResText";
import Sprite from "../modules/Sprite";
import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import UUIDV4 from "../utils/UUIDV4";

export default class UIMenuItem {
    public readonly Id: string = UUIDV4();

    public static readonly DefaultBackColor: Color = Color.Empty;
    public static readonly DefaultHighlightedBackColor: Color = Color.White;
    public static readonly DefaultForeColor: Color = Color.WhiteSmoke;
    public static readonly DefaultHighlightedForeColor: Color = Color.Black;

    private _event: { event: string; args: any[] };

    protected _rectangle: ResRectangle;
    protected _text: ResText;
    protected _description: string;
    protected _selectedSprite: Sprite;
    protected _badgeLeft: Sprite;
    protected _badgeRight: Sprite;
    protected _labelText: ResText;

    public BackColor: Color = UIMenuItem.DefaultBackColor;
    public HighlightedBackColor: Color = UIMenuItem.DefaultHighlightedBackColor;

    public ForeColor: Color = UIMenuItem.DefaultForeColor;
    public HighlightedForeColor: Color = UIMenuItem.DefaultHighlightedForeColor;

    public Enabled: boolean;
    public Selected: boolean;
    public Hovered: boolean;
    public Data: any;

    public Offset: Point;
    public Parent: NativeUI;

    public get Text() {
        return this._text.Caption;
    }
    public set Text(text) {
        this._text.Caption = text;
    }

    public get Description() {
        return this._description;
    }
    public set Description(text) {
        this._description = text;
        if (this.hasOwnProperty('Parent')) {
            this.Parent.UpdateDescriptionCaption();
        }
    }

    public RightLabel: string = "";
    public LeftBadge: BadgeStyle = BadgeStyle.None;
    public RightBadge: BadgeStyle = BadgeStyle.None;

    constructor(text: string, description = "", data: any = null) {
        this.Enabled = true;
        this.Data = data;

        this._rectangle = new ResRectangle(new Point(0, 0), new Size(431, 38), new Color(150, 0, 0, 0));
        this._text = new ResText(text, new Point(8, 0), 0.33, Color.WhiteSmoke, Font.ChaletLondon, Alignment.Left);
        this.Description = description;
        this._selectedSprite = new Sprite("commonmenu", "gradient_nav", new Point(0, 0), new Size(431, 38));

        this._badgeLeft = new Sprite("commonmenu", "", new Point(0, 0), new Size(40, 40));
        this._badgeRight = new Sprite("commonmenu", "", new Point(0, 0), new Size(40, 40));

        this._labelText = new ResText("", new Point(0, 0), 0.35, Color.White, 0, Alignment.Right);
    }

    public SetVerticalPosition(y: number) {
        this._rectangle.Pos = new Point(this.Offset.X, y + 144 + this.Offset.Y);
        this._selectedSprite.Pos = new Point(0 + this.Offset.X, y + 144 + this.Offset.Y);
        this._text.Pos = new Point(8 + this.Offset.X, y + 147 + this.Offset.Y);

        this._badgeLeft.Pos = new Point(0 + this.Offset.X, y + 142 + this.Offset.Y);
        this._badgeRight.Pos = new Point(385 + this.Offset.X, y + 142 + this.Offset.Y);

        this._labelText.Pos = new Point(420 + this.Offset.X, y + 148 + this.Offset.Y);
    }

    public addEvent(event: string, ...args: any[]) {
        this._event = { event: event, args: args };
    }

    public fireEvent() {
        if (this._event) {
            alt.emit(this._event.event, ...this._event.args);
        }
    }

    public Draw() {
        this._rectangle.Size = new Size(431 + this.Parent.WidthOffset, 38);
        this._selectedSprite.Size = new Size(431 + this.Parent.WidthOffset, 38);

        if (this.Hovered && !this.Selected) {
            this._rectangle.Color = new Color(255, 255, 255, 20);
            this._rectangle.Draw();
        }

        this._selectedSprite.Color = this.Selected
            ? this.HighlightedBackColor
            : this.BackColor;
        this._selectedSprite.Draw();

        this._text.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);

        if (this.LeftBadge != BadgeStyle.None) {
            this._text.Pos = new Point(35 + this.Offset.X, this._text.Pos.Y);
            this._badgeLeft.TextureDict = this.BadgeToSpriteLib(this.LeftBadge);
            this._badgeLeft.TextureName = this.BadgeToSpriteName(this.LeftBadge, this.Selected);
            this._badgeLeft.Color = this.IsBagdeWhiteSprite(this.LeftBadge)
                ? this.Enabled
                    ? this.Selected
                        ? this.HighlightedForeColor
                        : this.ForeColor
                    : new Color(163, 159, 148)
                : Color.White;
            this._badgeLeft.Draw();
        } else {
            this._text.Pos = new Point(8 + this.Offset.X, this._text.Pos.Y);
        }

        if (this.RightBadge != BadgeStyle.None) {
            this._badgeRight.Pos = new Point(385 + this.Offset.X + this.Parent.WidthOffset, this._badgeRight.Pos.Y);
            this._badgeRight.TextureDict = this.BadgeToSpriteLib(this.RightBadge);
            this._badgeRight.TextureName = this.BadgeToSpriteName(this.RightBadge, this.Selected);
            this._badgeRight.Color = this.IsBagdeWhiteSprite(this.RightBadge)
                ? this.Enabled
                    ? this.Selected
                        ? this.HighlightedForeColor
                        : this.ForeColor
                    : new Color(163, 159, 148)
                : Color.White;
            this._badgeRight.Draw();
        }

        if (this.RightLabel && this.RightLabel !== "") {
            this._labelText.Pos = new Point(420 + this.Offset.X + this.Parent.WidthOffset, this._labelText.Pos.Y);
            this._labelText.Caption = this.RightLabel;
            this._labelText.Color = this._text.Color = this.Enabled
                ? this.Selected
                    ? this.HighlightedForeColor
                    : this.ForeColor
                : new Color(163, 159, 148);
            this._labelText.Draw();
        }
        this._text.Draw();
    }

    public SetLeftBadge(badge: BadgeStyle) {
        this.LeftBadge = badge;
    }

    public SetRightBadge(badge: BadgeStyle) {
        this.RightBadge = badge;
    }

    public SetRightLabel(text: string) {
        this.RightLabel = text;
    }

    public BadgeToSpriteLib(badge: BadgeStyle) {
        switch (badge) {
            case BadgeStyle.Sale:
                return "mpshopsale";
            case BadgeStyle.Audio1:
            case BadgeStyle.Audio2:
            case BadgeStyle.Audio3:
            case BadgeStyle.AudioInactive:
            case BadgeStyle.AudioMute:
                return "mpleaderboard";
            default:
                return "commonmenu";
        }
    }

    public BadgeToSpriteName(badge: BadgeStyle, selected: boolean) {
        switch (badge) {
            case BadgeStyle.None:
                return "";
            case BadgeStyle.BronzeMedal:
                return "mp_medal_bronze";
            case BadgeStyle.GoldMedal:
                return "mp_medal_gold";
            case BadgeStyle.SilverMedal:
                return "medal_silver";
            case BadgeStyle.Alert:
                return "mp_alerttriangle";
            case BadgeStyle.Crown:
                return "mp_hostcrown";
            case BadgeStyle.Ammo:
                return selected ? "shop_ammo_icon_b" : "shop_ammo_icon_a";
            case BadgeStyle.Armour:
                return selected ? "shop_armour_icon_b" : "shop_armour_icon_a";
            case BadgeStyle.Barber:
                return selected ? "shop_barber_icon_b" : "shop_barber_icon_a";
            case BadgeStyle.Clothes:
                return selected ? "shop_clothing_icon_b" : "shop_clothing_icon_a";
            case BadgeStyle.Franklin:
                return selected ? "shop_franklin_icon_b" : "shop_franklin_icon_a";
            case BadgeStyle.Bike:
                return selected ? "shop_garage_bike_icon_b" : "shop_garage_bike_icon_a";
            case BadgeStyle.Car:
                return selected ? "shop_garage_icon_b" : "shop_garage_icon_a";
            case BadgeStyle.Gun:
                return selected ? "shop_gunclub_icon_b" : "shop_gunclub_icon_a";
            case BadgeStyle.Heart:
                return selected ? "shop_health_icon_b" : "shop_health_icon_a";
            case BadgeStyle.Lock:
                return "shop_lock";
            case BadgeStyle.Makeup:
                return selected ? "shop_makeup_icon_b" : "shop_makeup_icon_a";
            case BadgeStyle.Mask:
                return selected ? "shop_mask_icon_b" : "shop_mask_icon_a";
            case BadgeStyle.Michael:
                return selected ? "shop_michael_icon_b" : "shop_michael_icon_a";
            case BadgeStyle.Star:
                return "shop_new_star";
            case BadgeStyle.Tatoo:
                return selected ? "shop_tattoos_icon_b" : "shop_tattoos_icon_";
            case BadgeStyle.Tick:
                return "shop_tick_icon";
            case BadgeStyle.Trevor:
                return selected ? "shop_trevor_icon_b" : "shop_trevor_icon_a";
            case BadgeStyle.Sale:
                return "saleicon";
            case BadgeStyle.ArrowLeft:
                return "arrowleft";
            case BadgeStyle.ArrowRight:
                return "arrowright";
            case BadgeStyle.Audio1:
                return "leaderboard_audio_1";
            case BadgeStyle.Audio2:
                return "leaderboard_audio_2";
            case BadgeStyle.Audio3:
                return "leaderboard_audio_3";
            case BadgeStyle.AudioInactive:
                return "leaderboard_audio_inactive";
            case BadgeStyle.AudioMute:
                return "leaderboard_audio_mute";
            default:
                return "";
        }
    }

    public IsBagdeWhiteSprite(badge: BadgeStyle) {
        switch (badge) {
            case BadgeStyle.Lock:
            case BadgeStyle.Tick:
            case BadgeStyle.Crown:
                return true;
            default:
                return false;
        }
    }

    public BadgeToColor(badge: BadgeStyle, selected: boolean): Color {
        switch (badge) {
            case BadgeStyle.Lock:
            case BadgeStyle.Tick:
            case BadgeStyle.Crown:
                return selected
                    ? new Color(255, 0, 0, 0)
                    : new Color(255, 255, 255, 255);
            default:
                return new Color(255, 255, 255, 255);
        }
    }
}