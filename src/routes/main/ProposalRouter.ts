import { Router } from "express"
import multer from "multer"
import ProposalList, { ProposalData, ProposalListByEvent, RemoveProposal, SubmitProposal } from "../../actions/main/Proposal"

const upload = multer()

const ProposalRouter = Router()

ProposalRouter.post(['/:id', '/'], upload.single('proposal'), SubmitProposal)

ProposalRouter.delete('/:id', RemoveProposal)

ProposalRouter.get('/event/:event', ProposalListByEvent)
ProposalRouter.get(['/:id'], ProposalData)
ProposalRouter.get('/', ProposalList)

export default ProposalRouter