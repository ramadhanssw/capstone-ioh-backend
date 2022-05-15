import { Router } from "express"
import LinkList, { LinkData, RemoveLink, SubmitLink } from "../../actions/main/Link"

const LinkRouter = Router()

LinkRouter.post(['/:id', '/'], SubmitLink)

LinkRouter.delete('/:id', RemoveLink)

LinkRouter.get('/:id', LinkData)
LinkRouter.get('/', LinkList)

export default LinkRouter