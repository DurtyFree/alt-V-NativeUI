import * as alt from 'alt-client';
import * as game from 'natives';
import * as NativeUI from './includes/NativeUI/NativeUI';

// Simple menu with default banner
const menu = new NativeUI.Menu("NativeUI Test", "Test Subtitle", new NativeUI.Point(50, 50));

// Use custom banner for menu
// See https://pastebin.com/R5AbQJqb or https://github.com/jorjic/fivem-docs/wiki/Sprite-List for a full list of sprites
//const menu = new NativeUI.Menu("", "You want that durty look?", new NativeUI.Point(50, 50));
//var banner = new NativeUI.Sprite("shopui_title_barber", "shopui_title_barber", new NativeUI.Point(0, 0), new NativeUI.Size(0, 0));
//menu.SetSpriteBannerType(banner);

// Use custom banner with rectangle background
//const menu = new NativeUI.Menu("Shop", "Shit you need, almost free", new NativeUI.Point(50, 50));
//var rectangle = new NativeUI.ResRectangle(new NativeUI.Point(0, 0), new NativeUI.Size(0,0), new NativeUI.Color(0, 0, 0, 255)); 
//menu.SetRectangleBannerType(rectangle);
//var banner = new NativeUI.Sprite("mpshops", "shopui_title_graphics_sale", new NativeUI.Point(0, 0), new NativeUI.Size(0, 0));
//menu.AddSpriteBannerType(banner);

// Use rectangle banner for "plain colors"
//const menu = new NativeUI.Menu("NativeUI Test", "Test plain menu", new NativeUI.Point(50, 50));
////We only care about color for rectangle banner type, position & size is set automatically
//var banner = new NativeUI.ResRectangle(new NativeUI.Point(0, 0), new NativeUI.Size(0,0), new NativeUI.Color(200, 200, 200, 255)); 
//menu.SetRectangleBannerType(banner);

// We can also have no banner at all
//const menu = new NativeUI.Menu("", "Banner less menu", new NativeUI.Point(50, -57)); //Optional offset the menu -107 (banner height is 107) to have no offset at all
//menu.SetNoBannerType();

// Some customization
//menu.Visible = false; //Menus are visible per default
//menu.DisableInstructionalButtons(true); //Instructional Buttons are enabled per default
menu.GetTitle().Scale = 1.5; // Change title scale
menu.GetTitle().DropShadow = true;
//menu.GetTitle().Color = new NativeUI.Color(42, 187, 155, 255); //Green Title

// Instructional buttons
let respectButton = new NativeUI.InstructionalButton("To pay respect", 0, "F");
menu.AddInstructionalButton(respectButton);

// Menu Items
menu.AddItem(new NativeUI.UIMenuListItem(
    "List Item",
    "Description for List Item",
    new NativeUI.ItemsCollection(["Item 1", "Item 2", "Item 3"])
));

menu.AddItem(new NativeUI.UIMenuSliderItem(
    "Slider Item",
    ["Fugiat", "pariatur", "consectetur", "ex", "duis", "magna", "nostrud", "et", "dolor", "laboris"],
    5,
    "Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint.",
    true
));

menu.AddItem(new NativeUI.UIMenuCheckboxItem(
    "Checkbox Item",
    false,
    "Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint."
));

menu.AddItem(new NativeUI.UIMenuItem(
    "Dumb menu item",
    "Just a menu item description"
));

const maxListItems = 100;
let itemData = {
    name: "test",
    data: "great"
};
let autoListItem = new NativeUI.UIMenuAutoListItem(
    'Auto list item: Write number',
    `I want to write ~y~${maxListItems}~s~ in console.`,
    -maxListItems,
    maxListItems,
    0,
    itemData
);
autoListItem.PreCaptionText = '~HUD_COLOUR_RED~';
menu.AddItem(autoListItem);

//Example data, use for example alt.Player.all
const players: string[] = ["DurtyFree", "Kar", "Tuxick", "Hardy", "Neta"];
var playerKickIndex = 0;

function onDynamicPlayerKickItemChange(item: NativeUI.UIMenuDynamicListItem, selectedValue: string, changeDirection: NativeUI.ChangeDirection): string {
    if (changeDirection == NativeUI.ChangeDirection.Right) {
        playerKickIndex++;
        if (playerKickIndex >= players.length)
            playerKickIndex = 0;
    }
    else {
        playerKickIndex--;
        if (playerKickIndex < 0)
            playerKickIndex = players.length - 1;
    }

    //item.Data = playerId; //Set item.Data to player id for example, so you can kick him when menu item OnSelect is triggered
    return players[playerKickIndex]; // Return players name as new selected value
}

