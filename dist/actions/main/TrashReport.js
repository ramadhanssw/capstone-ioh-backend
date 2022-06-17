"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrashReportStatus = exports.TrashReportList = exports.RemoveTrashReport = exports.SubmitTrashReport = exports.TrashReportData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const app_1 = require("../../app");
const TrashReportInterface_1 = require("../../interfaces/documents/TrashReportInterface");
const UserInterface_1 = require("../../interfaces/documents/UserInterface");
const Storage_1 = require("../../modules/Storage");
function TrashReportData(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('trashReports').doc(id).get().then(trashReportResult => {
        if (!trashReportResult.exists) {
            res.json({
                success: false,
                message: 'TrashReport not found',
                error: null
            });
            return;
        }
        const trashReport = {
            id: trashReportResult.id,
            ...trashReportResult.data()
        };
        res.json({
            success: true,
            data: {
                trashReport: trashReport
            }
        });
        return;
    }).catch(err => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.TrashReportData = TrashReportData;
async function SubmitTrashReport(req, res) {
    const { id } = req.params;
    const { title, description, trashList, point, collectionPoint } = req.body;
    const { user } = res.locals;
    const photos = req.files;
    try {
        let foundTrashReport = null;
        if (id) {
            const trashReportResult = await app_1.firestore.collection('trashReports').doc(id).get();
            if (trashReportResult.exists) {
                foundTrashReport = {
                    id: trashReportResult.id,
                    ...trashReportResult.data()
                };
            }
        }
        const trashReport = foundTrashReport ?? {
            title: title,
            description: description,
            user: user.id,
            point: parseInt(point),
            collectionPoint: collectionPoint,
            trashList: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            status: TrashReportInterface_1.TrashReportStatus.InProgress
        };
        if (trashList) {
            const parsedTrashList = JSON.parse(trashList);
            const newTrashList = [];
            await Promise.all(parsedTrashList.map(async (trash, index) => {
                if (photos[index] !== undefined) {
                    const fileName = `trash-${Date.now()}-${(0, sanitize_filename_1.default)(photos[index].originalname)}`;
                    const dirPath = path_1.default.join(__dirname, `../../../public/uploads/${String(user.id)}`);
                    const filePath = {
                        local: photos[index].path,
                        public: path_1.default.join(`/uploads/${String(user.id)}/${fileName}`)
                    };
                    if (!fs_1.default.existsSync(dirPath)) {
                        fs_1.default.mkdirSync(dirPath);
                    }
                    const publicUrl = await (0, Storage_1.StoreFile)(filePath.public, filePath.local, Storage_1.StorageProvider.Firebase);
                    newTrashList.push({
                        title: trash.title,
                        category: trash.category,
                        quantity: parseInt(trash.quantity.toString()),
                        photo: publicUrl,
                        createdAt: new Date(trash.createdAt)
                    });
                }
            }));
            trashReport.trashList = newTrashList;
        }
        if (foundTrashReport) {
            await app_1.firestore.collection('trashReports').doc(id).update(trashReport);
        }
        else {
            await app_1.firestore.collection('trashReports').add(trashReport);
        }
        res.json({
            success: true,
            message: 'ok'
        });
        return;
    }
    catch (err) {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
        return;
    }
}
exports.SubmitTrashReport = SubmitTrashReport;
function RemoveTrashReport(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('trashReports').doc(id).delete().then(deletedTrashReport => {
        if (deletedTrashReport === null) {
            res.json({
                success: false,
                message: 'TrashReport not found',
                error: null
            });
            return;
        }
        res.json({
            success: true,
            message: 'ok'
        });
        return;
    }).catch(err => {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    });
}
exports.RemoveTrashReport = RemoveTrashReport;
async function TrashReportList(req, res) {
    const { user } = res.locals;
    try {
        const trashReportsResult = user.privilege == UserInterface_1.Privilege.Admin ? await app_1.firestore.collection('trashReports').get() : await app_1.firestore.collection('trashReports').where('user', '==', user.id).orderBy('createdAt', 'desc').limit(5).get();
        const trashReports = [];
        trashReportsResult.docs.map((trashReport) => trashReports.push({
            id: trashReport.id,
            ...trashReport.data(),
        }));
        res.json({
            success: true,
            data: {
                trashReports: trashReports
            }
        });
        return;
    }
    catch (err) {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    }
}
exports.TrashReportList = TrashReportList;
async function UpdateTrashReportStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const trashReportResult = await app_1.firestore.collection('trashReports').doc(id).get();
        await app_1.firestore.collection('trashReports').doc(id).update({
            ...trashReportResult.data(),
            status: status
        });
        if (!trashReportResult.exists) {
            res.json({
                success: false,
                message: 'TrashReport not found',
                error: null
            });
            return;
        }
        const trashReport = {
            ...trashReportResult.data(),
            id: trashReportResult.id
        };
        if (trashReport.status === TrashReportInterface_1.TrashReportStatus.Completed) {
            res.json({
                success: false,
                message: 'TrashReport not found',
                error: null
            });
            return;
        }
        const userResult = await app_1.firestore.collection('users').doc(trashReport.user).get();
        const user = {
            ...userResult.data(),
            id: userResult.id
        };
        res.json({
            success: true,
            message: 'Ok',
            data: {
                user: user,
                trashReport: trashReport
            }
        });
        return;
    }
    catch (err) {
        res.json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    }
}
exports.UpdateTrashReportStatus = UpdateTrashReportStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhc2hSZXBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9ucy9tYWluL1RyYXNoUmVwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDRDQUFtQjtBQUNuQixnREFBdUI7QUFDdkIsMEVBQXdDO0FBQ3hDLG1DQUFxQztBQUNyQywwRkFHd0Q7QUFDeEQsNEVBQW1GO0FBRW5GLG1EQUFrRTtBQUVsRSxTQUFnQixlQUFlLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDekQsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7SUFFekIsZUFBUyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7UUFDMUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRTtZQUM3QixHQUFHLENBQUMsSUFBSSxDQUFjO2dCQUNwQixPQUFPLEVBQUUsS0FBSztnQkFDZCxPQUFPLEVBQUUsdUJBQXVCO2dCQUNoQyxLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQTtZQUVGLE9BQU07U0FDUDtRQUVELE1BQU0sV0FBVyxHQUFHO1lBQ2xCLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxFQUFFO1lBQ3hCLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxFQUFFO1NBQ0osQ0FBQTtRQUV6QixHQUFHLENBQUMsSUFBSSxDQUFxRDtZQUMzRCxPQUFPLEVBQUUsSUFBSTtZQUNiLElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsV0FBVzthQUN6QjtTQUNGLENBQUMsQ0FBQTtRQUNGLE9BQU07SUFDUixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDYixHQUFHLENBQUMsSUFBSSxDQUFjO1lBQ3BCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsT0FBTyxFQUFF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