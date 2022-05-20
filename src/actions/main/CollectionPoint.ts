import { Request, Response } from "express"
import { firestore } from '../../app'
import CollectionPointInterface, {
  CollectionPointStatus
} from "../../interfaces/documents/CollectionPointInterface"
import { APIResponse } from "../../interfaces/response"

export function CollectionPointData(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('collectionPoints').doc(id).get().then(collectionPointResult => {
    if (!collectionPointResult.exists) {
      res.json(<APIResponse>{
        success: false,
        message: 'Collection Point not found',
        error: null
      })

      return
    }

    const collectionPoint = {
      id: collectionPointResult.id,
      ...collectionPointResult.data()
    } as CollectionPointInterface

    res.json(<APIResponse<{ collectionPoint: CollectionPointInterface }>>{
      success: true,
      data: {
        collectionPoint: collectionPoint
      }
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}

export async function SubmitCollectionPoint(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const {
    title,
    description,
    latitude, 
    longitude,
    status
  } = req.body
  
  try {
    let foundCollectionPoint: CollectionPointInterface | null = null

    if(id) {
      const collectionPointResult = await firestore.collection('collectionPoints').doc(id).get()

      if(collectionPointResult.exists) {
        foundCollectionPoint = {
          id: collectionPointResult.id,
          ...collectionPointResult.data()
        } as CollectionPointInterface
      }
    }

    const collectionPoint: CollectionPointInterface = foundCollectionPoint ?? {
      title: title,
      description: description,
      latitude: parseInt(latitude),
      longitude: parseInt(longitude),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: CollectionPointStatus.Active
    } as CollectionPointInterface

    collectionPoint.title = title
    collectionPoint.description = description
    collectionPoint.latitude = parseInt(latitude)
    collectionPoint.longitude = parseInt(longitude)
    collectionPoint.status = status ?? CollectionPointStatus.Active

    if(foundCollectionPoint) {
      await firestore.collection('collectionPoints').doc(id).update(collectionPoint)
    } else {
      await firestore.collection('collectionPoints').add(collectionPoint)
    }

    res.json(<APIResponse>{
      success: true,
      message: 'ok'
    })
  } catch (err) {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  }
}

export function RemoveCollectionPoint(req: Request, res: Response): void {
  const { id } = req.params

  firestore.collection('collectionPoints').doc(id).delete().then(deletedCollectionPoint => {
    if (deletedCollectionPoint === null) {
      res.json(<APIResponse>{
        success: false,
        message: 'CollectionPoint not found',
        error: null
      })

      return
    }

    res.json(<APIResponse>{
      success: true,
      message: 'ok'
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}

export function CollectionPointList(req: Request, res: Response): void {
  firestore.collection('collectionPoints').get().then(collectionPointsResult => {
    const collectionPoints: Array<CollectionPointInterface> = []
    
    collectionPointsResult.docs.map((collectionPoint)=>collectionPoints.push({
      id: collectionPoint.id,
      ...collectionPoint.data(),
    } as CollectionPointInterface))

    res.json(<APIResponse<{ collectionPoints: Array<CollectionPointInterface> }>>{
      success: true,
      data: {
        collectionPoints: collectionPoints
      }
    })
  }).catch(err => {
    res.json(<APIResponse>{
      success: false,
      message: 'Database error',
      error: (err as Error).message
    })
  })
}