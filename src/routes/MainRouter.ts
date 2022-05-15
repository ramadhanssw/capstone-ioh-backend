import dotenv from 'dotenv'
import { Request, Response, Router } from 'express'
import { Types } from 'mongoose'
import multer from 'multer'
import AnnouncementList, { AnnouncementData } from '../actions/main/Announcement'
import ArticleList, { ArticleData } from '../actions/main/Article'
import ArticleCategoryList, { ArticleCategoryData } from '../actions/main/ArticleCategory'
import DocumentList, { DocumentData } from '../actions/main/Document'
import LinkList, { LinkData } from '../actions/main/Link'
import TimelineList, { TimelineData } from '../actions/main/Timeline'
import TimelineEventList, { TimelineEventData } from '../actions/main/TimelineEvent'
import { UpdateUserData, UserPhoto } from '../actions/main/User'
import DepartmentInterface, { DepartmentStatus } from '../interfaces/documents/DepartmentInterface'
import { APIResponse } from '../interfaces/response'
import { Authentication } from '../middleware'
import Department from '../schemas/Department'
import User from '../schemas/User'

dotenv.config()

const MainRouter = Router()
const upload = multer()

MainRouter.post('/me', Authentication, upload.single('photo'), UpdateUserData)

MainRouter.get('/article-category/:id', ArticleCategoryData)
MainRouter.get('/article-category/', ArticleCategoryList)

MainRouter.get('/article/:id', ArticleData)
MainRouter.get('/article/', ArticleList)

MainRouter.get('/announcement/:id', AnnouncementData)
MainRouter.get('/announcement/', AnnouncementList)

MainRouter.get('/timeline/:id', TimelineData)
MainRouter.get('/timeline/', TimelineList)

MainRouter.get('/timeline-event/:id', TimelineEventData)
MainRouter.get('/timeline-event/', TimelineEventList)

MainRouter.get('/document/:id', DocumentData)
MainRouter.get('/document/', DocumentList)

MainRouter.get('/link/:id', LinkData)
MainRouter.get('/link/', LinkList)

MainRouter.get('/user/photo/:id', Authentication, UserPhoto)

MainRouter.get('/hostinfo/:host', (req: Request, res: Response): void => {
  const { host } = req.params

  Department.findOne({appHost: host})
    .then(department => {
      if (department === null) {
        res.json(<APIResponse>{
          success: false,
          message: 'Department data not found!'
        })

        return
      }

      res.json(<APIResponse<{department: DepartmentInterface}>>{
        success: true,
        message: {
          department: department
        }
      })
    })
    .catch(err =>
      res.json(<APIResponse>{
        success: false,
        message: 'Database error!',
        error: (err as Error).message
      })
    )
})

MainRouter.get('/department', (req: Request, res: Response) => {
  interface ResultInterface {
    _id: Types.ObjectId
    title: string
    icons: Array<string>
  }

  Department.find({status: DepartmentStatus.Active}, '_id title headquarterLocation accentColor')
    .then(departments =>
      res.json(<APIResponse<{departments: Array<ResultInterface>}>>{
        success: true,
        message: {
          departments: departments.map(department => ({
            _id: department._id,
            title: department.title,
            accentColor: department.accentColor,
            icons: [
              `/local-repo/${department._id.toString()}/assets/logo-square.png`,
              `/local-repo/${department._id.toString()}/assets/logo-wide.png`,
              `/local-repo/${department._id.toString()}/icon/favicon-16x16.png`,
              `/local-repo/${department._id.toString()}/icon/favicon-32x32.png`,
              `/local-repo/${department._id.toString()}/icon/favicon-96x96.png`,
              `/local-repo/${department._id.toString()}/icon/favicon-192x192.png`,
              `/local-repo/${department._id.toString()}/icon/ms-icon-144x144.png`
            ]
          }))
        }
      })
    )
    .catch(err =>
      res.json(<APIResponse>{
        success: false,
        message: 'Database error!',
        error: (err as Error).message
      })
    )
})

MainRouter.get('/department/:id', Authentication, (req: Request, res: Response): void => {
  const id = req.params.id

  Department.findOne({_id: Types.ObjectId(id)}).then(department => {
    if (department === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'Department not found',
        error: null
      })

      return
    }

    interface DepartmentResponse {
      title: string
      NPSN: string
      NSS: string
    }

    res.json(<APIResponse<{department: DepartmentResponse}>>{
      success: true,
      message: {
        department: {
          title: department.title,
        }
      }
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
})

MainRouter.get('/validate-email/:email', Authentication, (req: Request, res: Response): void => {
  const { email } = req.params

  User.findOne({email: {$regex: email, $options: 'i'}}).then(user => {
    res.json(<APIResponse<{isExist: boolean}>>{
      success: true,
      message: {
        isExist: user !== null
      }
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
})

MainRouter.get('/me', Authentication, (req: Request, res: Response): void => {
  res.json(<APIResponse<typeof res.locals>>{
    success: true,
    message: res.locals
  })
})

interface StorageParams {
  container: string
  folder: string
  file: string
}

MainRouter.get('/manifest.json', async (req: Request, res: Response) => {
  const { hostname, protocol } = req

  let departmentTitle = 'Garuda 21'
  let themeColor = '#E31E26'
  let logoPath = '/'

  try {
    const department = await Department.findOne({appHost: hostname})

    if (!department) {
      throw Error('Department not found!')
    }

    departmentTitle = department.title

    if (department.accentColor) {
      themeColor = department.accentColor
    }

    if (department.appIcon) {
      logoPath = `https:/api.garuda-21.com/local-repo/${department._id.toString()}/icon/`
    }
  } catch (error) {
    console.error('Failed get department!')
  } finally {
    res.json({
      name: departmentTitle,
      display: "standalone",
      start_url: `${protocol}/${hostname}`,
      theme_color: themeColor,
      background_color: "#FFFFFF",
      icons: [
        {
          src: `${logoPath}favicon-36x36.png`,
          sizes: "32x32",
          type: "image\/png",
          density: "0.75"
        },
        {
          src: `${logoPath}favicon-96x96.png`,
          sizes: "96x96",
          type: "image\/png",
          density: "2.0"
        },
        {
          src: `${logoPath}ms-icon-144x144.png`,
          sizes: "144x144",
          type: "image\/png",
          density: "3.0"
        },
        {
          src: `${logoPath}favicon-192x192.png`,
          sizes: "192x192",
          type: "image\/png",
          density: "4.0"
        }
      ]
    })
  }
})

MainRouter.get('/', (req: Request, res: Response): void => {
  res.json(<APIResponse<{currentTimestamp: Date}>>{
    success: true,
    message: {
      currentTimestamp: new Date()
    }
  })
})

export default MainRouter