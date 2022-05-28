import { Request, Response } from "express"
import fs from 'fs'
import path from 'path'
import sanitize from 'sanitize-filename'
import { firestore } from '../../app'
import NewsInterface, {
  NewsStatus
} from "../../interfaces/documents/NewsInterface"
import { Privilege } from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import { StorageProvider, StoreFile } from '../../modules/Storage'

export function NewsData(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('news').doc(id).get().then(newsResult => {
    if (!newsResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'News not found',
        error: null
      })

      return
    }

    const news = {
      id: newsResult.id,
      ...newsResult.data()
    } as NewsInterface

    res.json(<APIResponse<{ news: NewsInterface }>>{
      success: true,
      data: {
        news: news
      }
    })
    return
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}

export async function SubmitNews(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const {
    category,
    title,
    description,
    content,
  } = req.body
  const { user } = res.locals
  const image = req.file

  const photos = req.files as Array<Express.Multer.File>

  try {
    let foundNews: NewsInterface | null = null

    if (id) {
      const newsResult = await firestore.collection('news').doc(id).get()

      if (newsResult.exists) {
        foundNews = {
          id: newsResult.id,
          ...newsResult.data()
        } as NewsInterface
      }
    }

    const news: NewsInterface = foundNews ?? {
      category: category,
      title: title,
      description: description,
      content: content,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: NewsStatus.Publish
    } as NewsInterface

    if (image) {
      const fileName = `trash-${Date.now()}-${sanitize(image.originalname)}`
      const dirPath = path.join(__dirname, `../../../public/uploads/${String(user.id)}`)

      const filePath = {
        local: image.path,
        public: path.join(`/uploads/${String(user.id)}/${fileName}`)
      }

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }

      const publicUrl = await StoreFile(filePath.public, filePath.local, StorageProvider.Firebase)

      news.image = publicUrl
    }

    if (foundNews) {
      await firestore.collection('news').doc(id).update(news)
    } else {
      await firestore.collection('news').add(news)
    }

    res.json(<APIResponse>{
      success: true,
      message: 'ok'
    })
    return
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
    return
  }
}

export function RemoveNews(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('news').doc(id).delete().then(deletedNews => {
    if (deletedNews === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'News not found',
        error: null
      })

      return
    }

    res.json(<APIResponse>{
      success: true,
      message: 'ok'
    })
    return
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}

export async function NewsList(req: Request, res: Response) {
  const { user } = res.locals

  try {
    const newsListResult = await firestore.collection('news').get()
    const newsList: Array<NewsInterface> = []

    newsListResult.docs.map((news) => newsList.push({
      id: news.id,
      ...news.data(),
    } as NewsInterface))

    res.json(<APIResponse<{ news: Array<NewsInterface> }>>{
      success: true,
      data: {
        news: newsList
      }
    })
    return
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}

export async function UpdateNewsStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const { status } = req.body

  try {
    const newsResult = await firestore.collection('news').doc(id).get()
    await firestore.collection('news').doc(id).update({
      ...newsResult.data(),
      status: status
    })

    if (!newsResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'News not found',
        error: null
      })

      return
    }

    res.json(<APIResponse>{
      success: true,
      message: 'Ok'
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}