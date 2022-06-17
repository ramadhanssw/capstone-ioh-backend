"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRef = exports.firestore = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importStar(require("express"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const AuthController_1 = __importDefault(require("./actions/AuthController"));
const middleware_1 = require("./middleware");
const AdminRouter_1 = __importDefault(require("./routes/AdminRouter"));
const MainRouter_1 = __importDefault(require("./routes/MainRouter"));
const UserRouter_1 = __importDefault(require("./routes/UserRouter"));
dotenv_1.default.config();
const MODE = process.env.MODE ?? 'production';
const app = (0, express_1.default)();
if (MODE === 'development') {
    app.use((req, res, next) => {
        next();
    });
}
app.use(middleware_1.CORS);
app.use(helmet_1.default.hidePoweredBy());
app.use(helmet_1.default.xssFilter());
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true, limit: '10mb', parameterLimit: 50000 }));
app.use('/local-repo', express_1.default.static(path_1.default.join(__dirname, '../public/uploads/')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
app.use((req, res, next) => {
    next();
});
app.post('/sign-in', AuthController_1.default);
app.use('/admin', middleware_1.Authentication, middleware_1.IsAdmin, AdminRouter_1.default);
app.use('/user', middleware_1.Authentication, UserRouter_1.default);
app.use('/', MainRouter_1.default);
app.use((req, res) => {
    res.status(404);
    res.json({
        success: false,
        message: `Path ${req.method} ${req.path} not found`
    });
});
if (firebase_admin_1.default.apps.length === 0) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../firebase-adminsdk.json')).toString()))
    });
    console.log("Firebase initialization");
}
exports.firestore = firebase_admin_1.default.firestore();
exports.storageRef = firebase_admin_1.default.storage().bucket(`gs://capstone-ioh.appspot.com`);
exports.default = app;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUEyQjtBQUMzQixtREFNZ0I7QUFDaEIsb0VBQXFDO0FBQ3JDLDRDQUFtQjtBQUNuQixvREFBMkI7QUFDM0IsZ0RBQXVCO0FBQ3ZCLDhFQUFxRDtBQUVyRCw2Q0FJcUI7QUFDckIsdUVBQThDO0FBQzlDLHFFQUE0QztBQUM1QyxxRUFBNEM7QUFFNUMsZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUVmLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLFlBQVksQ0FBQTtBQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQTtBQUVyQixJQUFJLElBQUksS0FBSyxhQUFhLEVBQUU7SUFDMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1FBQzFELElBQUksRUFBRSxDQUFBO0lBQ1IsQ0FBQyxDQUFDLENBQUE7Q0FDSDtBQUVELEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQUksQ0FBQyxDQUFBO0FBQ2IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7QUFDL0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7QUFDM0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGNBQUksR0FBRSxDQUFDLENBQUE7QUFDZixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsb0JBQVUsRUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzNFLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGlCQUFPLENBQUMsTUFBTSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2xGLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGlCQUFPLENBQUMsTUFBTSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRTlFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRSxDQUFBO0FBQ1IsQ0FBQyxDQUFDLENBQUE7QUFFRixHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSx3QkFBYyxDQUFDLENBQUE7QUFFcEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsMkJBQWMsRUFBRSxvQkFBTyxFQUFFLHFCQUFXLENBQUMsQ0FBQTtBQUN2RCxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSwyQkFBYyxFQUFFLG9CQUFVLENBQUMsQ0FBQTtBQUM1QyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxvQkFBVSxDQUFDLENBQUE7QUFFeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQVEsRUFBRTtJQUM1QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBRWYsR0FBRyxDQUFDLElBQUksQ0FBYztRQUNwQixPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxRQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksWUFBWTtLQUNwRCxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUksd0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtJQUM5Qix3QkFBUSxDQUFDLGFBQWEsQ0FBQztRQUNyQixVQUFVLEVBQUUsd0JBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUNoSSxDQUFDLENBQUE7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUE7Q0FDdkM7QUFFWSxRQUFBLFNBQVMsR0FBRyx3QkFBUSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2hDLFFBQUEsVUFBVSxHQUFHLHdCQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFHckYsa0JBQWUsR0FBRyxDQUFBIn0=