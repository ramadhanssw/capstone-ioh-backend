import { Request, Response } from "express"
import { Types } from "mongoose"
import ArticleCategoryInterface, { ArticleCategoryStatus } from "../../interfaces/documents/ArticleCategoryInterface"
import { APIResponse } from "../../interfaces/response"
import ArticleCategory from "../../schemas/ArticleCategory"
import User from "../../schemas/User"

interface SubmitArticleCategoryBody {
  title: string
  description?: string
  status: ArticleCategoryStatus
}

export async function SubmitArticleCategory(req: Request, res: Response) {
  const { user } = res.locals

  const {
    id = undefined,
    department = undefined
  } = req.params

  const {
    title,
    description,
    status
  } = <SubmitArticleCategoryBody>req.body
  
  if (!department) {
    res.json(<APIResponse>{
      success: false,
      message: 'Department path is required'
    })

    return
  }

  try {
    const foundArticleCategory = await ArticleCategory.findOne({_id: Types.ObjectId(id)})
    const articleCategory = foundArticleCategory ?? new ArticleCategory()
    
    articleCategory.department = Types.ObjectId(department)
    articleCategory.title = title
    articleCategory.description = description
    articleCategory.status = status

    await articleCategory.save()

    res.json(<APIResponse>{
      success: true,
      message: 'Ok'
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export function RemoveArticleCategory(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    ArticleCategory.findOneAndDelete({_id: Types.ObjectId(id)})
      .then(()=>{
        res.json(<APIResponse>{
          success: true,
          message: 'Ok'
        })
      })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}

export function ArticleCategoryData(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    ArticleCategory.findOne({_id: Types.ObjectId(id)})
      .then(articleCategory =>
        res.json(<APIResponse<{articleCategory: ArticleCategoryInterface}>>{
          success: true,
          message: {
            articleCategory: articleCategory
          }
        })
      )
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export default function ArticleCategoryList(req: Request, res: Response) {
  const { department = undefined } = req.params as Record<string, string>
  
  try {
    const aggregateQuery = [
      {
        $match: {
          department: Types.ObjectId(department)
        }
      },
      {
        $project: {
          title: '$title',
          description: '$description',
          createdAt: '$createdAt',
        }
      }
    ]
    
    ArticleCategory.aggregate(aggregateQuery)
      .then(articleCategoryList =>
        res.json(<APIResponse<{articleCategoryList: Array<ArticleCategoryInterface>}>>{
          success: true,
          message: {
            articleCategoryList: articleCategoryList
          }
        })
      )
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}