let dynamicKickPlayerItem = new NativeUI.UIMenuDynamicListItem(
    'Kick Player:',
    onDynamicPlayerKickItemChange,
    `Choose player to kick.`,
    () => players[0] // First player name to be selected
);
dynamicKickPlayerItem.PreCaptionText = '~HUD_COLOUR_RED~';
menu.AddItem(dynamicKickPlayerItem);

const banners: { dict: string; name: string; }[] = [
    { dict: "commonmenu", name: "interaction_bgd" },
    { dict: "shopui_title_barber", name: "shopui_title_barber" },
    { dict: "shopui_title_barber2", name: "shopui_title_barber2" },
    { dict: "shopui_title_barber3", name: "shopui_title_barber3" },
    { dict: "shopui_title_barber4", name: "shopui_title_barber4" },
    { dict: "shopui_title_carmod", name: "shopui_title_carmod" },
    { dict: "shopui_title_carmod2", name: "shopui_title_carmod2" },
    { dict: "shopui_title_conveniencestore", name: "shopui_title_tennisstore" },
    { dict: "shopui_title_conveniencestore", name: "shopui_title_conveniencestore" },
    { dict: "shopui_title_darts", name: "shopui_title_darts" },
    { dict: "shopui_title_gasstation", name: "shopui_title_gasstation" },
    { dict: "shopui_title_golfshop", name: "shopui_title_golfshop" },
    { dict: "shopui_title_graphics_franklin", name: "shopui_title_graphics_franklin" },
    { dict: "shopui_title_graphics_michael", name: "shopui_title_graphics_michael" },
    { dict: "shopui_title_graphics_trevor", name: "shopui_title_graphics_trevor" },
    { dict: "shopui_title_gunclub", name: "shopui_title_gunclub" },
    { dict: "shopui_title_highendfashion", name: "shopui_title_highendfashion" },
    { dict: "shopui_title_highendsalon", name: "shopui_title_highendsalon" },
    { dict: "shopui_title_liqourstore", name: "shopui_title_liqourstore" },
    { dict: "shopui_title_liqourstore2", name: "shopui_title_liqourstore2" },
    { dict: "shopui_title_liqourstore3", name: "shopui_title_liqourstore3" },
    { dict: "shopui_title_lowendfashion", name: "shopui_title_lowendfashion" },
    { dict: "shopui_title_lowendfashion2", name: "shopui_title_lowendfashion2" },
    { dict: "shopui_title_midfashion", name: "shopui_title_midfashion" },
    { dict: "shopui_title_movie_masks", name: "shopui_title_movie_masks" },
    { dict: "shopui_title_tattoos", name: "shopui_title_tattoos" },
    { dict: "shopui_title_tattoos2", name: "shopui_title_tattoos2" },
    { dict: "shopui_title_tattoos3", name: "shopui_title_tattoos3" },
    { dict: "shopui_title_tattoos4", name: "shopui_title_tattoos4" },
    { dict: "shopui_title_tattoos5", name: "shopui_title_tattoos5" },
    { dict: "shopui_title_tennis", name: "shopui_title_tennis" }
];
var bannerIndex = 0;

function onDynamicBannerItemChange(item: NativeUI.UIMenuDynamicListItem, selectedValue: string, changeDirection: NativeUI.ChangeDirection): string {
    if (changeDirection == NativeUI.ChangeDirection.Right) {
        bannerIndex++;
        if (bannerIndex >= banners.length)
            bannerIndex = 0;
    }
    else {
        bannerIndex--;
        if (bannerIndex < 0)
            bannerIndex = banners.length - 1;
    }

    let currentBanner = banners[bannerIndex];
    menu.SetSpriteBannerType(new NativeUI.Sprite(currentBanner.dict, currentBanner.name, new NativeUI.Point(0, 0), new NativeUI.Size()));
    return currentBanner.name;
}

let dynamicBannerItem = new NativeUI.UIMenuDynamicListItem(
    'Banner:',
    onDynamicBannerItemChange,
    `Choose your menu banner.`,
    () => banners[0].name
);
dynamicBannerItem.PreCaptionText = '~HUD_COLOUR_GREEN~';
menu.AddItem(dynamicBannerItem);

function onDynamicListItemChange(item: NativeUI.UIMenuDynamicListItem, selectedValue: string, changeDirection: NativeUI.ChangeDirection): string {
    if (changeDirection == NativeUI.ChangeDirection.Right) {
        game.setEntityCoordsNoOffset(alt.Player.local.scriptID, alt.Player.local.pos.x + 0.01, alt.Player.local.pos.y, alt.Player.local.pos.z, false, false, false);
    }
    else {
        game.setEntityCoordsNoOffset(alt.Player.local.scriptID, alt.Player.local.pos.x - 0.01, alt.Player.local.pos.y, alt.Player.local.pos.z, false, false, false);
    }

    // Return new selected value
    return alt.Player.local.pos.x.toFixed(2);
}

