"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNewsCategoryStatus = exports.NewsCategoryList = exports.RemoveNewsCategory = exports.SubmitNewsCategory = exports.NewsCategoryData = void 0;
const app_1 = require("../../app");
function NewsCategoryData(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('newsCategories').doc(id).get().then(newsCategoryResult => {
        if (!newsCategoryResult.exists) {
            res.json({
                success: false,
                message: 'newsCategory not found',
                error: null
            });
            return;
        }
        const newsCategory = {
            id: newsCategoryResult.id,
            ...newsCategoryResult.data()
        };
        res.json({
            success: true,
            data: {
                newsCategory: newsCategory
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
exports.NewsCategoryData = NewsCategoryData;
async function SubmitNewsCategory(req, res) {
    const { id } = req.params;
    const { title, description, } = req.body;
    const { user } = res.locals;
    try {
        let foundNewsCategory = null;
        if (id) {
            const newsCategoryResult = await app_1.firestore.collection('newsCategories').doc(id).get();
            if (newsCategoryResult.exists) {
                foundNewsCategory = {
                    id: newsCategoryResult.id,
                    ...newsCategoryResult.data()
                };
            }
        }
        const newsCategory = foundNewsCategory ?? {
            title: title,
            description: description,
            createdBy: user.id,
        };
        if (foundNewsCategory) {
            await app_1.firestore.collection('newsCategories').doc(id).update(newsCategory);
        }
        else {
            await app_1.firestore.collection('newsCategories').add(newsCategory);
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
exports.SubmitNewsCategory = SubmitNewsCategory;
function RemoveNewsCategory(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('newsCategories').doc(id).delete().then(deletedNewsCategory => {
        if (deletedNewsCategory === null) {
            res.json({
                success: false,
                message: 'News category not found',
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
exports.RemoveNewsCategory = RemoveNewsCategory;
async function NewsCategoryList(req, res) {
    try {
        const newsCategoriesResult = await app_1.firestore.collection('newsCategories').get();
        const newsCategories = [];
        newsCategoriesResult.docs.map((newsCategory) => newsCategories.push({
            id: newsCategory.id,
            ...newsCategory.data(),
        }));
        res.json({
            success: true,
            data: {
                newsCategories: newsCategories
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
exports.NewsCategoryList = NewsCategoryList;
async function UpdateNewsCategoryStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const newsCategoryResult = await app_1.firestore.collection('newsCategories').doc(id).get();
        await app_1.firestore.collection('newsCategories').doc(id).update({
            ...newsCategoryResult.data(),
            status: status
        });
        if (!newsCategoryResult.exists) {
            res.json({
                success: false,
                message: 'News category not found',
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
exports.UpdateNewsCategoryStatus = UpdateNewsCategoryStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmV3c0NhdGVnb3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbnMvbWFpbi9OZXdzQ2F0ZWdvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQXFDO0FBSXJDLFNBQWdCLGdCQUFnQixDQUFDLEdBQVksRUFBRSxHQUFhO0lBQzFELE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO0lBRXpCLGVBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7UUFDN0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtZQUM5QixHQUFHLENBQUMsSUFBSSxDQUFjO2dCQUNwQixPQUFPLEVBQUUsS0FBSztnQkFDZCxPQUFPLEVBQUUsd0JBQXdCO2dCQUNqQyxLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQTtZQUVGLE9BQU07U0FDUDtRQUVELE1BQU0sWUFBWSxHQUFHO1lBQ25CLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFO1lBQ3pCLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxFQUFFO1NBQ0osQ0FBQTtRQUUxQixHQUFHLENBQUMsSUFBSSxDQUF1RDtZQUM3RCxPQUFPLEVBQUUsSUFBSTtZQUNiLElBQUksRUFBRTtnQkFDSixZQUFZLEVBQUUsWUFBWTthQUMzQjtTQUNGLENBQUMsQ0FBQTtRQUNGLE9BQU07SUFDUixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDYixHQUFHLENBQUMsSUFBSSxDQUFjO1lBQ3BCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixLQUFLLEVBQUcsR0FBYSxDQUFDLE9BQU87U0FDOUIsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7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