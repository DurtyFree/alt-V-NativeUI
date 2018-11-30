export default class ListItem {
	public DisplayText: string;
	public Data: any;

	constructor(text: string = "", data: any = null) {
		this.DisplayText = text;
		this.Data = data;
	}
}
