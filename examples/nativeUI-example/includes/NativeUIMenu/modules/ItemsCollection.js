import ListItem from "../modules/ListItem";
export default class ItemsCollection {
    constructor(items) {
        if (items.length === 0)
            throw new Error("ItemsCollection cannot be empty");
        this.items = items;
    }
    length() {
        return this.items.length;
    }
    getListItems() {
        const items = [];
        for (const item of this.items) {
            if (item instanceof ListItem) {
                items.push(item);
            }
            else if (typeof item == "string") {
                items.push(new ListItem(item));
            }
            else if (typeof item == "number") {
                items.push(new ListItem(item.toString()));
            }
        }
        return items;
    }
}
