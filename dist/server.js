"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const process_1 = __importDefault(require("process"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const { PORT = process_1.default.env.PORT ?? '3000', } = process_1.default.env;
if (PORT.match(/[\.sock]+/g) !== null && fs_1.default.existsSync(PORT)) {
    fs_1.default.unlinkSync(PORT);
}
app_1.default.listen(PORT, () => {
    if (PORT.match(/[\.sock]+/g) !== null) {
        fs_1.default.chownSync(PORT, 33, 33);
    }
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUEyQjtBQUMzQiw0Q0FBbUI7QUFDbkIsc0RBQTZCO0FBQzdCLGdEQUF1QjtBQUV2QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBRWYsTUFBTSxFQUNKLElBQUksR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksTUFBTSxHQUNsQyxHQUFHLGlCQUFPLENBQUMsR0FBRyxDQUFBO0FBRWYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksSUFBSSxZQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQzVELFlBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7Q0FDcEI7QUFFRCxhQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDcEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNyQyxZQUFFLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7S0FDM0I7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ2pELENBQUMsQ0FBQyxDQUFBIn0=