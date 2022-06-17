"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUser = exports.IsAdmin = exports.Authentication = exports.CORS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const app_1 = require("./app");
const UserInterface_1 = require("./interfaces/documents/UserInterface");
dotenv_1.default.config();
const DEFAULT_SITE = process.env.DEFAULT_SITE;
const unauthorizedResponse = {
    success: false,
    message: 'User not authorized',
    error: null
};
function CORS(req, res, next) {
    const { origin } = req.headers;
    res.set('Access-Control-Allow-Origin', origin ?? DEFAULT_SITE);
    res.set('Access-Control-Allow-Headers', 'authorization');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
}
exports.CORS = CORS;
function Authentication(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.substring(7);
    if (!token) {
        res.json({
            success: false,
            message: 'User not authorized'
        });
        return;
    }
    try {
        const id = jsonwebtoken_1.default.verify(token, fs_1.default.readFileSync(path_1.default.join(__dirname, '../private.key')), {
            algorithms: ['PS256']
        });
        app_1.firestore.collection('users').doc(id).get().then(async (userResult) => {
            if (!userResult.exists) {
                res.json(unauthorizedResponse);
                return;
            }
            const user = {
                id: userResult.id,
                ...userResult.data()
            };
            res.locals.user = user;
            next();
        });
    }
    catch (err) {
        res.json({
            success: false,
            message: 'User not authorized',
            error: err.message
        });
    }
}
exports.Authentication = Authentication;
function IsAdmin({ res, next }) {
    const { user } = res.locals;
    if (user.privilege !== UserInterface_1.Privilege.Admin) {
        res.json({
            success: false,
            message: 'Only admin that can use this API'
        });
        return;
    }
    next();
}
exports.IsAdmin = IsAdmin;
function IsUser({ res, next }) {
    const { user } = res.locals;
    if (user.privilege != UserInterface_1.Privilege.User) {
        res.json({
            success: false,
            message: 'Only user that can use this API'
        });
        return;
    }
    next();
}
exports.IsUser = IsUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9taWRkbGV3YXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUEyQjtBQUUzQiw0Q0FBbUI7QUFDbkIsZ0VBQThCO0FBQzlCLGdEQUF1QjtBQUN2QiwrQkFBaUM7QUFDakMsd0VBQStFO0FBRy9FLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFZixNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQTtBQUU3QyxNQUFNLG9CQUFvQixHQUFnQjtJQUN4QyxPQUFPLEVBQUUsS0FBSztJQUNkLE9BQU8sRUFBRSxxQkFBcUI7SUFDOUIsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFBO0FBRUQsU0FBZ0IsSUFBSSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7SUFDbEUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUE7SUFFOUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxNQUFNLElBQUksWUFBWSxDQUFDLENBQUE7SUFDOUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsRUFBRSxlQUFlLENBQUMsQ0FBQTtJQUN4RCxHQUFHLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLG1DQUFtQyxDQUFDLENBQUE7SUFFNUUsSUFBSSxFQUFFLENBQUE7QUFDUixDQUFDO0FBUkQsb0JBUUM7QUFFRCxTQUFnQixjQUFjLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUM1RSxNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQTtJQUNyQyxNQUFNLEtBQUssR0FBRyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRXpDLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDVixHQUFHLENBQUMsSUFBSSxDQUFjO1lBQ3BCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsT0FBTyxFQUFFLHFCQUFxQjtTQUMvQixDQUFDLENBQUE7UUFFRixPQUFNO0tBQ1A7SUFFRCxJQUFJO1FBQ0YsTUFBTSxFQUFFLEdBQUcsc0JBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQUUsQ0FBQyxZQUFZLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxFQUFxQjtZQUN2RyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDdEIsQ0FBQyxDQUFBO1FBRUYsZUFBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBWSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsRUFBRTtZQUM1RSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtnQkFDdEIsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO2dCQUM5QixPQUFNO2FBQ1A7WUFFRCxNQUFNLElBQUksR0FBRztnQkFDWCxFQUFFLEVBQUUsVUFBVSxDQUFDLEVBQUU7Z0JBQ2pCLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRTthQUNKLENBQUE7WUFFbEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1lBQ3RCLElBQUksRUFBRSxDQUFBO1FBQ1IsQ0FBQyxDQUFDLENBQUE7S0FDSDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osR0FBRyxDQUFDLElBQUksQ0FBYztZQUNwQixPQUFPLEVBQUUsS0FBSztZQUNkLE9BQU8sRUFBRSxxQkFBcUI7WUFDOUIsS0FBSyxFQUFHLEdBQWEsQ0FBQyxPQUFPO1NBQzlCLENBQUMsQ0FBQTtLQUNIO0FBQ0gsQ0FBQztBQXZDRCx3Q0F1Q0M7QUFFRCxTQUFnQixPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFzQztJQUN0RSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQTtJQUUzQixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUsseUJBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDdEMsR0FBRyxDQUFDLElBQUksQ0FBYztZQUNwQixPQUFPLEVBQUUsS0FBSztZQUNkLE9BQU8sRUFBRSxrQ0FBa0M7U0FDNUMsQ0FBQyxDQUFBO1FBRUYsT0FBTTtLQUNQO0lBRUQsSUFBSSxFQUFFLENBQUE7QUFDUixDQUFDO0FBYkQsMEJBYUM7QUFFRCxTQUFnQixNQUFNLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFzQztJQUNyRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQTtJQUUzQixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUkseUJBQVMsQ0FBQyxJQUFJLEVBQUU7UUFDcEMsR0FBRyxDQUFDLElBQUksQ0FBYztZQUNwQixPQUFPLEVBQUUsS0FBSztZQUNkLE9BQU8sRUFBRSxpQ0FBaUM7U0FDM0MsQ0FBQyxDQUFBO1FBRUYsT0FBTTtLQUNQO0lBRUQsSUFBSSxFQUFFLENBQUE7QUFDUixDQUFDO0FBYkQsd0JBYUMifQ==