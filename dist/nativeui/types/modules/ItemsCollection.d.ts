import ListItem from "../modules/ListItem.js";
export default class ItemsCollection {
    private items;
    constructor(items: ListItem[] | string[] | number[]);
    length(): number;
    getListItems(): any[];
}
