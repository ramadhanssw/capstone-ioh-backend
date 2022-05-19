import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { v4 as uuid } from 'uuid';
import { storageRef } from '../app';

dotenv.config()

export enum StorageProvider {
  Local="local",
  Firebase="firebase"
}

async function StoreOnLocal(destinationPath: string, localPath: string): Promise<string> {
  if (!fs.existsSync(localPath)) {
    throw new Error('Local path not exists!')
  }

  const fullDestinationPath = path.join(__dirname, '../../public/uploads/', destinationPath)
  const directory = path.dirname(fullDestinationPath)

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {
      recursive: true
    })
  }

  return new Promise<string>((resolve, reject) => {
    fs.copyFile(localPath, fullDestinationPath, err => {
      if (err) {
        reject(err)
      }

      resolve(`/local-repo/${destinationPath}`)
    })
  })
}

async function StoreOnFirebase(destinationPath: string, localPath: string): Promise<string> {
  if (!fs.existsSync(localPath)) {
    throw new Error('Local path not exists!')
  }

  return new Promise<string>(async (resolve, reject)=>{
    try {
      const uploadResponse = await storageRef.upload(localPath, {
        public: true,
        destination: destinationPath,
        metadata: {
          firebaseStorageDownloadTokens: uuid(),
        }
      });

      return resolve(uploadResponse[0].metadata.mediaLink)
    } catch (err) {
      reject(err)
    }
  })
}

export async function StoreFile( destinationPath: string, localPath: string, storageProvider: StorageProvider = StorageProvider.Local): Promise<string> {
  let storedLocation: string =destinationPath
  
  switch (storageProvider) {
    case 'local':
      storedLocation = await StoreOnLocal(storedLocation, localPath)
      break
    
    case 'firebase':
      storedLocation = await StoreOnFirebase(storedLocation, localPath)
      break

    default:
      throw new Error('Storage provider not valid!')
  }

  return storedLocation
}

export async function RemoveFile(filePath: string): Promise<void> {
  const [, provider, instance, ...filePathArray] = filePath.split('/')
  const joinedPath = filePathArray.join('/')

  switch (provider) {
    case 'local-repo':
      return new Promise<void>((resolve, reject) => {
        fs.unlink(path.join(__dirname, `../../public/uploads/${instance}/${joinedPath}`), err => {
          if (err) {
            reject(err)
          }

          resolve()
        })
      })

    default:
      throw new Error('Storage provider not valid!')
  }
}