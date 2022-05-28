import { Router } from "express"
import multer from "multer"
import os from 'os'
import {
  RemoveNewsCategory,
  NewsCategoryData,
  NewsCategoryList,
  SubmitNewsCategory,
  UpdateNewsCategoryStatus
} from "../../actions/main/NewsCategory"

const upload = multer({
  dest: os.tmpdir()
})

const NewsCategory = Router()

NewsCategory.post('/:id/status', UpdateNewsCategoryStatus)
NewsCategory.post('/:id', SubmitNewsCategory)
NewsCategory.post('/', SubmitNewsCategory)

NewsCategory.get('/:id', NewsCategoryData)
NewsCategory.get('/', NewsCategoryList)

NewsCategory.delete('/:id', RemoveNewsCategory)

export const NewsCategoryRouter = NewsCategory