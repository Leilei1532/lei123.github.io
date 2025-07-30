# Rogue Firmware Repository

This project houses firmware for all Rogue devices.

It is a read-only static site that generates a manfest based on public folder contents automatically on all code pushes.

- #dev branch --> [https://dev.rogue-firmware.pages.dev](https://dev.rogue-firmware.pages.dev)

- #main branch -> [https://rogue-firmware.pages.dev](https://rogue-firmware.pages.dev)

## Guidelines

- Changes to firmwware MUST be done with a version bump to the semantic version x.x.x. The version in the filename is what apps use to determine if an upgrade is necessary.

- The version embedded in the firmware MUST match the filename.  The version in the firmware is displayed by apps and utilities (not the filename), so the embbeded version MUST match the filename version.

## Setup

```
pnpm i
pnpm build
```

## Usage

To add a new device, create a folder where the folder name matches the equipment key for that device in the `public/gear/' directory.

Add the latest firmware to the folder.

Firmware filenames should follow this format:

`readable-name_VERSION_extra-info.TYPE.extension`

NOTE:
* Hyphens should be used to seperate readable words
* Underscores are used to seperate the VERSION
* TYPE is extracted with dots before the extension


Run `pnpm build` to generate a generate an updated manifest file with the new device contents.

Push the contents to the git repo to publish the new firmware.

NOTE: When adding a new firmware to a device, move the old firmware to the corresponding 'archive' folder.

## ISSUES

1. Discuss how to set keys for device names/skus/firmware compatibilties
2. Who will have access/permissions to publish
3. Do we need any read-access controls

## TODO

- [x] Ensure filename parsing fails when metadata cannot be extracted
- [ ] Implement changesets
- [ ] Implement Husky for precommit validations
- [x] Publish dev/prod instances
- [ ] Transfer to Rogue ownership
