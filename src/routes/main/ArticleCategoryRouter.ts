import { Router } from "express"
import multer from "multer"
import ArticleCategoryList, { ArticleCategoryData, RemoveArticleCategory, SubmitArticleCategory } from "../../actions/main/ArticleCategory"

const ArticleCategoryRouter = Router()
const upload = multer()

ArticleCategoryRouter.post(['/:id', '/'],upload.any(), SubmitArticleCategory)

ArticleCategoryRouter.delete('/:id', RemoveArticleCategory)

ArticleCategoryRouter.get('/:id', ArticleCategoryData)
ArticleCategoryRouter.get('/', ArticleCategoryList)

export default ArticleCategoryRouter