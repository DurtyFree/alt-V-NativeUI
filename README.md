# alt:V-NativeUI
This project is a (fully TypeScript compatible) port of RageMP-NativeUI [Kar](https://github.com/karscopsandrobbers/RAGEMP-NativeUI) for alt:V. It provides a simple way to use NativeUI menus in your clientside scripts. A lot of credits to [datWeazel](https://github.com/datWeazel/alt-V-NativeUI) who made the initial port of the RageMP-NativeUI.

## Usage:
### With package:
1. Create in your `package.json` location a file named `.npmrc` and add this line:
    ```
    @durtyfree:registry=https://npm.pkg.github.com
    ```
2. Install by run `npm install --save @durtyfree/altv-nativeui`.
3. Add this line to top of file where you want to use NativeUI.
    ```typescript
    import * as NativeUI from "@durtyfree/altv-nativeui";
    ```
### Without package:
1. Download `.zip` archive you want from [releases page](https://github.com/DurtyFree/alt-V-NativeUI/releases).
2. Unpack archive in client's folder, and import like any other file:
    ```javascript
   # nativeui-min
   import * as NativeUI from "nativeui/nativeui.min.js";
   # nativeui
   import * as NativeUi from "nativeui/nativeui.js";
    ```
   - __Don't forget include nativeui folder in `client-files` section of your `resource.cfg` (if needed)__

  
See [examples folder]( https://github.com/DurtyFree/alt-V-NativeUI/tree/master/examples/nativeUI-example) for alt:V resource examples. 

## Example Menu
```javascript
import * as NativeUI from 'includes/NativeUIMenu/NativeUI.mjs';

const ui = new NativeUI.Menu("NativeUI Test", "Test Subtitle", new NativeUI.Point(50, 50));
ui.AddItem(new NativeUI.UIMenuListItem(
  	"List Item",
   	"Description for List Item",
   	new NativeUI.ItemsCollection(["Item 1", "Item 2", "Item 3"])
));

ui.AddItem(new NativeUI.UIMenuSliderItem(
  	"Slider Item",
   	["Fugiat", "pariatur", "consectetur", "ex", "duis", "magna", "nostrud", "et", "dolor", "laboris"],
   	5,
   	"Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint.",
   	true
));

ui.AddItem(new NativeUI.UIMenuCheckboxItem(
  	"Checkbox Item",
   	false,
   	"Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint."
));

ui.ItemSelect.on(item => {
  	if (item instanceof NativeUI.UIMenuListItem) {
  		alt.log(item.SelectedItem.DisplayText, item.SelectedItem.Data);
   	} else if (item instanceof NativeUI.UIMenuSliderItem) {
   		alt.log(item.Text, item.Index, item.IndexToItem(item.Index));
   	} else {
   		alt.log(item.Text);
   	}
});
```
**Result:**  
![Result](https://i.imgur.com/StrdDxR.png)