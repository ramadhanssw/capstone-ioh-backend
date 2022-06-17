"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const google_auth_library_1 = require("google-auth-library");
const UserInterface_1 = require("../interfaces/documents/UserInterface");
async function AuthController(req, res) {
    const { email, password, googleToken } = req.body;
    const firestore = firebase_admin_1.default.firestore();
    const accountMissmatch = {
        success: false,
        message: 'Email or password missmatch'
    };
    const accountNotFound = {
        success: false,
        message: 'Account not found'
    };
    try {
        const userResult = await firestore.collection('users').where('email', '==', email).get();
        if (userResult.docs.length == 0) {
            res.json(accountNotFound);
            return;
        }
        const user = {
            id: userResult.docs[0].id,
            ...userResult.docs[0].data()
        };
        if (password) {
            bcrypt_1.default.compare(password, user.password, async (err, valid) => {
                if (!valid) {
                    res.json(accountMissmatch);
                    return;
                }
                const jwt = jsonwebtoken_1.default.sign(String(user.id), fs_1.default.readFileSync(path_1.default.join(__dirname, '../../private.key')), {
                    algorithm: 'PS256'
                });
                let endpoint = '/';
                switch (user.privilege) {
                    case UserInterface_1.Privilege.Admin:
                        endpoint = '/admin';
                        break;
                    case UserInterface_1.Privilege.User:
                        endpoint = '/user';
                        break;
                    default:
                }
                return res.json({
                    success: true,
                    data: {
                        token: jwt,
                        endpoint: endpoint,
                    }
                });
            });
        }
        else if (googleToken) {
            const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
            const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (email != payload?.email) {
                res.json(accountNotFound);
                return;
            }
            const jwt = jsonwebtoken_1.default.sign(String(user.id), fs_1.default.readFileSync(path_1.default.join(__dirname, '../../private.key')), {
                algorithm: 'PS256'
            });
            let endpoint = '/';
            switch (user.privilege) {
                case UserInterface_1.Privilege.Admin:
                    endpoint = '/admin';
                    break;
                case UserInterface_1.Privilege.User:
                    endpoint = '/user';
                    break;
                default:
            }
            return res.json({
                success: true,
                data: {
                    token: jwt,
                    endpoint: endpoint,
                }
            });
        }
    }
    catch (err) {
        return res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9BdXRoQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUEyQjtBQUUzQixvRUFBcUM7QUFDckMsNENBQW1CO0FBQ25CLGdFQUE4QjtBQUM5QixnREFBdUI7QUFDdkIsNkRBQWtEO0FBQ2xELHlFQUFnRjtBQUlqRSxLQUFLLFVBQVUsY0FBYyxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQ3RFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUE4QixDQUFBO0lBRTNFLE1BQU0sU0FBUyxHQUFHLHdCQUFRLENBQUMsU0FBUyxFQUFFLENBQUE7SUFFdEMsTUFBTSxnQkFBZ0IsR0FBZ0I7UUFDcEMsT0FBTyxFQUFFLEtBQUs7UUFDZCxPQUFPLEVBQUUsNkJBQTZCO0tBQ3ZDLENBQUE7SUFFRCxNQUFNLGVBQWUsR0FBZ0I7UUFDbkMsT0FBTyxFQUFFLEtBQUs7UUFDZCxPQUFPLEVBQUUsbUJBQW1CO0tBQzdCLENBQUE7SUFFRCxJQUFJO1FBQ0YsTUFBTSxVQUFVLEdBQUcsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBRXhGLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7WUFDekIsT0FBTTtTQUNQO1FBRUQsTUFBTSxJQUFJLEdBQUc7WUFDWCxFQUFFLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pCLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJ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