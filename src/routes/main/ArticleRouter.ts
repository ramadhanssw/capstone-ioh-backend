import { Router } from "express"
import multer from "multer"
import ArticleList, { ArticleData, RemoveArticle, SubmitArticle, LikeArticle, SubmitArticleComment, ArticleCommentList, LikeArticleComment } from "../../actions/main/Article"

const ArticleRouter = Router()
const upload = multer()

ArticleRouter.post(['/:id', '/'], upload.single('featuredImage'), SubmitArticle)
ArticleRouter.post('/like/:id', LikeArticle)
ArticleRouter.post('/comment/:id', SubmitArticleComment)
ArticleRouter.post('/comment/like/:id', LikeArticleComment)

ArticleRouter.delete('/:id', RemoveArticle)

ArticleRouter.get('/:id', ArticleData)
ArticleRouter.get('/', ArticleList)
ArticleRouter.get('/comment/:id', ArticleCommentList)

export default ArticleRouter