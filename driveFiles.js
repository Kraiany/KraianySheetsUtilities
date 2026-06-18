/**
 * Creates or replaces file on Google drive from BLOB
 * 
 * @param {Blob} blob of the PDF or PNG file
 * @param {string} folderId ID of the Google Drive folder to save the file
 * @param {string} fileName
 * @param {boolean|null} quiet Optional. If true – do not  display alert
 * 
 * @return {DriveApp.file} driveFile
 *
 * TODO: Find way to update file instead of trashing, make in versioned.
 */
function createOrReplaceBlobFile(blob, folderID, fileName, quiet = false) {
  blob = blob.setName(fileName)
  const folder = DriveApp.getFolderById(folderID)
  const fileExists = folder.getFilesByName(fileName)
  
  while (fileExists.hasNext()) {
    fileExists.next().setTrashed(true)
  }
  const driveFile = folder.createFile(blob)

  if (!quiet) {
    notifyUser({message: `<p>Click to open <a href="${driveFile.getUrl()}" target="_blank">${fileName}</a></p>`,
    title: 'Export Successful'})
  }
  return driveFile
}

/**
 * Creates or replaces file on Google drive from text contents
 * 
 * @param {Folder} folder Google Drive folder to save the file
 * @param {string} fileName
 * @param {string} contents of the file
 * @param {MimeType} Enum MimeType. Ex.: image/png, image/jpg, text/plain, application/pdf
 * 
 * Reference for MimeType: https://developers.google.com/apps-script/reference/base/mime-type
*/
function createOrReplaceFile(folder, fileName, contents, mimeType) {
  const fileExists = folder.getFilesByName(fileName);
  if (fileExists.hasNext()) {
    fileExists.next().setTrashed(true)
  };
  return folder.createFile(fileName,contents,mimeType)
}