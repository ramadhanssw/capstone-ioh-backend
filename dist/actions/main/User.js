"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFCMToken = exports.AdminList = exports.AdminData = exports.RemoveAdmin = exports.SubmitAdmin = exports.UserList = exports.RemoveUser = exports.SubmitUser = exports.UserData = exports.UserPhoto = exports.UpdateUserData = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const app_1 = require("../../app");
const UserInterface_1 = require("../../interfaces/documents/UserInterface");
const Storage_1 = require("../../modules/Storage");
function UpdateUserData(req, res) {
    const { id } = req.params;
    const { fullname, address, password } = req.body;
    const photo = req.file;
    app_1.firestore.collection('users').doc(id).get().then(async (userResult) => {
        if (!userResult.exists) {
            res.json({
                success: false,
                message: 'User not found',
                error: null
            });
            return;
        }
        const userData = {
            id: userResult.id,
            ...userResult.data()
        };
        if (fullname) {
            userData.fullname = fullname;
        }
        if (address) {
            userData.meta.address = address;
        }
        if (password !== undefined && password.length > 4) {
            userData.password = bcrypt_1.default.hashSync(password, 10);
        }
        if (photo !== undefined) {
            const fileName = `profile-pict-${Date.now()}-${(0, sanitize_filename_1.default)(photo.originalname)}`;
            const dirPath = path_1.default.join(__dirname, `../../../public/uploads/${String(userData.id)}`);
            const filePath = {
                local: photo.path,
                public: path_1.default.join(`/uploads/${String(userData.id)}/${fileName}`)
            };
            if (!fs_1.default.existsSync(dirPath)) {
                fs_1.default.mkdirSync(dirPath);
            }
            const publicUrl = await (0, Storage_1.StoreFile)(filePath.public, filePath.local, Storage_1.StorageProvider.Firebase);
            userData.photo = publicUrl;
            app_1.firestore.collection('users').doc(id).update({
                ...userData
            }).then(() => {
                res.json({
                    success: true,
                    message: 'Ok'
                });
                return;
            });
        }
        else {
            app_1.firestore.collection('users').doc(id).update({
                ...userData
            }).then(() => {
                res.json({
                    success: true,
                    message: 'Ok'
                });
                return;
            });
        }
    }).catch(err => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.UpdateUserData = UpdateUserData;
function UserPhoto(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('users').doc(id).get().then(userResult => {
        const user = userResult.data();
        if (user === null) {
            res.json({
                success: false,
                message: 'User not found',
                error: null
            });
            return;
        }
        let url = "/profile.png";
        if (user.photo) {
            url = user.photo;
        }
        res.sendFile(path_1.default.resolve(__dirname, '../../../public' + url));
    }).catch(err => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.UserPhoto = UserPhoto;
function UserData(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('users').doc(id).get().then(userResult => {
        if (!userResult.exists) {
            res.json({
                success: false,
                message: 'User not found',
                error: null
            });
            return;
        }
        const user = {
            id: userResult.id,
            ...userResult.data()
        };
        res.json({
            success: true,
            data: {
                user: user
            }
        });
    }).catch(err => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.UserData = UserData;
async function SubmitUser(req, res) {
    const { id } = req.params;
    const { fullname, email, password, phone, status } = req.body;
    try {
        let foundUser = null;
        if (id) {
            const userResult = await app_1.firestore.collection('users').doc(id).get();
            if (userResult.exists) {
                foundUser = {
                    id: userResult.id,
                    ...userResult.data()
                };
            }
        }
        const user = foundUser ?? {
            fullname: '',
            email: '',
            password: '',
            meta: {},
            privilege: UserInterface_1.Privilege.User,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: UserInterface_1.UserStatus.Active,
        };
        if (password && password.length > 4) {
            user.password = bcrypt_1.default.hashSync(password, 10);
        }
        user.email = email;
        user.fullname = fullname;
        user.status = status;
        user.privilege = UserInterface_1.Privilege.User;
        if (phone) {
            user.meta.phone = phone;
        }
        if (foundUser) {
            await app_1.firestore.collection('users').doc(id).update(user);
        }
        else {
            await app_1.firestore.collection('users').add(user);
        }
        res.json({
            success: true,
            message: 'ok'
        });
    }
    catch (err) {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    }
}
exports.SubmitUser = SubmitUser;
function RemoveUser(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('users').doc(id).delete().then(deletedUser => {
        if (deletedUser === null) {
            res.json({
                success: false,
                message: 'User not found',
                error: null
            });
            return;
        }
        res.json({
            success: true,
            message: 'ok'
        });
    }).catch(err => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.RemoveUser = RemoveUser;
function UserList(req, res) {
    app_1.firestore.collection('users').get().then(usersResult => {
        const users = [];
        usersResult.docs.map((user) => users.push({
            id: user.id,
            ...user.data(),
        }));
        res.json({
            success: true,
            data: {
                users: users
            }
        });
    }).catch(err => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.UserList = UserList;
async function SubmitAdmin(req, res) {
    const { id } = req.params;
    const { fullname, email, password, status } = req.body;
    let state = 'update';
    try {
        let admin = {
            id: '',
            fullname: '',
            email: '',
            password: '',
            privilege: UserInterface_1.Privilege.Admin,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: UserInterface_1.UserStatus.Active
        };
        if (id) {
            let adminResult = await app_1.firestore.collection('users').doc(id).get();
            if (!adminResult.exists) {
                state = 'new';
                admin = {
                    id: adminResult.id,
                    ...adminResult.data()
                };
            }
        }
        if (password && password.length > 4) {
            admin.password = bcrypt_1.default.hashSync(password, 10);
        }
        admin.fullname = fullname;
        admin.email = email;
        admin.status = status;
        //const savedAdmin = await admin.save()
        res.json({
            success: true,
            data: {
            //administrator: savedAdmin
            }
        });
    }
    catch (err) {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    }
}
exports.SubmitAdmin = SubmitAdmin;
function RemoveAdmin(req, res) {
    const { id } = req.params;
    const { user } = req.body;
    app_1.firestore.collection('users').doc(id).delete().then(deletedAdmin => {
        if (deletedAdmin === null) {
            res.json({
                success: false,
                message: 'Admin data not found',
                error: null
            });
            return;
        }
        res.json({
            success: true,
            message: 'ok'
        });
    }).catch(err => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.RemoveAdmin = RemoveAdmin;
function AdminData(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('users').doc(id).get().then((adminResult) => {
        if (!adminResult.exists) {
            res.json({
                success: false,
                message: 'Admin data not found',
            });
            return;
        }
        res.json({
            success: true,
            data: {
                administrator: {
                    id: adminResult.id,
                    ...adminResult.data()
                }
            }
        });
        return;
    }).catch((err) => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.AdminData = AdminData;
function AdminList(req, res) {
    app_1.firestore.collection('users').where('privilege', '==', UserInterface_1.Privilege.Admin).get().then(adminsResult => {
        let admins = [];
        adminsResult.docs.map((adminResult) => {
            admins.push({
                id: adminResult.id,
                ...adminResult.data()
            });
        });
        res.json({
            success: true,
            data: {
                administrators: admins
            }
        });
    }).catch(err => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.AdminList = AdminList;
async function UpdateFCMToken(req, res) {
    const { id } = req.params;
    const { fcmToken } = req.body;
    try {
        const userResult = await app_1.firestore.collection('users').doc(id).get();
        if (!userResult.exists) {
            res.json({
                success: false,
                message: 'User not found',
                error: null
            });
            return;
        }
        const user = {
            id: userResult.id,
            ...userResult.data()
        };
        user.meta = {
            ...user.meta,
            fcmToken: fcmToken
        };
        //await user.save()
        res.json({
            success: true,
            message: 'Ok'
        });
    }
    catch (err) {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    }
}
exports.UpdateFCMToken = UpdateFCMToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL21haW4vVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxvREFBMkI7QUFFM0IsNENBQW1CO0FBQ25CLGdEQUF1QjtBQUN2QiwwRUFBd0M7QUFDeEMsbUNBQXFDO0FBQ3JDLDRFQUVpRDtBQUVqRCxtREFBa0U7QUFFbEUsU0FBZ0IsY0FBYyxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQ3hELE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO0lBQ3pCLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7SUFDaEQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtJQUV0QixlQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxFQUFFO1FBQ2xFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQWM7Z0JBQ3BCLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE9BQU8sRUFBRSxnQkFBZ0I7Z0JBQ3pCLEtBQUssRUFBRSxJQUFJO2FBQ1osQ0FBQyxDQUFBO1lBRUYsT0FBTTtTQUNQO1FBRUQsTUFBTSxRQUFRLEdBQUc7WUFDZixFQUFFLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDakIsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFO1NBQ0osQ0FBQTtRQUVsQixJQUFJLFFBQVEsRUFBRTtZQUNaLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1NBQzdCO1FBRUQsSUFBSSxPQUFPLEVBQUU7WUFDWCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFP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