import * as alt from 'alt-client';
import * as game from 'natives';
import * as NativeUI from './includes/NativeUI/NativeUI';
const menu = new NativeUI.Menu("NativeUI Test", "Test Subtitle", new NativeUI.Point(50, 50));
menu.GetTitle().Scale = 1.5;
menu.GetTitle().DropShadow = true;
let respectButton = new NativeUI.InstructionalButton("To pay respect", 0, "F");
menu.AddInstructionalButton(respectButton);
menu.AddItem(new NativeUI.UIMenuListItem("List Item", "Description for List Item", new NativeUI.ItemsCollection(["Item 1", "Item 2", "Item 3"])));
menu.AddItem(new NativeUI.UIMenuSliderItem("Slider Item", ["Fugiat", "pariatur", "consectetur", "ex", "duis", "magna", "nostrud", "et", "dolor", "laboris"], 5, "Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint.", true));
menu.AddItem(new NativeUI.UIMenuCheckboxItem("Checkbox Item", false, "Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint."));
menu.AddItem(new NativeUI.UIMenuItem("Dumb menu item", "Just a menu item description"));
const maxListItems = 100;
let itemData = {
    name: "test",
    data: "great"
};
let autoListItem = new NativeUI.UIMenuAutoListItem('Auto list item: Write number', `I want to write ~y~${maxListItems}~s~ in console.`, -maxListItems, maxListItems, 0, itemData);
autoListItem.PreCaptionText = '~HUD_COLOUR_RED~';
menu.AddItem(autoListItem);
const players = ["DurtyFree", "Kar", "Tuxick", "Hardy", "Neta"];
var playerKickIndex = 0;
function onDynamicPlayerKickItemChange(item, selectedValue, changeDirection) {
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
    return players[playerKickIndex];
}
let dynamicKickPlayerItem = new NativeUI.UIMenuDynamicListItem('Kick Player:', onDynamicPlayerKickItemChange, `Choose player to kick.`, () => players[0]);
dynamicKickPlayerItem.PreCaptionText = '~HUD_COLOUR_RED~';
menu.AddItem(dynamicKickPlayerItem);
const banners = [
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
    { dict: "shopui_title_graphics_micheal", name: "shopui_title_graphics_micheal" },
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
function onDynamicBannerItemChange(item, selectedValue, changeDirection) {
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
let dynamicBannerItem = new NativeUI.UIMenuDynamicListItem('Banner:', onDynamicBannerItemChange, `Choose your menu banner.`, () => banners[0].name);
dynamicBannerItem.PreCaptionText = '~HUD_COLOUR_GREEN~';
menu.AddItem(dynamicBannerItem);
function onDynamicListItemChange(item, selectedValue, changeDirection) {
    if (changeDirection == NativeUI.ChangeDirection.Right) {
        game.setEntityCoordsNoOffset(alt.Player.local.scriptID, alt.Player.local.pos.x + 0.01, alt.Player.local.pos.y, alt.Player.local.pos.z, false, false, false);
    }
    else {
        game.setEntityCoordsNoOffset(alt.Player.local.scriptID, alt.Player.local.pos.x - 0.01, alt.Player.local.pos.y, alt.Player.local.pos.z, false, false, false);
    }
    return alt.Player.local.pos.x.toFixed(2);
}
let dynamicListItem = new NativeUI.UIMenuDynamicListItem('Player X Position:', onDynamicListItemChange, `Change Players X position.`, () => alt.Player.local.pos.x.toFixed(2));
dynamicListItem.PreCaptionText = '~HUD_COLOUR_RED~';
menu.AddItem(dynamicListItem);
let menuItem = new NativeUI.UIMenuItem("Test Sub Menu", "Just a sub menu.");
let niceButton = new NativeUI.InstructionalButton("Nice", NativeUI.Control.Sprint);
niceButton.BindToItem(menuItem);
menu.AddInstructionalButton(niceButton);
menu.AddItem(menuItem);
const subMenu = new NativeUI.Menu("NativeUI Sub Menu Test", "Sub Menu Subtitle", new NativeUI.Point(50, 50));
subMenu.Visible = false;
subMenu.GetTitle().Scale = 0.9;
menu.AddSubMenu(subMenu, menuItem);
subMenu.AddItem(new NativeUI.UIMenuItem("Sub menu item", "Just a sub menu item"));
menu.ItemSelect.on((selectedItem, selectedItemIndex) => {
    if (selectedItem instanceof NativeUI.UIMenuListItem) {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.SelectedItem.DisplayText, selectedItem.SelectedItem.Data);
    }
    else if (selectedItem instanceof NativeUI.UIMenuSliderItem) {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text, selectedItem.Index, selectedItem.IndexToItem(selectedItem.Index));
    }
    else if (selectedItem instanceof NativeUI.UIMenuCheckboxItem) {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text, selectedItem.Checked);
    }
    else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text);
    }
});
menu.ListChange.on((item, newListItemIndex) => {
    alt.log("[ListChange] " + newListItemIndex, item.Text);
});
menu.AutoListChange.on((item, newListItemIndex, changeDirection) => {
    alt.log("[AutoListChange] " + newListItemIndex, item.Text);
    if (item == autoListItem) {
        alt.log("[AutoListChange] " + changeDirection + " " + item.Data.name + " " + item.Data.data);
        alt.log(newListItemIndex);
    }
});
menu.DynamicListChange.on((item, newListItemIndex, changeDirection) => {
    alt.log("[DynamicListChange] " + newListItemIndex, item.Text);
    if (item == dynamicKickPlayerItem) {
        alt.log("[DynamicListChange] " + changeDirection);
    }
});
menu.IndexChange.on((newIndex) => {
    alt.log("[IndexChange] " + "Current Selection: " + newIndex);
});
menu.SliderChange.on((item, itemIndex, sliderIndex) => {
    alt.log("[SliderChange] " + item.Text, itemIndex, sliderIndex);
});
menu.CheckboxChange.on((item, checkedState) => {
    alt.log("[CheckboxChange] " + item.Text, checkedState);
});
menu.MenuOpen.on(() => {
    alt.log("[NativeUi] Menu opened");
});
menu.MenuClose.on(() => {
    alt.log("[NativeUi] Menu closed");
});
menu.MenuChange.on((newMenu, enteredSubMenu) => {
    alt.log("[MenuChange] " + newMenu.Id, enteredSubMenu);
});
alt.on('keyup', (key) => {
    if (key === 0x4D) {
        if (menu.Visible)
            menu.Close();
        else
            menu.Open();
        NativeUI.MidsizedMessage.ShowMidsizedShardMessage("Menu opened", "Awesome", NativeUI.HudColor.HUD_COLOUR_BLACK, true, true);
    }
    else if (key === 70 && menu.Visible) {
        if (!NativeUI.BigMessage.IsVisible) {
            NativeUI.BigMessage.ShowRankupMessage("You paid respect", "Well done sir", 1337);
        }
    }
});
