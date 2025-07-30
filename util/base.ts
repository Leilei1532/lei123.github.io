import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

export interface FirmwareInfo {
  firmware: string
  type: 'gd' | 'rf'
  version: string,
  updated: string
  size: number
  md5: string
}

export interface DeviceInfo {
  device: string
  files: FirmwareInfo[]
  // FirmwareInfo[];
}

// Function to scan a directory and collect firmware details from subfolders
export async function scanDirectory(dirPath: string): Promise<DeviceInfo[]> {
  const devices = await fs.promises.readdir(dirPath, { withFileTypes: true })

  const result = await Promise.all(
    devices
      .filter(dirent => dirent.isDirectory())
      .map(async (device) => {
        const filePath = path.join(dirPath, device.name)
        const files = await fs.promises.readdir(filePath, {
          withFileTypes: true,
        })

        const firmwares = await Promise.all(
          files
          .filter(dirent => !dirent.name.startsWith('.') && !dirent.name.endsWith('md'))
          .map(async (file) => {
            const fullFilePath = path.join(filePath, file.name)
            const stats = await fs.promises.stat(fullFilePath)
            const url =
              '/' + fullFilePath.split('\\').slice(1).join('/')
            const fileContents = await fs.promises.readFile(
              fullFilePath
            )
            const md5 = crypto
              .createHash('md5')
              .update(fileContents)
              .digest('hex')

            const version = file.name.split('_')[1]

            ensureVersionMatch(fullFilePath, version)

            return <FirmwareInfo>{
              firmware: url,
              type: file.name.split('.').slice(-2)[0],
              version: version,
              updated: stats.ctime.toISOString(),
              size: stats.size,
              md5: md5,
            }
          })
        )

        return <DeviceInfo>{
          device: device.name,
          files: firmwares,
        }
      })
  )

  // console.log(JSON.stringify(result))
  return result
}



export function ensureVersionMatch(filePath: string, version: string): string[] {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const versionPattern = /\b\d+\.\d+\.\d+\b/g;
  const versions = fileContent.match(versionPattern);
  const gear = filePath.split('/').slice(-2)[0]
  const type = filePath.split('.').slice(-2)[0]

  const v = version.replace(/^v/i, '')

  if (versions && !versions?.includes(v)) {
    console.log(`⚠️ WARN: Version Mismatch for ${gear} (${type}) \n  Filename: ${v}\n  Embedded: ${versions}\n  ${filePath}\n`, )
  }

  return versions || [];
}