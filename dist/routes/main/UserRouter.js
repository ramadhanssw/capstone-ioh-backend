"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const os_1 = __importDefault(require("os"));
const User_1 = require("../../actions/main/User");
const upload = (0, multer_1.default)({
    dest: os_1.default.tmpdir()
});
const User = (0, express_1.Router)();
User.post('/:id', User_1.SubmitUser);
User.post('/', User_1.SubmitUser);
User.get('/photo/:id', User_1.UserPhoto);
User.get('/:id', User_1.UserData);
User.get('/', User_1.UserList);
User.put('/:id', upload.single('photo'), User_1.UpdateUserData);
User.delete('/:id', User_1.RemoveUser);
exports.UserRouter = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvbWFpbi9Vc2VyUm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFnQztBQUNoQyxvREFBMkI7QUFDM0IsNENBQW1CO0FBQ25CLGtEQVFnQztBQUVoQyxNQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFNLEVBQUM7SUFDcEIsSUFBSSxFQUFFLFlBQUUsQ0FBQyxNQUFNLEVBQUU7Q0FDbEIsQ0FBQyxDQUFBO0FBRUYsTUFBTSxJQUFJLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUE7QUFFckIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsaUJBQVUsQ0FBQyxDQUFBO0FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLGlCQUFVLENBQUMsQ0FBQTtBQUUxQixJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxnQkFBUyxDQUFDLENBQUE7QUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsZUFBUSxDQUFDLENBQUE7QUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsZUFBUSxDQUFDLENBQUE7QUFFdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxxQkFBYyxDQUFDLENBQUE7QUFFeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsaUJBQVUsQ0FBQyxDQUFBO0FBRWxCLFFBQUEsVUFBVSxHQUFHLElBQUksQ0FBQSJ9