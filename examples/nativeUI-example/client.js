import * as alt from 'alt';
import * as NativeUI from './includes/NativeUIMenu/NativeUI';
const ui = new NativeUI.Menu("NativeUI Test", "Test Subtitle", new NativeUI.Point(50, 50));
ui.AddItem(new NativeUI.UIMenuListItem("List Item", "Description for List Item", new NativeUI.ItemsCollection(["Item 1", "Item 2", "Item 3"])));
ui.AddItem(new NativeUI.UIMenuSliderItem("Slider Item", ["Fugiat", "pariatur", "consectetur", "ex", "duis", "magna", "nostrud", "et", "dolor", "laboris"], 5, "Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint.", true));
ui.AddItem(new NativeUI.UIMenuCheckboxItem("Checkbox Item", false, "Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint."));
ui.ItemSelect.on(item => {
    if (item instanceof NativeUI.UIMenuListItem) {
        alt.log(item.SelectedItem.DisplayText, item.SelectedItem.Data);
    }
    else if (item instanceof NativeUI.UIMenuSliderItem) {
        alt.log(item.Text, item.Index, item.IndexToItem(item.Index));
    }
    else {
        alt.log(item.Text);
    }
});
alt.on('keydown', (key) => {
    if (key === 0x4D) {
        if (ui.Visible)
            ui.Close();
        else
            ui.Open();
    }
});
