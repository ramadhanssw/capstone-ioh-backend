import { Request, Response } from "express"
import { firestore } from '../../app'
import NewsCategoryInterface from "../../interfaces/documents/NewsCategoryInterface"
import { APIResponse } from "../../interfaces/response"

export function NewsCategoryData(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('newsCategories').doc(id).get().then(newsCategoryResult => {
    if (!newsCategoryResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'newsCategory not found',
        error: null
      })

      return
    }

    const newsCategory = {
      id: newsCategoryResult.id,
      ...newsCategoryResult.data()
    } as NewsCategoryInterface

    res.json(<APIResponse<{ newsCategory: NewsCategoryInterface }>>{
      success: true,
      data: {
        newsCategory: newsCategory
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

export async function SubmitNewsCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const {
    title,
    description,
  } = req.body
  const { user } = res.locals

  try {
    let foundNewsCategory: NewsCategoryInterface | null = null

    if (id) {
      const newsCategoryResult = await firestore.collection('newsCategories').doc(id).get()

      if (newsCategoryResult.exists) {
        foundNewsCategory = {
          id: newsCategoryResult.id,
          ...newsCategoryResult.data()
        } as NewsCategoryInterface
      }
    }

    const newsCategory: NewsCategoryInterface = foundNewsCategory ?? {
      title: title,
      description: description,
      createdBy: user.id,
    } as NewsCategoryInterface

    if (foundNewsCategory) {
      await firestore.collection('newsCategories').doc(id).update(newsCategory)
    } else {
      await firestore.collection('newsCategories').add(newsCategory)
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

export function RemoveNewsCategory(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('newsCategories').doc(id).delete().then(deletedNewsCategory => {
    if (deletedNewsCategory === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'News category not found',
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

export async function NewsCategoryList(req: Request, res: Response) {
  try {
    const newsCategoriesResult = await firestore.collection('newsCategories').get()
    const newsCategories: Array<NewsCategoryInterface> = []

    newsCategoriesResult.docs.map((newsCategory) => newsCategories.push({
      id: newsCategory.id,
      ...newsCategory.data(),
    } as NewsCategoryInterface))

    res.json(<APIResponse<{ newsCategories: Array<NewsCategoryInterface> }>>{
      success: true,
      data: {
        newsCategories: newsCategories
      }
    })
    return
  } catch(err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}

export async function UpdateNewsCategoryStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const { status } = req.body

  try {
    const newsCategoryResult = await firestore.collection('newsCategories').doc(id).get()
    await firestore.collection('newsCategories').doc(id).update({
      ...newsCategoryResult.data(),
      status: status
    })

    if (!newsCategoryResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'News category not found',
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