import { Request, Response } from "express"
import fs from 'fs'
import path from 'path'
import sanitize from 'sanitize-filename'
import { firestore } from '../../app'
import TrashReportInterface, {
  TrashData,
  TrashReportStatus
} from "../../interfaces/documents/TrashReportInterface"
import UserInterface, { Privilege } from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import { StorageProvider, StoreFile } from '../../modules/Storage'

export function TrashReportData(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('trashReports').doc(id).get().then(trashReportResult => {
    if (!trashReportResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'TrashReport not found',
        error: null
      })

      return
    }

    const trashReport = {
      id: trashReportResult.id,
      ...trashReportResult.data()
    } as TrashReportInterface

    res.json(<APIResponse<{ trashReport: TrashReportInterface }>>{
      success: true,
      data: {
        trashReport: trashReport
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

export async function SubmitTrashReport(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const {
    title,
    description,
    trashList,
    point,
    collectionPoint
  } = req.body
  const { user } = res.locals

  const photos = req.files as Array<Express.Multer.File>

  try {
    let foundTrashReport: TrashReportInterface | null = null

    if (id) {
      const trashReportResult = await firestore.collection('trashReports').doc(id).get()

      if (trashReportResult.exists) {
        foundTrashReport = {
          id: trashReportResult.id,
          ...trashReportResult.data()
        } as TrashReportInterface
      }
    }

    const trashReport: TrashReportInterface = foundTrashReport ?? {
      title: title,
      description: description,
      user: user.id,
      point: parseInt(point),
      collectionPoint: collectionPoint,
      trashList: [] as Array<TrashData>,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: TrashReportStatus.InProgress
    } as TrashReportInterface

    if (trashList) {
      const parsedTrashList = JSON.parse(trashList) as Array<TrashData>
      const newTrashList: Array<TrashData> = []

      await Promise.all(parsedTrashList.map(async (trash, index) => {
        if (photos[index] !== undefined) {
          const fileName = `trash-${Date.now()}-${sanitize(photos[index].originalname)}`
          const dirPath = path.join(__dirname, `../../../public/uploads/${String(user.id)}`)

          const filePath = {
            local: photos[index].path,
            public: path.join(`/uploads/${String(user.id)}/${fileName}`)
          }

          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath)
          }

          const publicUrl = await StoreFile(filePath.public, filePath.local, StorageProvider.Firebase)

          newTrashList.push({
            title: trash.title,
            category: trash.category,
            quantity: parseInt(trash.quantity.toString()),
            photo: publicUrl,
            createdAt: new Date(trash.createdAt)
          })
        }
      }))
      trashReport.trashList = newTrashList
    }

    if (foundTrashReport) {
      await firestore.collection('trashReports').doc(id).update(trashReport)
    } else {
      await firestore.collection('trashReports').add(trashReport)
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

export function RemoveTrashReport(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('trashReports').doc(id).delete().then(deletedTrashReport => {
    if (deletedTrashReport === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'TrashReport not found',
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

export async function TrashReportList(req: Request, res: Response) {
  const { user } = res.locals

  try {
    const trashReportsResult = user.privilege == Privilege.Admin ? await firestore.collection('trashReports').get() : await firestore.collection('trashReports').where('user', '==', user.id).orderBy('createdAt', 'desc').limit(5).get()
    const trashReports: Array<TrashReportInterface> = []

    trashReportsResult.docs.map((trashReport) => trashReports.push({
      id: trashReport.id,
      ...trashReport.data(),
    } as TrashReportInterface))

    res.json(<APIResponse<{ trashReports: Array<TrashReportInterface> }>>{
      success: true,
      data: {
        trashReports: trashReports
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

export async function UpdateTrashReportStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const { status } = req.body

  try {
    const trashReportResult = await firestore.collection('trashReports').doc(id).get()
    await firestore.collection('trashReports').doc(id).update({
      ...trashReportResult.data(),
      status: status
    })

    if (!trashReportResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'TrashReport not found',
        error: null
      })

      return
    }

    const trashReport = {
      ...trashReportResult.data(),
      id: trashReportResult.id
    } as TrashReportInterface


    if(trashReport.status === TrashReportStatus.Completed) {
      res.json(<APIResponse>{
        success: false,
        message: 'TrashReport not found',
        error: null
      })

      return
    }

    const userResult =  await firestore.collection('users').doc(trashReport.user).get()
    const user = {
      ...userResult.data(),
      id: userResult.id
    }

    res.json(<APIResponse<{
      user: UserInterface,
      trashReport: TrashReportInterface
    }>>{
      success: true,
      message: 'Ok',
      data: {
        user: user,
        trashReport: trashReport
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