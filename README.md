# alt:V-NativeUI
This project is a (fully TypeScript compatible) port of RageMP-NativeUI [Kar](https://github.com/karscopsandrobbers/RAGEMP-NativeUI) for alt:V. It provides a simple way to use NativeUI menus in your clientside scripts. A lot of credits to [datWeazel](https://github.com/datWeazel/alt-V-NativeUI) who made the initial port of the RageMP-NativeUI.

__NativeUI is not a standalone resource!  
You need to include NativeUI in every resource in which you want to use NativeUI menus!__
# Usage
1. Create a folder called `includes` inside the resource folder in which you want to use NativeUI. 
2. Add the new `includes` folder to client-files in the `resource.cfg`. 
	1. Use `includes/*` to automatically add all subfolders and files inside `includes` to your resource
3. Create another folder called `NativeUIMenu` inside the `includes` folder.
4. Download NativeUI from github and extract all files inside the `src` folder to your `NativeUIMenu` folder
	1. Your file structure should look something like this:  
	`altv-Server/resources/yourResource/includes/NativeUIMenu/NativeUI`
5. Finally just include NativeUI inside the clientside script where you want to use NativeUI with this line:  
`import * as NativeUI from 'includes/NativeUIMenu/NativeUI';`
  
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
## Functions
`new NativeUI.Menu(Title, Subtitle, Offset, spriteLibrary = "commonmenu", spriteName = "interaction_bgd")`
-   **Functions**
-   `AddItem(UIMenuItem)`
-   `BindMenuToItem(Menu, UIMenuItem)`
-   `ReleaseMenuFromItem(UIMenuItem)`
-   `Open()`
-   `Close()`
-   **Events**
-   `IndexChange: (Index)`
-   `ListChange: (UIMenuListItem, Index)`
-   `CheckboxChange: (UIMenuCheckboxItem, Checked)`
-   `ItemSelect: (UIMenuItem, Index)`
-   `SliderChange: (UIMenuSliderItem, Index, Value)`
-   `MenuClose: ()`
-   `MenuChange: (Menu)`
----------
`new NativeUI.UIMenuItem(Caption, Description = "")`
-   **Functions**
-   `SetLeftBadge(BadgeStyle)`
-   `SetRightBadge(BadgeStyle)`
-   `SetRightLabel(Text)`
-   **Variables**
-   `Text: String`
-   `Description: String`
-   `Enabled: Boolean`
-   `BackColor: Color`
-   `HighlightedBackColor: Color`
-   `ForeColor: Color`
-   `HighlightedForeColor: Color`
----------
`new NativeUI.UIMenuListItem(Caption, Description = "", collection = new ItemsCollection([]), startIndex = 0)`  (Extends  `UIMenuItem`)  
**Does not support  `SetRightBadge`  and  `SetRightLabel`**
-   **Variables**
-   `Collection: ItemsCollection`
-   `SelectedItem: string`
-   `SelectedValue: string`
----------
`new NativeUI.UIMenuCheckboxItem(Caption, checked = false, Description = "")`  (Extends  `UIMenuItem`)  
**Does not support  `SetRightBadge`  and  `SetRightLabel`**
-   **Variables**
-   `Checked: boolean`
-   **Events**
-   `CheckedChanged: (Checked)`
----------
`new NativeUI.UIMenuSliderItem(Caption, Items, Startindex, Description = "", Divider = false)`  (Extends  `UIMenuItem`)  
**Does not support  `SetRightBadge`  and  `SetRightLabel`**
-   **Variables**
-   `Index: number`
-   **Functions**
-   `IndexToItem: any`
----------
`new NativeUI.Point(X, Y)`
-   **Variables**
-   `X: number`
-   `Y: number`
----------
`new NativeUI.Size(Width, Height)`
-   **Variables**
-   `Width: number`
-   `Height: number`
----------
`new NativeUI.Color(Red, Green, Blue, Alpha = 255)`
-   **Variables**
-   `R: number`
-   `G: number`
-   `B: number`
-   `A: number`
----------
`new NativeUI.ItemsCollection(Array)`

## Enums

### BadgeStyle
```
enum BadgeStyle {
	None,
	BronzeMedal,
	GoldMedal,
	SilverMedal,
	Alert,
	Crown,
	Ammo,
	Armour,
	Barber,
	Clothes,
	Franklin,
	Bike,
	Car,
	Gun,
	Heart,
	Makeup,
	Mask,
	Michael,
	Star,
	Tatoo,
	Trevor,
	Lock,
	Tick,
	Sale,
	ArrowLeft,
	ArrowRight,
	Audio1,
	Audio2,
	Audio3,
	AudioInactive,
	AudioMute
}
```
### Font
```
enum Font {
	ChaletLondon = 0,
	HouseScript = 1,
	Monospace = 2,
	CharletComprimeColonge = 4,
	Pricedown = 7
}
```
