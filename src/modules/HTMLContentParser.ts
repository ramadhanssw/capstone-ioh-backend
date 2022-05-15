import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export default function HTMLContentParser(HTMLContent: string): string {
  const DOM = new JSDOM(HTMLContent)
  const images = DOM.window.document.getElementsByTagName('img')
  const timestamp = Date.now()
  const randomKey = crypto.randomBytes(4).toString('hex')

  let fileName
  let image
  let imageBuffer

  for (let i = 0; i < images.length; i++) {
    image = images.item(i)?.src
    fileName = `parsed-image-${timestamp}-${randomKey}`

    if (image) {
      imageBuffer = Buffer.from(image, 'base64')
      fs.writeFileSync(path.join(__dirname, '../../public/parsed/', fileName), imageBuffer)
    }
  }

  return DOM.window.document.body.innerHTML
}