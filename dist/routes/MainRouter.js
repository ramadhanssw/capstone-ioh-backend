"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const TrashReport_1 = require("../actions/main/TrashReport");
const User_1 = require("../actions/main/User");
const app_1 = require("../app");
const TrashReportInterface_1 = require("../interfaces/documents/TrashReportInterface");
const middleware_1 = require("../middleware");
dotenv_1.default.config();
const MainRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)();
MainRouter.post('/me', middleware_1.Authentication, upload.single('photo'), User_1.UpdateUserData);
MainRouter.post('/sign-up', User_1.SubmitUser);
MainRouter.post('/trash-report/:id/status', TrashReport_1.UpdateTrashReportStatus);
MainRouter.get('/user/photo/:id', middleware_1.Authentication, User_1.UserPhoto);
MainRouter.get('/me', middleware_1.Authentication, async (req, res) => {
    const user = {
        points: 0,
        ...res.locals.user
    };
    const trashReportsResult = await app_1.firestore.collection('trashReports').where('user', '==', user.id).get();
    const trashReports = [];
    trashReportsResult.docs.map((trashReport) => trashReports.push({
        id: trashReport.id,
        ...trashReport.data(),
    }));
    user.points = trashReports.filter((trashReport) => trashReport.status == TrashReportInterface_1.TrashReportStatus.Completed).reduce((prev, trashReport) => prev + trashReport.point, 0);
    res.json({
        success: true,
        data: user
    });
    return;
});
MainRouter.get('/', (req, res) => {
    res.json({
        success: true,
        data: {
            currentTimestamp: new Date()
        }
    });
    return;
});
exports.default = MainRouter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpblJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvTWFpblJvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUEyQjtBQUMzQixxQ0FBbUQ7QUFDbkQsb0RBQTJCO0FBQzNCLDZEQUFxRTtBQUNyRSwrQ0FBNEU7QUFDNUUsZ0NBQWtDO0FBQ2xDLHVGQUFzRztBQUd0Ryw4Q0FBOEM7QUFFOUMsZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUVmLE1BQU0sVUFBVSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFBO0FBQzNCLE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFBO0FBRXZCLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLDJCQUFjLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxxQkFBYyxDQUFDLENBQUE7QUFDOUUsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsaUJBQVUsQ0FBQyxDQUFBO0FBQ3ZDLFVBQVUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUscUNBQXVCLENBQUMsQ0FBQTtBQUVwRSxVQUFVLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLDJCQUFjLEVBQUUsZ0JBQVMsQ0FBQyxDQUFBO0FBRTVELFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLDJCQUFjLEVBQUUsS0FBSyxFQUFFLEdBQVksRUFBRSxHQUFhLEVBQWlCLEVBQUU7SUFDekYsTUFBTSxJQUFJLEdBQUc7UUFDWCxNQUFNLEVBQUUsQ0FBQztRQUNULEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJO0tBQ0YsQ0FBQTtJQUVsQixNQUFNLGtCQUFrQixHQUFHLE1BQU0sZUFBUyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7SUFDeEcsTUFBTSxZQUFZLEdBQWdDLEVBQUUsQ0FBQTtJQUNwRCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBQzdELEVBQUUsRUFBRSxXQUFXLENBQUMsRUFBRTtRQUNsQixHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUU7S0FDRSxDQUFDLENBQUMsQ0FBQTtJQUUzQixJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksd0NBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFFaEssR0FBRyxDQUFDLElBQUksQ0FBaUM7UUFDdkMsT0FBTyxFQUFFLElBQUk7UUFDYixJQUFJLEVBQUUsSUFBSTtLQUNYLENBQUMsQ0FBQTtJQUNGLE9BQU07QUFDUixDQUFDLENBQUMsQ0FBQTtBQUVGLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBUSxFQUFFO0lBQ3hELEdBQUcsQ0FBQyxJQUFJLENBQTBDO1FBQ2hELE9BQU8sRUFBRSxJQUFJO1FBQ2IsSUFBSSxFQUFFO1lBQ0osZ0JBQWdCLEVBQUUsSUFBSSxJQUFJLEVBQUU7U0FDN0I7S0FDRixDQUFDLENBQUE7SUFDRixPQUFNO0FBQ1IsQ0FBQyxDQUFDLENBQUE7QUFFRixrQkFBZSxVQUFVLENBQUEifQ==