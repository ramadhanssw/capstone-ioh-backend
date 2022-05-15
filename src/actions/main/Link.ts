import { Request, Response } from "express"
import { Types } from "mongoose"
import LinkInterface, { LinkStatus } from "../../interfaces/documents/LinkInterface"
import { Privilege } from "../../interfaces/documents/UserInterface"
import { APIResponse } from "../../interfaces/response"
import Link from "../../schemas/Link"
import User from "../../schemas/User"

interface SubmitLinkBody {
  title: string
  url: string
  dateStart: string
  dateEnd: string
  status: LinkStatus
}

export async function SubmitLink(req: Request, res: Response) {
  const {
    id = undefined
  } = req.params as Record<string, string>
  
  const {
    title,
    url,
    status
  } = req.body as SubmitLinkBody

  const { user } = res.locals

  try {
    const foundLink = await Link.findOne({
      _id: Types.ObjectId(id)
    })

    const link = foundLink ?? new Link()
    
    link.writer = user._id
    link.title = title
    link.url = url
    link.status = status

    await link.save()

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

export function RemoveLink(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Link.findOneAndDelete({_id: Types.ObjectId(id)})
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

export function LinkData(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Link.findOne({_id: Types.ObjectId(id)})
      .then(link =>
        res.json(<APIResponse<{link: LinkInterface}>>{
          success: true,
          message: {
            link: link
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

export default function LinkList(req: Request, res: Response) {
  const { user } = res.locals

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
        $project: {
          title: '$title',
          url: '$url',
          writer: '$writer.fullname',
          writerId: '$writer._id',
          displayDate: '$displayDate',
          status: '$status'
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ]

    Link.aggregate(aggregateQuery)
      .then(links =>
        res.json(<APIResponse<{links: Array<LinkInterface>}>>{
          success: true,
          message: {
            links: links
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