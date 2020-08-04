export const BLOCK_ELEMENTS = [
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

export const isAttachment = (elementName) => {
    return elementName === "attachment";
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

            if(typeof kid["dataset"] !== "undefined") {
                parseDataSet(kiddo, kid.dataset);
            }

            if(typeof kid["style"] !== "undefined") {
                parseStyles(kiddo, kid.style);
            }

            block.appendChild(kiddo);
        }  else if (kid.type === "listitem") {
            const listItem = document.createElement(`li`);

            parseChildren(listItem, kid.children);

            if(typeof kid["dataset"] !== "undefined") {
                parseDataSet(listItem, kid.dataset);
            }

            if(typeof kid["style"] !== "undefined") {
                parseStyles(kiddo, kid.style);
            }

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

export const getElementNameForTagName = (tagName) => {
    tagName = tagName.toLowerCase();

    switch(tagName) {
        case "p":
            return "paragraph";
        case "ul":
        case "ol":
            return "list";
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
            return "heading";
        case "pre":
            return "preformatted";
    }

    return null;
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

        if(typeof options["dataset"] !== "undefined") {
            parseDataSet(block, options.dataset);
        }

        if(typeof options["style"] !== "undefined") {
            parseStyles(block, options.style);
        }
    }

    return block;
};

const parseDataSet = (element, params) => {
    Object.entries(params).forEach(item => {
        const key = item[0];
        const value = item[1];

        element.setAttribute(`data-${key}`, value);
    });
};

const parseStyles = (element, styleObject) => {
    Object.entries(styleObject).forEach(item => {
        const property = item[0];
        const value = item[1];

        element.style[property] = value;
    });
};

export const snakeCaseToCamelCase = (string) => {
    let split = string.split("-");

    if(split.length) {
        const firstWord = split.shift();

        split = split.map(word => word.trim()).filter(word => word.length > 0).map(word => {
            const firstLetter = word.substring(0, 1).toUpperCase();
            const restOfTheWord = word.substring(1).toLowerCase();

            return `${firstLetter}${restOfTheWord}`;
        });

        split.unshift(firstWord);

        return split.join("");
    } else {
        return string;
    }

};