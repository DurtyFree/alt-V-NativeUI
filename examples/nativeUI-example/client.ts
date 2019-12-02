import * as alt from 'alt';
import * as game from 'natives';
import * as NativeUI from './includes/NativeUI/NativeUI';

const menu = new NativeUI.Menu("NativeUI Test", "Test Subtitle", new NativeUI.Point(50, 50));
//menu.Visible = false; //Menus are visible per default
//menu.DisableInstructionalButtons(true); //Instructional Buttons are enabled per default
menu.TitleScale = 1.5;

let respectButton = new NativeUI.InstructionalButton("To pay respect", 0, "F");
menu.AddInstructionalButton(respectButton);

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

let menuItem = new NativeUI.UIMenuItem(
    "Test Sub Menu", "Just a sub menu."
);
let niceButton = new NativeUI.InstructionalButton("Nice", NativeUI.Control.Sprint);
niceButton.BindToItem(menuItem);
menu.AddInstructionalButton(niceButton);

menu.AddItem(menuItem);

const subMenu = new NativeUI.Menu("NativeUI Sub Menu Test", "Sub Menu Subtitle", new NativeUI.Point(50, 50));
subMenu.Visible = false;
subMenu.TitleScale = 0.9;
menu.AddSubMenu(subMenu, menuItem);

subMenu.AddItem(new NativeUI.UIMenuItem(
    "Sub menu item",
    "Just a sub menu item"
));

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