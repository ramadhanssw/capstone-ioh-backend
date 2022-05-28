import { Router } from "express"
import { CollectionPointData, CollectionPointList } from "../actions/main/CollectionPoint"
import { NewsData, NewsList } from "../actions/main/News"
import { NewsCategoryList } from "../actions/main/NewsCategory"
import { TrashReportRouter } from "./main/TrashReportRouter"
import {
  UserRouter as UserRouterChild,
} from "./main/UserRouter"

const UserRouter = Router()

UserRouter.use('/user', UserRouterChild)
UserRouter.use('/trash-report', TrashReportRouter)

UserRouter.get('/collection-point/:id', CollectionPointData)
UserRouter.get('/collection-point', CollectionPointList)
UserRouter.get('/news-category/:id', NewsCategoryList)
UserRouter.get('/news-category', NewsCategoryList)
UserRouter.get('/news/:id', NewsData)
UserRouter.get('/news', NewsList)

export default UserRouter
