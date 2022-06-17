"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CollectionPoint_1 = require("../actions/main/CollectionPoint");
const News_1 = require("../actions/main/News");
const NewsCategory_1 = require("../actions/main/NewsCategory");
const TrashReportRouter_1 = require("./main/TrashReportRouter");
const UserRouter_1 = require("./main/UserRouter");
const UserRouter = (0, express_1.Router)();
UserRouter.use('/user', UserRouter_1.UserRouter);
UserRouter.use('/trash-report', TrashReportRouter_1.TrashReportRouter);
UserRouter.get('/collection-point/:id', CollectionPoint_1.CollectionPointData);
UserRouter.get('/collection-point', CollectionPoint_1.CollectionPointList);
UserRouter.get('/news-category/:id', NewsCategory_1.NewsCategoryList);
UserRouter.get('/news-category', NewsCategory_1.NewsCategoryList);
UserRouter.get('/news/:id', News_1.NewsData);
UserRouter.get('/news', News_1.NewsList);
exports.default = UserRouter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvVXNlclJvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFnQztBQUNoQyxxRUFBMEY7QUFDMUYsK0NBQXlEO0FBQ3pELCtEQUErRDtBQUMvRCxnRUFBNEQ7QUFDNUQsa0RBRTBCO0FBRTFCLE1BQU0sVUFBVSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFBO0FBRTNCLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHVCQUFlLENBQUMsQ0FBQTtBQUN4QyxVQUFVLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxxQ0FBaUIsQ0FBQyxDQUFBO0FBRWxELFVBQVUsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUscUNBQW1CLENBQUMsQ0FBQTtBQUM1RCxVQUFVLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLHFDQUFtQixDQUFDLENBQUE7QUFDeEQsVUFBVSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSwrQkFBZ0IsQ0FBQyxDQUFBO0FBQ3RELFVBQVUsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsK0JBQWdCLENBQUMsQ0FBQTtBQUNsRCxVQUFVLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFRLENBQUMsQ0FBQTtBQUNyQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxlQUFRLENBQUMsQ0FBQTtBQUVqQyxrQkFBZSxVQUFVLENBQUEifQ==