import ListItem from "../modules/ListItem";
export default class ItemsCollection {
    private items;
    constructor(items: ListItem[] | string[] | number[]);
    length(): number;
    getListItems(): any[];
}
