const BLOCK_ELEMENTS = [
    "paragraph",
    "heading",
    "preformatted",
    "list",
];

const INLINE_ELEMENTS = [
    "em",
    "strong",
    "b",
    "i",
    "anchor",
    "span",
    "cite",
    "code",
    "key",
    "break"
];

export const isBlockElement = (elementName) => {
    return BLOCK_ELEMENTS.includes(elementName);
};

export const isInlineElement = (elementName) => {
    return INLINE_ELEMENTS.includes(elementName);
};

const isTextNode = (elementName) => {
    return elementName === "text";
};

export const parseChildren = (block, children) => {
    children.forEach(kid => {
        if(isTextNode(kid.type)) {
            const kiddo = document.createTextNode(kid.text);

            block.appendChild(kiddo);
        } else if (isInlineElement(kid.type)) {
            const kiddo = document.createElement(getElementTagNameForInlineElementName(kid.type));

            if(kiddo.tagName.toLowerCase() === "a") {
                kiddo.href = kid.href;
            }

            if(kid.children) {
                parseChildren(kiddo, kid.children);
            }

            block.appendChild(kiddo);
        } else if (kid.type === "listitem") {
            const listItem = document.createElement(`li`);

            parseChildren(listItem, kid.children);

            block.appendChild(listItem);
        } else {
            console.warn("Parsing an unknown element tyoe", kid);
        }
    });
};

const getElementTagNameForInlineElementName = (elementName) => {
    switch(elementName) {
        case "break":
            return "br";
        case "anchor":
            return "a";
    }

    return elementName;
};

export const createElementForElementName = (elementName, options = {}) => {
    let block = null;

    switch(elementName) {
        case "paragraph":
            block = document.createElement("p");
            break;
        case "heading":
            const level = options.level;
            block = document.createElement(`h${level}`);
            break;
        case "preformatted":
            block = document.createElement("pre");
            break;
        case "list":
            const order = options.order === "ordered" ? "ol" : "ul";
            block = document.createElement(order);
            break;
        default:
            console.warn("unknown element name", elementName);
            break;
    }

    if(block) {
        if(typeof options["id"] !== "undefined") {
            block.id = options["id"];
        }
    }

    return block;
};