import { Router } from "express"
import NotificationList, { NotificationData, ReadNotification, ReadNotificationList, RemoveNotification, SubmitNotification } from "../../actions/main/Notification"

const NotificationRouter = Router()

NotificationRouter.post('/read/:id', ReadNotification)
NotificationRouter.post(['/:id', '/'], SubmitNotification)

NotificationRouter.delete('/:id', RemoveNotification)

NotificationRouter.get('/', NotificationList)
NotificationRouter.get('/read/', ReadNotificationList)
NotificationRouter.get('/:id', NotificationData)

export default NotificationRouter