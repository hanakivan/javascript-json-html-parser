import {parseChildren, isBlockElement, isAttachment, createElementForElementName} from './libs.js';

export class Parser {

    json = null;

    constructor(json) {
        this.json = json;

        console.log("Initialized with JSON: %o", this.json)
    }

    getHTML() {
        const items = [];

        this.json.forEach(item => {
            let block;

            if(isBlockElement(item.type)) {
                block = createElementForElementName(item.type, item);

                if(item.children) {
                    parseChildren(block, item.children);
                }

                items.push(block);
            } else if (isAttachment(item.type)) {
                if(item.subtype === "image") {
                    const kiddo = document.createElement("div");
                    const kiddoImg = document.createElement("img");

                    kiddo.appendChild(kiddoImg);

                    kiddo.setAttribute("data-id", item.attributes.id);

                    kiddoImg.src = item.attributes.src;

                    items.push(kiddo);
                } else {
                    console.warn("incorrect subtype");
                }
            } else {
                console.error("In the main loop there is not a block element!", item)
            }
        });

        let HTML = "";

        items.forEach(item => {
            HTML += item.outerHTML;
        });

        return HTML;
    }
}