export default class TextNode {

    constructor(text) {
        this.text = text;
    }

    getElement() {
        return document.createTextNode(this.text);
    }
}