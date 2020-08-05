import {getElementNameForTagName, snakeCaseToCamelCase} from './libs.js';

export class HTML2JSON {

    html = null;
    dom = null;
    nodeList = null;

    constructor(html) {
        this.html = html;

        //console.log("%cInitialized with HTML: %c\n\n%o", "font-size: 2em; font-weight: 500", "", this.html);

        const domParser = new DOMParser();
        this.dom = domParser.parseFromString(this.html, "text/html");

        //console.log("%cInitialized with DOM: %c\n\n%o", "font-size: 2em; font-weight: 500", "", this.dom);

        this.nodeList = this.dom.body.childNodes;

        //console.log("%cInitialized with NodeList: %c\n\n%o", "font-size: 2em; font-weight: 500", "", this.nodeList);
    }

    getJSON() {
       const json = [];

       this.nodeList.forEach(node => {
           //TODO: attachments
           if(node.nodeType === Node.ELEMENT_NODE) {
               const blockType = getElementNameForTagName(node.tagName);

               if(blockType) {
                   const block = {
                       type: blockType,
                   };

                   const dataAttributes = Object.entries(node.dataset);

                   if(dataAttributes.length) {
                       block.dataset = {};
                       dataAttributes.forEach(item => {
                           const key = item[0];
                           const value = item[1];

                           block.dataset[key] = value;
                       });
                   }

                   if(node.style.length) {
                       block.style = {};

                       let i = 0;
                       const maxIterations = 1000;
                       do {
                           const property = node.style.item(i);
                           if(property) {
                               const value = node.style.getPropertyValue(property);

                               block.style[snakeCaseToCamelCase(property)] = value;
                           }

                           i++;
                       } while (node.style.item(i).trim().length > 0 && i <= maxIterations);
                   }

                   if(block.type === "heading") {
                       const matches = node.tagName.match(/(?<level>\d+)/);
                       const level = parseInt(matches.groups.level);

                       if(!isNaN(level)) {
                           block.level = level;
                       }
                   } else if (block.type === "list") {
                       const matches = node.tagName.match(/^(?<order>(o|u))l$/i);
                       if(matches.groups.order === "O") {
                           block.order = "ordered";
                       } else {
                           block.order = "unordered";
                       }
                   }

                   if(node.id) {
                       block.id = node.id;
                   }

                   json.push(block);
               } else {
                   console.warn("Unknown block type: %o", node);
               }
           } else {
               console.info("There is a non element node type: %o", node)
           }
       });

       return json;
    }
}