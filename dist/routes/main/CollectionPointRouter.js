"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionPointRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const os_1 = __importDefault(require("os"));
const CollectionPoint_1 = require("../../actions/main/CollectionPoint");
const upload = (0, multer_1.default)({
    dest: os_1.default.tmpdir()
});
const CollectionPoint = (0, express_1.Router)();
CollectionPoint.post('/:id', CollectionPoint_1.SubmitCollectionPoint);
CollectionPoint.post('/', CollectionPoint_1.SubmitCollectionPoint);
CollectionPoint.get('/:id', CollectionPoint_1.CollectionPointData);
CollectionPoint.get('/', CollectionPoint_1.CollectionPointList);
CollectionPoint.delete('/:id', CollectionPoint_1.RemoveCollectionPoint);
exports.CollectionPointRouter = CollectionPoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGVjdGlvblBvaW50Um91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9tYWluL0NvbGxlY3Rpb25Qb2ludFJvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQ0FBZ0M7QUFDaEMsb0RBQTJCO0FBQzNCLDRDQUFtQjtBQUNuQix3RUFBMkk7QUFFM0ksTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxFQUFDO0lBQ3BCLElBQUksRUFBRSxZQUFFLENBQUMsTUFBTSxFQUFFO0NBQ2xCLENBQUMsQ0FBQTtBQUVGLE1BQU0sZUFBZSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFBO0FBRWhDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLHVDQUFxQixDQUFDLENBQUE7QUFDbkQsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsdUNBQXFCLENBQUMsQ0FBQTtBQUVoRCxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxxQ0FBbUIsQ0FBQyxDQUFBO0FBQ2hELGVBQWUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFDQUFtQixDQUFDLENBQUE7QUFFN0MsZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsdUNBQXFCLENBQUMsQ0FBQTtBQUV4QyxRQUFBLHFCQUFxQixHQUFHLGVBQWUsQ0FBQSJ9