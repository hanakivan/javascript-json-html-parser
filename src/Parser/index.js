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
        } else if (kid.type === "strong") {
            const kiddo = document.createElement("strong");

            kid.children.forEach(subKid => {
                if(subKid.type === "text") {
                    const subKiddo = document.createTextNode(subKid.text);

                    kiddo.appendChild(subKiddo);
                }
            });

            block.appendChild(kiddo);
        } else if (kid.type === "break") {
            const kiddo = document.createElement("br");

            block.appendChild(kiddo);
        } else if (kid.type === "code") {
            const kiddo = document.createElement("code");

            kid.children.forEach(subKid => {
                if(subKid.type === "text") {
                    const subKiddo = document.createTextNode(subKid.text);

                    kiddo.appendChild(subKiddo);
                }
            });

            block.appendChild(kiddo);
        }
    });
};