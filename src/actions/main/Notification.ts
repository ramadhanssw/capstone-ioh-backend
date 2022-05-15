import { Request, Response } from "express"
import { Types } from "mongoose"
import NotificationInterface, { NotificationCategory } from "../../interfaces/documents/NotificationInterface"
import { APIResponse } from "../../interfaces/response"
import Notification from "../../schemas/Notification"
import User from "../../schemas/User"
import firebase from 'firebase-admin'

enum NotificationScope {
  All = 'all',
  Department = 'department',
  Personal = 'personal'
}

interface SubmitNotificationBody {
  title: string
  body: string
  scope: NotificationScope
  category: NotificationCategory
  data: string
  receiver: string | Array<string>
}

export async function SubmitNotification(req: Request, res: Response) {
  const { user } = res.locals

  const {
    id = undefined
  } = req.params

  const {
    title,
    body,
    scope,
    category,
    data,
    receiver
  } = <SubmitNotificationBody>req.body
  

  let receiverList: Array<string> = []

  if(Array.isArray(receiver)) {
    receiverList = receiver
  } else {
    receiverList = [receiver]
  }

  try {
    const foundNotification = await Notification.findOne({_id: Types.ObjectId(id)})
    const notification = foundNotification ?? new Notification()
    
    notification.title = title
    notification.body = body
    notification.sender = user._id
    notification.category = category
    notification.data = data ? JSON.parse(data) : ''

    let userList: Array<Types.ObjectId> = []
    let fcmTokenList: Array<string> = []

    switch(scope) {
      case NotificationScope.Department:
        
      break

      case NotificationScope.Personal:
        await Promise.all(receiverList.map(async function (receiver){
          await User.findOne({
            _id: receiver
          }).then((user)=>{
            if(user?.meta.fcmToken) {
              fcmTokenList = [...fcmTokenList, ...user.meta.fcmToken]
            }
            userList.push(user?._id)
          })
        }))
      break

      default:
    }
    
    notification.receiverList = userList
    notification.readList = []
    
    if(fcmTokenList.length > 0) {
      
      const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
      }

      const payload = {
        'data': {
          'title': title,
          'body': body,
        }
      }

      await firebase.messaging().sendToDevice(fcmTokenList, payload, options)
    }

    await notification.save()

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

export function RemoveNotification(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Notification.findOneAndDelete({_id: Types.ObjectId(id)})
      .then(() => {
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

export function NotificationData(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>

  try {
    Notification.findOne({_id: Types.ObjectId(id)})
      .then((notification)=>{
        res.json(<APIResponse<{notification: NotificationInterface}>>{
          success: true,
          message: {
            notification: notification
          }
      })
      })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error!',
      error: (err as Error).message
    })
  }
}

export default async function NotificationList(req: Request, res: Response) {
  const { user } = res.locals
  
  const matchQuery: {[title: string]: any} = {
    receiverList: {
      $in: [user._id]
    }
  } 
  
  try {
    const aggregateQuery = [
      {
        $match: matchQuery
      },
      {
        $lookup: {
          from: User.collection.collectionName,
          localField: 'sender',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        $unwind: {
          path: '$sender'
        }
      },
      {
        $project: {
          title: '$title',
          body: '$body',
          category: '$category',
          sender: '$sender.fullname',
          senderId: '$sender._id',
          readList: '$readList',
          createdAt: '$createdAt'
        }
      }
    ]
    
    Notification.aggregate(aggregateQuery)
      .then(notifications=> res.json(<APIResponse<{notifications: Array<NotificationInterface>}>>{
        success: true,
        message: {
          notifications: notifications
        }
      }))
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}

export async function ReadNotificationList(req: Request, res: Response) {
  const { user } = res.locals
  
  const matchQuery: {[title: string]: any} = {
    receiverList: {
      $in: [user._id]
    }
  } 
  
  try {
    const aggregateQuery = [
      {
        $match: matchQuery
      },
      {
        $lookup: {
          from: User.collection.collectionName,
          localField: 'sender',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        $unwind: {
          path: '$sender'
        }
      },
      {
        $project: {
          title: '$title',
          body: '$body',
          category: '$category',
          sender: '$sender.fullname',
          senderId: '$sender._id',
          readList: '$readList',
          createdAt: '$createdAt'
        }
      }
    ]
    
    Notification.aggregate(aggregateQuery)
      .then(async function (notifications) 
        {
          await Promise.all(notifications.map(async function (notification) {
            
            if(notification.readList.filter((reader: string)=>reader==user._id.toString()).length == 0) {
             const readNotification = await Notification.findOne({
               _id: notification._id
             })
             readNotification?.readList.push(user._id)
             await readNotification?.save()
            }
          }))

          res.json(<APIResponse<{notifications: Array<NotificationInterface>}>>{
            success: true,
            message: {
              notifications: notifications
            }
          })
        }
      )
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}


export async function ReadNotification(req: Request, res: Response) {
  const { user } = res.locals

  const {
    id = undefined,
  } = req.params

  try {
    const foundNotification = await Notification.findOne({_id: Types.ObjectId(id)})

    if (foundNotification === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'Notification not found',
        error: null
      })

      return
    }

    const notification = foundNotification

    if(!notification.readList.includes(user._id)) {
      notification.readList.push(user._id)
    }

    await notification.save()
    
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