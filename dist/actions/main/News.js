"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNewsStatus = exports.NewsList = exports.RemoveNews = exports.SubmitNews = exports.NewsData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const app_1 = require("../../app");
const NewsInterface_1 = require("../../interfaces/documents/NewsInterface");
const Storage_1 = require("../../modules/Storage");
function NewsData(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('news').doc(id).get().then(newsResult => {
        if (!newsResult.exists) {
            res.json({
                success: false,
                message: 'News not found',
                error: null
            });
            return;
        }
        const news = {
            id: newsResult.id,
            ...newsResult.data()
        };
        res.json({
            success: true,
            data: {
                news: news
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
exports.NewsData = NewsData;
async function SubmitNews(req, res) {
    const { id } = req.params;
    const { category, title, description, content, } = req.body;
    const { user } = res.locals;
    const image = req.file;
    const photos = req.files;
    try {
        let foundNews = null;
        if (id) {
            const newsResult = await app_1.firestore.collection('news').doc(id).get();
            if (newsResult.exists) {
                foundNews = {
                    id: newsResult.id,
                    ...newsResult.data()
                };
            }
        }
        const news = foundNews ?? {
            category: category,
            title: title,
            description: description,
            content: content,
            createdBy: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: NewsInterface_1.NewsStatus.Publish
        };
        if (image) {
            const fileName = `trash-${Date.now()}-${(0, sanitize_filename_1.default)(image.originalname)}`;
            const dirPath = path_1.default.join(__dirname, `../../../public/uploads/${String(user.id)}`);
            const filePath = {
                local: image.path,
                public: path_1.default.join(`/uploads/${String(user.id)}/${fileName}`)
            };
            if (!fs_1.default.existsSync(dirPath)) {
                fs_1.default.mkdirSync(dirPath);
            }
            const publicUrl = await (0, Storage_1.StoreFile)(filePath.public, filePath.local, Storage_1.StorageProvider.Firebase);
            news.image = publicUrl;
        }
        if (foundNews) {
            await app_1.firestore.collection('news').doc(id).update(news);
        }
        else {
            await app_1.firestore.collection('news').add(news);
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
exports.SubmitNews = SubmitNews;
function RemoveNews(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('news').doc(id).delete().then(deletedNews => {
        if (deletedNews === null) {
            res.json({
                success: false,
                message: 'News not found',
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
exports.RemoveNews = RemoveNews;
async function NewsList(req, res) {
    const { user } = res.locals;
    try {
        const newsListResult = await app_1.firestore.collection('news').get();
        const newsList = [];
        newsListResult.docs.map((news) => newsList.push({
            id: news.id,
            ...news.data(),
        }));
        res.json({
            success: true,
            data: {
                news: newsList
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
exports.NewsList = NewsList;
async function UpdateNewsStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const newsResult = await app_1.firestore.collection('news').doc(id).get();
        await app_1.firestore.collection('news').doc(id).update({
            ...newsResult.data(),
            status: status
        });
        if (!newsResult.exists) {
            res.json({
                success: false,
                message: 'News not found',
                error: null
            });
            return;
        }
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
exports.UpdateNewsStatus = UpdateNewsStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmV3cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL21haW4vTmV3cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw0Q0FBbUI7QUFDbkIsZ0RBQXVCO0FBQ3ZCLDBFQUF3QztBQUN4QyxtQ0FBcUM7QUFDckMsNEVBRWlEO0FBR2pELG1EQUFrRTtBQUVsRSxTQUFnQixRQUFRLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDbEQsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7SUFFekIsZUFBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQzNELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQWM7Z0JBQ3BCLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE9BQU8sRUFBRSxnQkFBZ0I7Z0JBQ3pCLEtBQUssRUFBRSxJQUFJO2FBQ1osQ0FBQyxDQUFBO1lBRUYsT0FBTTtTQUNQO1FBRUQsTUFBTSxJQUFJLEdBQUc7WUFDWCxFQUFFLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDakIsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFO1NBQ0osQ0FBQTtRQUVsQixHQUFHLENBQUMsSUFBSSxDQUF1QztZQUM3QyxPQUFPLEVBQUUsSUFBSTtZQUNiLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsSUFBSTthQUNYO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsT0FBTTtJQUNSLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNiLEdBQUcsQ0FBQyxJQUFJLENBQWM7WUFDcEIsT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsZ0JBQWdCO1lBQ3pCLEtBQUssRUFBRyxHQUFhLENBQUMsT0FB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