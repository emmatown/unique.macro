import fs from 'fs'
import path from 'path'
import hashString from './hash'

// babel-plugin-styled-components
// https://github.com/styled-components/babel-plugin-styled-components/blob/37a13e9c21c52148ce6e403100df54c0b1561a88/src/visitors/displayNameAndId.js#L49-L93

const findModuleRoot = filename => {
  if (!filename || filename === 'unknown') {
    return null
  }
  let dir = path.dirname(filename)
  if (fs.existsSync(path.join(dir, 'package.json'))) {
    return dir
  } else if (dir !== filename) {
    return findModuleRoot(dir)
  } else {
    return null
  }
}

const FILE_HASH = 'unique-macro-file-hash'
const CALL_POSITION = 'unique-macro-position'

const getFileId = state => {
  const { file } = state
  // hash calculation is costly due to fs operations, so we'll cache it per file.
  if (file.get(FILE_HASH)) {
    return file.get(FILE_HASH)
  }
  const filename = file.opts.filename
  // find module root directory
  let moduleRoot = ''
  let filePath = ''
  let moduleName = ''
  if (moduleRoot) {
    try {
      moduleRoot = findModuleRoot(filename)
      filePath =
        moduleRoot && path.relative(moduleRoot, filename).replace(path.sep, '/')
      moduleName = require(path.join(moduleRoot, 'package.json')).name
    } catch (e) {}
  }
  const code = file.code

  const fileHash = moduleName + filePath + code
  file.set(FILE_HASH, fileHash)
  return fileHash
}

const getNextId = state => {
  const id = state.file.get(CALL_POSITION) || 0
  state.file.set(CALL_POSITION, id + 1)
  return id
}

const getId = state => {
  return hashString(getFileId(state) + getNextId(state))
}

export default getId
