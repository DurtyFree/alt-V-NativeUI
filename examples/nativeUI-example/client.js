import * as alt from 'alt';
import * as game from 'natives';
import * as NativeUI from './includes/NativeUI/NativeUI';
const menu = new NativeUI.Menu("NativeUI Test", "Test Subtitle", new NativeUI.Point(50, 50));
menu.TitleScale = 1.5;
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
function onDynamicListItemChange(item, selectedValue, changeDirection) {
    if (changeDirection == NativeUI.ChangeDirection.Right) {
        game.setEntityCoordsNoOffset(alt.Player.local.scriptID, alt.Player.local.pos.x + 0.01, alt.Player.local.pos.y, alt.Player.local.pos.z, false, false, false);
    }
    else {
        game.setEntityCoordsNoOffset(alt.Player.local.scriptID, alt.Player.local.pos.x - 0.01, alt.Player.local.pos.y, alt.Player.local.pos.z, false, false, false);
    }
    return alt.Player.local.pos.x.toFixed(2);
}
let dynamicListItem = new NativeUI.UIMenuDynamicListItem('Player X Position:', onDynamicListItemChange, `Change Players X position.`, alt.Player.local.pos.x.toFixed(2));
dynamicListItem.PreCaptionText = '~HUD_COLOUR_RED~';
menu.AddItem(dynamicListItem);
let menuItem = new NativeUI.UIMenuItem("Test Sub Menu", "Just a sub menu.");
let niceButton = new NativeUI.InstructionalButton("Nice", NativeUI.Control.Sprint);
niceButton.BindToItem(menuItem);
menu.AddInstructionalButton(niceButton);
menu.AddItem(menuItem);
const subMenu = new NativeUI.Menu("NativeUI Sub Menu Test", "Sub Menu Subtitle", new NativeUI.Point(50, 50));
subMenu.Visible = false;
subMenu.TitleScale = 0.9;
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
    if (item == dynamicListItem) {
        alt.log("[DynamicListChange] " + changeDirection + " " + item.Data.name + " " + item.Data.data);
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
