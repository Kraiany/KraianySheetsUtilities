/**
 * Create folder if it does not exist or return existing one.
 * This function used in `exportMonthlySalary()` and 
 * `exportMonthlySalariesAsPdfs()` functions. All data are looked 
 * up in named ranges.
 * 
 * Example: Child folder name is in the format: `{year}年{month}月`.
 * 
 * @param {string} parentFolderId Google Drive Folder Id
 * @param {string} folderName
 * @return {Folder} Google Drive folder
 */
function createOrFindFolder(parentFolderId, folderName) {
  const parentFolder = DriveApp.getFolderById(parentFolderId)
  
  const folders = parentFolder.getFolders();
  while (folders.hasNext()) {
    let folder = folders.next();
    let localName = folder.getName(); 
    if (localName === folderName) {
      // Logger.log(`Found existing folder :${folder}`)
      return folder
    }
  }
  const folder = parentFolder.createFolder(folderName)
  // Logger.log(`New Folder :${folder}`)
  return folder
}
