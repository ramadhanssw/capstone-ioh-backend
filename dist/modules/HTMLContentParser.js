"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
function HTMLContentParser(HTMLContent) {
    const DOM = new jsdom_1.JSDOM(HTMLContent);
    const images = DOM.window.document.getElementsByTagName('img');
    const timestamp = Date.now();
    const randomKey = crypto_1.default.randomBytes(4).toString('hex');
    let fileName;
    let image;
    let imageBuffer;
    for (let i = 0; i < images.length; i++) {
        image = images.item(i)?.src;
        fileName = `parsed-image-${timestamp}-${randomKey}`;
        if (image) {
            imageBuffer = Buffer.from(image, 'base64');
            fs_1.default.writeFileSync(path_1.default.join(__dirname, '../../public/parsed/', fileName), imageBuffer);
        }
    }
    return DOM.window.document.body.innerHTML;
}
exports.default = HTMLContentParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFRNTENvbnRlbnRQYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kdWxlcy9IVE1MQ29udGVudFBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGlDQUE2QjtBQUM3Qiw0Q0FBbUI7QUFDbkIsZ0RBQXVCO0FBQ3ZCLG9EQUEyQjtBQUUzQixTQUF3QixpQkFBaUIsQ0FBQyxXQUFtQjtJQUMzRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUNsQyxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM5RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7SUFDNUIsTUFBTSxTQUFTLEdBQUcsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRXZELElBQUksUUFBUSxDQUFBO0lBQ1osSUFBSSxLQUFLLENBQUE7SUFDVCxJQUFJLFdBQVcsQ0FBQTtJQUVmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQTtRQUMzQixRQUFRLEdBQUcsZ0JBQWdCLFNBQVMsSUFBSSxTQUFTLEVBQUUsQ0FBQTtRQUVuRCxJQUFJLEtBQUssRUFBRTtZQUNULFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQTtZQUMxQyxZQUFFLENBQUMsYUFBYSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFBO1NBQ3RGO0tBQ0Y7SUFFRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUE7QUFDM0MsQ0FBQztBQXJCRCxvQ0FxQkMifQ==