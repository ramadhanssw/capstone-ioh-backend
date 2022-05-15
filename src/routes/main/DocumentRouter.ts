import { Router } from "express"
import multer from "multer"
import DocumentList, { DocumentData, RemoveDocument, SubmitDocument } from "../../actions/main/Document"

const DocumentRouter = Router()
const upload = multer()

DocumentRouter.post(['/:id', '/'], upload.single('document'), SubmitDocument)

DocumentRouter.delete('/:id', RemoveDocument)

DocumentRouter.get('/:id', DocumentData)
DocumentRouter.get('/', DocumentList)

export default DocumentRouter