import { Request, Response } from "express"
import fs from 'fs'
import { Types } from "mongoose"
import sanitize from "sanitize-filename"
import DocumentInterface, { DocumentStatus } from "../../interfaces/documents/DocumentInterface"
import { Privilege } from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import { StoreFile } from "../../modules/Storage"
import Department from "../../schemas/Department"
import Document from "../../schemas/Document"
import User from "../../schemas/User"

interface SubmitDocumentBody {
  department: string
  title: string
  description: string
  status: DocumentStatus
}

export async function SubmitDocument(req: Request, res: Response) {
  const {
    id = undefined
  } = req.params as Record<string, string>

  const {
    title,
    description,
    status
  } = req.body as SubmitDocumentBody

  const file = req.file

  const { user } = res.locals

  console.log(req.body)
  console.log(file)

  try {
    const foundDocument = await Document.findOne({
      _id: Types.ObjectId(id)
    })

    const document = foundDocument ?? new Document()

    document.title = title
    document.description = description
    document.createdBy = user._id
    
    if (status) {
      document.status = status
    }

    if (file) {
      const timestamp = Date.now()

      const tmpPath = `${"public/uploads"}/document-${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9\ \.]/g, '')}`

      fs.writeFileSync(tmpPath, file.buffer)

      document.file = await StoreFile(
        null,
        `document/document-${timestamp}-${sanitize(file.originalname)}`,
        tmpPath,
        "local"
      )
    }

    await document.save()

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

export function RemoveDocument(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Document.findOneAndDelete({ _id: Types.ObjectId(id) })
      .then(() =>
        res.json(<APIResponse>{
          success: true,
          message: 'Ok'
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

export function DocumentData(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Document.findOne({ _id: Types.ObjectId(id) })
      .then(document =>
        res.json(<APIResponse<{ document: DocumentInterface }>>{
          success: true,
          message: {
            document: document
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

export function DocumentListByEvent(req: Request, res: Response) {
  const { user } = res.locals
  const { event } = req.params as Record<string, string>

  let matchQuery = {}

  if (user.privilege == Privilege.Staff) {
    matchQuery = {
      timelineEvent: Types.ObjectId(event),
      department: user.meta.department
    }
  } else {
    matchQuery = {
      timelineEvent: Types.ObjectId(event),
    }
  }

  const aggregateQuery = [
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: Department.collection.collectionName,
        localField: 'department',
        foreignField: '_id',
        as: 'department'
      }
    },
    {
      $unwind: {
        path: '$department'
      }
    },
    {
      $lookup: {
        from: User.collection.collectionName,
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy'
      }
    },
    {
      $unwind: {
        path: '$createdBy'
      }
    },
    {
      $lookup: {
        from: User.collection.collectionName,
        localField: 'reviewer',
        foreignField: '_id',
        as: 'reviewer'
      }
    },
    {
      $project: {
        title: '$title',
        department: '$department.title',
        departmentId: '$department._id',
        description: '$description',
        reviewer: '$reviewer.fullname',
        reviewerId: '$reviewer._id',
        file: '$file',
        scores: '$scores',
        comment: '$comment',
        status: '$status',
        createdBy: '$createdBy.fullname',
        createdById: '$createdBy._id',
        createdAt: '$createdAt'
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ]

  try {
    Document.aggregate(aggregateQuery)
      .then(documents => {
        res.json(<APIResponse<{ documents: Array<DocumentInterface> }>>{
          success: true,
          message: {
            documents: documents
          }
        })
        return
      }
      )
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export default function DocumentList(req: Request, res: Response) {
  try {

    const aggregateQuery = [
      {
        $lookup: {
          from: User.collection.collectionName,
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      {
        $unwind: {
          path: '$createdBy'
        }
      },
      {
        $project: {
          title: '$title',
          description: '$description',
          file: '$file',
          createdBy: '$createdBy.fullname',
          createdById: '$createdBy._id',
          status: '$status'
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ]

    Document.aggregate(aggregateQuery)
      .then(documents =>
        res.json(<APIResponse<{ documents: Array<DocumentInterface> }>>{
          success: true,
          message: {
            documents: documents
          }
        })
      )
  } catch (err) {
    res.json(<APIResponse>({
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    }))
  }
}