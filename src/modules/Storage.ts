import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

export type StorageProvider = 'local'

const {
  STORAGE_PROVIDER = 'local'
} = process.env as { STORAGE_PROVIDER: StorageProvider}

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
export async function StoreFile(instance: string | null, destinationPath: string, localPath: string, storageProvider: StorageProvider = STORAGE_PROVIDER): Promise<string> {
  let storedLocation: string = instance ? `${instance}/${destinationPath}` : destinationPath
  
  switch (storageProvider) {
    case 'local':
      storedLocation = await StoreOnLocal(storedLocation, localPath)
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