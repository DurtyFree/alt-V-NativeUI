import * as alt from 'alt';
import * as NativeUI from './includes/NativeUIMenu/NativeUI';
const menu = new NativeUI.Menu("NativeUI Test", "Test Subtitle", new NativeUI.Point(50, 50));
menu.AddItem(new NativeUI.UIMenuListItem("List Item", "Description for List Item", new NativeUI.ItemsCollection(["Item 1", "Item 2", "Item 3"])));
menu.AddItem(new NativeUI.UIMenuSliderItem("Slider Item", ["Fugiat", "pariatur", "consectetur", "ex", "duis", "magna", "nostrud", "et", "dolor", "laboris"], 5, "Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint.", true));
menu.AddItem(new NativeUI.UIMenuCheckboxItem("Checkbox Item", false, "Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint."));
menu.AddItem(new NativeUI.UIMenuItem("Dumb menu item", "Just a menu item description"));
const maxListItems = 100;
let itemData = {
    name: "test",
    data: "great"
};
let dynamicListItem = new NativeUI.UIMenuDynamicListItem('Dynamic list item: Discard item(s)', `Discard an amount (~y~${maxListItems}~s~ max) of this item on the ground.`, 1, maxListItems, 1, itemData);
dynamicListItem.PreCaptionText = '~HUD_COLOUR_RED~';
menu.AddItem(dynamicListItem);
let menuItem = new NativeUI.UIMenuItem("Test Sub Menu", "Just a sub menu.");
menu.AddItem(menuItem);
const subMenu = new NativeUI.Menu("NativeUI Sub Menu Test", "Sub Menu Subtitle", new NativeUI.Point(50, 50));
subMenu.Visible = false;
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
menu.DynamicListChange.on((item, newListItemIndex) => {
    alt.log("[DynamicListChange] " + newListItemIndex, item.Text);
    if (item == dynamicListItem) {
        alt.log("[DynamicListChange] " + item.Data.name + " " + item.Data.data);
    }
});
menu.IndexChange.on(newIndex => {
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
alt.on('keydown', (key) => {
    if (key === 0x4D) {
        if (menu.Visible)
            menu.Close();
        else
            menu.Open();
    }
});
