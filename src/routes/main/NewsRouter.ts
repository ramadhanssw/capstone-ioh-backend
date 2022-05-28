import { Router } from "express"
import multer from "multer"
import os from 'os'
import {
  RemoveNews,
  NewsData,
  NewsList,
  SubmitNews,
  UpdateNewsStatus
} from "../../actions/main/News"

const upload = multer({
  dest: os.tmpdir()
})

const News = Router()

News.post('/:id/status', UpdateNewsStatus)
News.post('/:id', upload.single('image'), SubmitNews)
News.post('/', upload.single('image'), SubmitNews)

News.get('/:id', NewsData)
News.get('/', NewsList)

News.delete('/:id', RemoveNews)

export const NewsRouter = News