"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsCategoryRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const os_1 = __importDefault(require("os"));
const NewsCategory_1 = require("../../actions/main/NewsCategory");
const upload = (0, multer_1.default)({
    dest: os_1.default.tmpdir()
});
const NewsCategory = (0, express_1.Router)();
NewsCategory.post('/:id/status', NewsCategory_1.UpdateNewsCategoryStatus);
NewsCategory.post('/:id', NewsCategory_1.SubmitNewsCategory);
NewsCategory.post('/', NewsCategory_1.SubmitNewsCategory);
NewsCategory.get('/:id', NewsCategory_1.NewsCategoryData);
NewsCategory.get('/', NewsCategory_1.NewsCategoryList);
NewsCategory.delete('/:id', NewsCategory_1.RemoveNewsCategory);
exports.NewsCategoryRouter = NewsCategory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmV3c0NhdGVnb3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9tYWluL05ld3NDYXRlZ29yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQ0FBZ0M7QUFDaEMsb0RBQTJCO0FBQzNCLDRDQUFtQjtBQUNuQixrRUFNd0M7QUFFeEMsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxFQUFDO0lBQ3BCLElBQUksRUFBRSxZQUFFLENBQUMsTUFBTSxFQUFFO0NBQ2xCLENBQUMsQ0FBQTtBQUVGLE1BQU0sWUFBWSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFBO0FBRTdCLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLHVDQUF3QixDQUFDLENBQUE7QUFDMUQsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsaUNBQWtCLENBQUMsQ0FBQTtBQUM3QyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxpQ0FBa0IsQ0FBQyxDQUFBO0FBRTFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLCtCQUFnQixDQUFDLENBQUE7QUFDMUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsK0JBQWdCLENBQUMsQ0FBQTtBQUV2QyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxpQ0FBa0IsQ0FBQyxDQUFBO0FBRWxDLFFBQUEsa0JBQWtCLEdBQUcsWUFBWSxDQUFBIn0=