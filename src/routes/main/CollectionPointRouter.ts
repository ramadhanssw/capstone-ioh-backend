import { Router } from "express"
import multer from "multer"
import os from 'os'
import { CollectionPointData, CollectionPointList, RemoveCollectionPoint, SubmitCollectionPoint } from "../../actions/main/CollectionPoint"

const upload = multer({
  dest: os.tmpdir()
})

const CollectionPoint = Router()

CollectionPoint.post('/:id', SubmitCollectionPoint)
CollectionPoint.post('/', SubmitCollectionPoint)

CollectionPoint.get('/:id', CollectionPointData)
CollectionPoint.get('/', CollectionPointList)

CollectionPoint.delete('/:id', RemoveCollectionPoint)

export const CollectionPointRouter = CollectionPoint