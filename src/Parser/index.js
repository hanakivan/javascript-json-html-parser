const BLOCK_ELEMENTS = [
    "paragraph",
    "heading",
    "list",
    "preformatted"
];

const INLINE_ELEMENTS = [
    ""
];

export class Parser {

    html = null;

    constructor(htmlCode) {
        this.html = htmlCode;
    }

    getHtml() {
        return this.html;
    }
}

export const parseChildren = (block, children) => {
    children.forEach(kid => {
        if(kid.type === "text") {
            const kiddo = document.createTextNode(kid.text);

            block.appendChild(kiddo);
        } else if (["em", "strong", "b", "i", "span", "cite", "code", "key", "break"].includes(kid.type)) {
            const kiddo = document.createElement(getElementTagNameForName(kid.type));

            if(kid.children) {
                kid.children.forEach(subKid => {
                    if(subKid.type === "text") {
                        const subKiddo = document.createTextNode(subKid.text);

                        kiddo.appendChild(subKiddo);
                    }
                });
            }

            block.appendChild(kiddo);
        }
    });
};

const getElementTagNameForName = (elementName) => {
    switch(elementName) {
        case "break":
            return "br";
    }

    return elementName;
};