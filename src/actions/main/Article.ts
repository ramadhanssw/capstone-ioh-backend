import { Request, Response } from "express"
import { Types } from "mongoose"
import os from 'os'
import path from "path"
import sharp from "sharp"
import ArticleInterface, { ArticleStatus } from "../../interfaces/documents/ArticleInterface"
import ArticleCommentInterface, { ArticleCommentStatus } from "../../interfaces/documents/ArticleCommentInterface"
import { APIResponse } from "../../interfaces/response"
import { RemoveFile, StoreFile } from "../../modules/Storage"
import Article from "../../schemas/Article"
import ArticleCategory from "../../schemas/ArticleCategory"
import ArticleComment from "../../schemas/ArticleComment"
import User from "../../schemas/User"

interface SubmitArticleBody {
  title: string
  category: string
  summary: string
  content: string
  status: ArticleStatus
}

interface SubmitArticleCommentBody {
  article: string
  text: string
  status: ArticleCommentStatus
}

export async function SubmitArticle(req: Request, res: Response) {
  const { user } = res.locals

  const {
    id = undefined
  } = req.params

  const {
    title,
    category,
    summary,
    content,
    status
  } = <SubmitArticleBody>req.body

  const featuredImage = req.file

  try {
    const foundArticle = await Article.findOne({_id: Types.ObjectId(id)})
    const article = foundArticle ?? new Article()
    
    article.category = Types.ObjectId(category)
    article.writer = user._id
    article.title = title
    article.summary = summary
    article.content = content
    article.status = status

    await article.save()

    if (featuredImage) {
      const tmpPath = path.join(os.tmpdir(), `/article-${Date.now()}.jpg`)
      
      sharp(featuredImage.buffer)
        .resize(null, 300, {
          fit: 'cover',
          withoutEnlargement: true
        })
        .jpeg()
        .toFile(tmpPath, async () => {
          article.featuredImage = await StoreFile('public', `article/featured-article-${Date.now()}.jpg`, tmpPath, 'local')
          await article.save()
        })
    }

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

export function RemoveArticle(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Article.findOneAndDelete({_id: Types.ObjectId(id)})
      .then(removedArticle => {
        if (removedArticle !== null && removedArticle.featuredImage) {
          RemoveFile(removedArticle.featuredImage)
        }

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

export function ArticleData(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Article.findOne({_id: Types.ObjectId(id)})
      .then((article)=>{
        const view = article!.view ? article!.view + 1 : 1
        Article.findOneAndUpdate({_id: Types.ObjectId(id)}, {view: view})
          .then(article => res.json(<APIResponse<{article: ArticleInterface}>>{
            success: true,
            message: {
              article: article
            }
        }))
      })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export default function ArticleList(req: Request, res: Response) {
  try {
    const aggregateQuery = [
      {
        $lookup: {
          from: User.collection.collectionName,
          localField: 'writer',
          foreignField: '_id',
          as: 'writer'
        }
      },
      {
        $unwind: {
          path: '$writer'
        }
      },
      {
        $lookup: {
          from: ArticleCategory.collection.collectionName,
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: '$_id',
          title: '$title',
          summary: '$summary',
          writer: '$writer.fullname',
          writerId: '$writer._id',
          category: '$category.title',
          categoryId: '$category._id',
          createdAt: '$createdAt',
          featuredImage: '$featuredImage',
          view: '$view',
          likes: '$likes'
        }
      }
    ]
    
    Article.aggregate(aggregateQuery)
      .then(articles =>
        res.json(<APIResponse<{articles: Array<ArticleInterface>}>>{
          success: true,
          message: {
            articles: articles
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

export function ArticleListByCategory(req: Request, res: Response) {
  const { category = undefined } = req.params as Record<string, string>

  try {
    const aggregateQuery = [
      {
        $match: {
          category: category
        }
      },
      {
        $lookup: {
          from: User.collection.collectionName,
          localField: 'writer',
          foreignField: '_id',
          as: 'writer'
        }
      },
      {
        $unwind: {
          path: '$writer'
        }
      },
      {
        $project: {
          title: '$title',
          summary: '$summary',
          writer: '$writer.fullname',
          writerId: '$writer._id',
          createdAt: '$createdAt',
          featuredImage: '$featuredImage',
          view: '$view',
          likes: '$likes'
        }
      }
    ]
    
    Article.aggregate(aggregateQuery)
      .then(articles =>
        res.json(<APIResponse<{articles: Array<ArticleInterface>}>>{
          success: true,
          message: {
            articles: articles
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

export async function LikeArticle(req: Request, res: Response) {
  const { user } = res.locals

  const {
    id = undefined
  } = req.params

  try {
    const foundArticle = await Article.findOne({_id: Types.ObjectId(id)})
    const article = foundArticle ?? new Article()

    let foundLike = false
    
    if(article.likes) {
      if(article.likes.find((userLike)=>userLike==user._id.toString())) {
        article.likes = article.likes.filter((userLike)=>userLike!=user._id.toString())
        foundLike = true
      }
    }

    if(!foundLike) {
      if(article.likes) {
        article.likes.push(user._id)
      } else {
        article.likes = []
        article.likes.push( user._id)
      }
    }

    await article.save()
    
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

export async function SubmitArticleComment(req: Request, res: Response) {
  const { user } = res.locals

  const {
    id = undefined
  } = req.params

  const {
    text,
    status
  } = <SubmitArticleCommentBody>req.body

  try {
    const foundArticleComment = await ArticleComment.findOne({_id: Types.ObjectId(id)})
    const articleComment = foundArticleComment ?? new ArticleComment()
    
    articleComment.article = Types.ObjectId(id)
    articleComment.writer = user._id
    articleComment.text = text 
    articleComment.status = status

    await articleComment.save()
    
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

export function ArticleCommentList(req: Request, res: Response) {
  const { id = undefined } = req.params as Record<string, string>

  try {
    const aggregateQuery = [
      {
        $match: {
          article: Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: User.collection.collectionName,
          localField: 'writer',
          foreignField: '_id',
          as: 'writer'
        }
      },
      {
        $unwind: {
          path: '$writer'
        }
      },
      {
        $project: {
          text: '$text',
          writer: '$writer.fullname',
          writerId: '$writer._id',
          likes: '$likes',
          createdAt: '$createdAt',
        }
      }
    ]
    
    ArticleComment.aggregate(aggregateQuery)
      .then(articles =>
        res.json(<APIResponse<{articles: Array<ArticleCommentInterface>}>>{
          success: true,
          message: {
            articles: articles
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


export async function LikeArticleComment(req: Request, res: Response) {
  const { user } = res.locals

  const {
    id = undefined,
    department = undefined
  } = req.params
  
  if (!department) {
    res.json(<APIResponse>{
      success: false,
      message: 'Department path is required'
    })

    return
  }

  try {
    const foundArticleComment = await ArticleComment.findOne({_id: Types.ObjectId(id)})
    const articleComment = foundArticleComment ?? new ArticleComment()
    
    let foundLike = false
    
    if(articleComment.likes) {
      if(articleComment.likes.find((userLike)=>userLike==user._id.toString())) {
        articleComment.likes = articleComment.likes.filter((userLike)=>userLike!=user._id.toString())
        foundLike = true
      }
    }

    if(!foundLike) {
      if(articleComment.likes) {
        articleComment.likes.push(user._id)
      } else {
        articleComment.likes = []
        articleComment.likes.push(user._id)
      }
    }
    
    await articleComment.save()
    
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
