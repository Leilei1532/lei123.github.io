// TypeScript: Directory Scanner to Generate Manifest.json

import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { DeviceInfo, FirmwareInfo, scanDirectory } from './base'

export const md5 = (contents: string) =>
  crypto.createHash('md5').update(contents).digest('hex')

// PROPOSED
// const proposed = {
//   device: "Device model",
//   version: [
//     {
//       firmware: "Firmware download address",
//       versionType: "version type,gd,rf etc",
//       version: "version no.",
//       updated: "Update time",
//       size: "Size",
//       checksum: "document verification code, md5 or sha1 check code",
//     },
//   ],
// };


// Function to generate manifest.json file
async function generateManifest(dirPath: string, outputPath: string) {
  try {
    const deviceInfo = await scanDirectory(dirPath)
    await fs.promises.writeFile(outputPath, JSON.stringify(deviceInfo, null, 2))
    console.log(`Manifest generated at ${outputPath}`)
  } catch (error) {
    console.error('Error generating manifest:', error)
  }
}

// Example usage
const targetDirectory = './public/gear/' // Directory to scan
const manifestPath = './public/manifest.json' // Output manifest file path
generateManifest(targetDirectory, manifestPath)
