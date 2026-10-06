/**
 * Utilitaire de compression et redimensionnement d'images côté client avant envoi.
 * Réduit les photos haute résolution (10 Mo+) à moins de 800 Ko en 1920x1080 max (JPEG 80%).
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {},
): Promise<File> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options

  // Si le fichier n'est pas une image ou est un SVG / GIF animé, retourner le fichier original
  if (!file || !file.type || !file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
    return file
  }

  return new Promise((resolve) => {
    const img = document.createElement('img')
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img

      // Calcul des nouvelles dimensions en conservant le ratio d'aspect
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        } else {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      // Rendu de haute qualité
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }
          // Si l'image compressée est plus lourde que l'originale, conserver l'originale
          if (blob.size >= file.size) {
            resolve(file)
            return
          }

          const compressedName = file.name.replace(/\.[^/.]+$/, '') + '.jpg'
          const compressedFile = new File([blob], compressedName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        },
        'image/jpeg',
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}

/**
 * Compresse un tableau de fichiers images en parallèle.
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {},
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImage(file, options)))
}
