"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const os_1 = __importDefault(require("os"));
const News_1 = require("../../actions/main/News");
const upload = (0, multer_1.default)({
    dest: os_1.default.tmpdir()
});
const News = (0, express_1.Router)();
News.post('/:id/status', News_1.UpdateNewsStatus);
News.post('/:id', upload.single('image'), News_1.SubmitNews);
News.post('/', upload.single('image'), News_1.SubmitNews);
News.get('/:id', News_1.NewsData);
News.get('/', News_1.NewsList);
News.delete('/:id', News_1.RemoveNews);
exports.NewsRouter = News;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmV3c1JvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvbWFpbi9OZXdzUm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFnQztBQUNoQyxvREFBMkI7QUFDM0IsNENBQW1CO0FBQ25CLGtEQU1nQztBQUVoQyxNQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFNLEVBQUM7SUFDcEIsSUFBSSxFQUFFLFlBQUUsQ0FBQyxNQUFNLEVBQUU7Q0FDbEIsQ0FBQyxDQUFBO0FBRUYsTUFBTSxJQUFJLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUE7QUFFckIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsdUJBQWdCLENBQUMsQ0FBQTtBQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLGlCQUFVLENBQUMsQ0FBQTtBQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLGlCQUFVLENBQUMsQ0FBQTtBQUVsRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxlQUFRLENBQUMsQ0FBQTtBQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxlQUFRLENBQUMsQ0FBQTtBQUV2QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxpQkFBVSxDQUFDLENBQUE7QUFFbEIsUUFBQSxVQUFVLEdBQUcsSUFBSSxDQUFBIn0=