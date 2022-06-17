"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionPointList = exports.RemoveCollectionPoint = exports.SubmitCollectionPoint = exports.CollectionPointData = void 0;
const app_1 = require("../../app");
const CollectionPointInterface_1 = require("../../interfaces/documents/CollectionPointInterface");
function CollectionPointData(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('collectionPoints').doc(id).get().then(collectionPointResult => {
        if (!collectionPointResult.exists) {
            res.json({
                success: false,
                message: 'Collection Point not found',
                error: null
            });
            return;
        }
        const collectionPoint = {
            id: collectionPointResult.id,
            ...collectionPointResult.data()
        };
        res.json({
            success: true,
            data: {
                collectionPoint: collectionPoint
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
exports.CollectionPointData = CollectionPointData;
async function SubmitCollectionPoint(req, res) {
    const { id } = req.params;
    const { title, description, latitude, longitude, status } = req.body;
    try {
        let foundCollectionPoint = null;
        if (id) {
            const collectionPointResult = await app_1.firestore.collection('collectionPoints').doc(id).get();
            if (collectionPointResult.exists) {
                foundCollectionPoint = {
                    id: collectionPointResult.id,
                    ...collectionPointResult.data()
                };
            }
        }
        const collectionPoint = foundCollectionPoint ?? {
            title: title,
            description: description,
            latitude: parseInt(latitude),
            longitude: parseInt(longitude),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: CollectionPointInterface_1.CollectionPointStatus.Active
        };
        collectionPoint.title = title;
        collectionPoint.description = description;
        collectionPoint.latitude = parseInt(latitude);
        collectionPoint.longitude = parseInt(longitude);
        collectionPoint.status = status ?? CollectionPointInterface_1.CollectionPointStatus.Active;
        if (foundCollectionPoint) {
            await app_1.firestore.collection('collectionPoints').doc(id).update(collectionPoint);
        }
        else {
            await app_1.firestore.collection('collectionPoints').add(collectionPoint);
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
exports.SubmitCollectionPoint = SubmitCollectionPoint;
function RemoveCollectionPoint(req, res) {
    const { id } = req.params;
    app_1.firestore.collection('collectionPoints').doc(id).delete().then(deletedCollectionPoint => {
        if (deletedCollectionPoint === null) {
            res.json({
                success: false,
                message: 'CollectionPoint not found',
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
exports.RemoveCollectionPoint = RemoveCollectionPoint;
function CollectionPointList(req, res) {
    app_1.firestore.collection('collectionPoints').get().then(collectionPointsResult => {
        const collectionPoints = [];
        collectionPointsResult.docs.map((collectionPoint) => collectionPoints.push({
            id: collectionPoint.id,
            ...collectionPoint.data(),
        }));
        res.json({
            success: true,
            data: {
                collectionPoints: collectionPoints
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
exports.CollectionPointList = CollectionPointList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGVjdGlvblBvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbnMvbWFpbi9Db2xsZWN0aW9uUG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQXFDO0FBQ3JDLGtHQUU0RDtBQUc1RCxTQUFnQixtQkFBbUIsQ0FBQyxHQUFZLEVBQUUsR0FBYTtJQUM3RCxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQTtJQUV6QixlQUFTLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1FBQ2xGLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUU7WUFDakMsR0FBRyxDQUFDLElBQUksQ0FBYztnQkFDcEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxFQUFFLDRCQUE0QjtnQkFDckMsS0FBSyxFQUFFLElBQUk7YUFDWixDQUFDLENBQUE7WUFFRixPQUFNO1NBQ1A7UUFFRCxNQUFNLGVBQWUsR0FBRztZQUN0QixFQUFFLEVBQUUscUJBQXFCLENBQUMsRUFBRTtZQUM1QixHQUFHLHFCQUFxQixDQUFDLElBQUksRUFBRTtTQUNKLENBQUE7UUFFN0IsR0FBRyxDQUFDLElBQUksQ0FBNkQ7WUFDbkUsT0FBTyxFQUFFLElBQUk7WUFDYixJQUFJLEVBQUU7Z0JBQ0osZUFBZSxFQUFFLGVBQWU7YUFDakM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDYixHQUFHLENBQUMsSUFBSSxDQUFjO1lBQ3BCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixLQUFLLEVBQUcsR0FBYSxDQUFDLE9BQU87U0FDOUIsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxD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