let dynamicListItem = new NativeUI.UIMenuDynamicListItem(
    'Player X Position:',
    onDynamicListItemChange, // This is called every list item change
    `Change Players X position.`,
    () => alt.Player.local.pos.x.toFixed(2) // This is called once on initial menu list item draw / menu opening 
);
dynamicListItem.PreCaptionText = '~HUD_COLOUR_RED~';
menu.AddItem(dynamicListItem);

// Sub Menu
let menuItem = new NativeUI.UIMenuItem(
    "Test Sub Menu", "Just a sub menu."
);
let niceButton = new NativeUI.InstructionalButton("Nice", NativeUI.Control.Sprint);
niceButton.BindToItem(menuItem);
menu.AddInstructionalButton(niceButton);

menu.AddItem(menuItem);

const subMenu = new NativeUI.Menu("NativeUI Sub Menu Test", "Sub Menu Subtitle", new NativeUI.Point(50, 50));
subMenu.Visible = false;
subMenu.GetTitle().Scale = 0.9; // Change sub menu title scale
menu.AddSubMenu(subMenu, menuItem);

subMenu.AddItem(new NativeUI.UIMenuItem(
    "Sub menu item",
    "Just a sub menu item"
));

// Events
menu.ItemSelect.on((selectedItem: NativeUI.UIMenuListItem | NativeUI.UIMenuSliderItem | NativeUI.UIMenuCheckboxItem | NativeUI.UIMenuAutoListItem, selectedItemIndex: number) => {
    if (selectedItem instanceof NativeUI.UIMenuListItem) {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.SelectedItem.DisplayText, selectedItem.SelectedItem.Data);
    } else if (selectedItem instanceof NativeUI.UIMenuSliderItem) {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text, selectedItem.Index, selectedItem.IndexToItem(selectedItem.Index));
    } else if (selectedItem instanceof NativeUI.UIMenuCheckboxItem) {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text, selectedItem.Checked);
    } else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text);
    }
});

menu.ListChange.on((item: NativeUI.UIMenuListItem, newListItemIndex: number) => {
    alt.log("[ListChange] " + newListItemIndex, item.Text);
});

menu.AutoListChange.on((item: NativeUI.UIMenuAutoListItem, newListItemIndex: number, changeDirection: NativeUI.ChangeDirection) => {
    alt.log("[AutoListChange] " + newListItemIndex, item.Text);
    if (item == autoListItem) {
        alt.log("[AutoListChange] " + changeDirection as string + " " + item.Data.name + " " + item.Data.data);
        alt.log(newListItemIndex);
    }
});

menu.DynamicListChange.on((item: NativeUI.UIMenuDynamicListItem, newListItemIndex: number, changeDirection: NativeUI.ChangeDirection) => {
    alt.log("[DynamicListChange] " + newListItemIndex, item.Text);
    if (item == dynamicKickPlayerItem) {
        alt.log("[DynamicListChange] " + changeDirection as string);
    }
});

menu.IndexChange.on((newIndex: number) => {
    alt.log("[IndexChange] " + "Current Selection: " + newIndex);
});

menu.SliderChange.on((item: NativeUI.UIMenuSliderItem, itemIndex: number, sliderIndex: number) => {
    alt.log("[SliderChange] " + item.Text, itemIndex, sliderIndex);
});

menu.CheckboxChange.on((item: NativeUI.UIMenuCheckboxItem, checkedState: boolean) => {
    alt.log("[CheckboxChange] " + item.Text, checkedState);
});

menu.MenuOpen.on(() => {
    alt.log("[NativeUi] Menu opened");
});

menu.MenuClose.on(() => {
    alt.log("[NativeUi] Menu closed");
});

menu.MenuChange.on((newMenu: NativeUI.Menu, enteredSubMenu: boolean) => {
    alt.log("[MenuChange] " + newMenu.Id, enteredSubMenu);
});

alt.on('keyup', (key: number) => {
    if (key === 0x4D) { //M Key		
        if (menu.Visible) menu.Close();
        else menu.Open();
        NativeUI.MidsizedMessage.ShowMidsizedShardMessage("Menu opened", "Awesome", NativeUI.HudColor.HUD_COLOUR_BLACK, true, true);
    } else if (key === 70 && menu.Visible) { //F Key
        if (!NativeUI.BigMessage.IsVisible) {
            NativeUI.BigMessage.ShowRankupMessage("You paid respect", "Well done sir", 1337);
        }
    }
}); 
