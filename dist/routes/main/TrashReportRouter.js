"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashReportRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const os_1 = __importDefault(require("os"));
const TrashReport_1 = require("../../actions/main/TrashReport");
const upload = (0, multer_1.default)({
    dest: os_1.default.tmpdir()
});
const TrashReport = (0, express_1.Router)();
TrashReport.post('/:id/status', TrashReport_1.UpdateTrashReportStatus);
TrashReport.post('/:id', upload.array('photos'), TrashReport_1.SubmitTrashReport);
TrashReport.post('/', upload.array('photos'), TrashReport_1.SubmitTrashReport);
TrashReport.get('/:id', TrashReport_1.TrashReportData);
TrashReport.get('/', TrashReport_1.TrashReportList);
TrashReport.delete('/:id', TrashReport_1.RemoveTrashReport);
exports.TrashReportRouter = TrashReport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhc2hSZXBvcnRSb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91dGVzL21haW4vVHJhc2hSZXBvcnRSb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQWdDO0FBQ2hDLG9EQUEyQjtBQUMzQiw0Q0FBbUI7QUFDbkIsZ0VBTXVDO0FBRXZDLE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sRUFBQztJQUNwQixJQUFJLEVBQUUsWUFBRSxDQUFDLE1BQU0sRUFBRTtDQUNsQixDQUFDLENBQUE7QUFFRixNQUFNLFdBQVcsR0FBRyxJQUFBLGdCQUFNLEdBQUUsQ0FBQTtBQUU1QixXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxxQ0FBdUIsQ0FBQyxDQUFBO0FBQ3hELFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsK0JBQWlCLENBQUMsQ0FBQTtBQUNuRSxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLCtCQUFpQixDQUFDLENBQUE7QUFFaEUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsNkJBQWUsQ0FBQyxDQUFBO0FBQ3hDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLDZCQUFlLENBQUMsQ0FBQTtBQUVyQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSwrQkFBaUIsQ0FBQyxDQUFBO0FBRWhDLFFBQUEsaUJBQWlCLEdBQUcsV0FBVyxDQUFBIn0=