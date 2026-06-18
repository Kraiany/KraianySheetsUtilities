/**
 * Create PDF file contents and save it to Google Drive, send as email attachement.
 * When batch is true , it iterates through a list of users defined in a named range, 
 * generates a PDF for each, and performs the specified delivery actions (savingto Drive, 
 * and emailing).
 * 
 * @param {Object} c - configuration hash
 * @param {Object} o - {} (Defaults: defaults = { batch: false, email: true, file: true };)
 */
function exportPDFs(c, exportOptions = {}) {
  const defaults = { batch: false, email: true, file: true };

  let context = c;
  const options = { ...defaults, ...exportOptions };
  
  context.delivery = {
    email: options.email,
    file: options.file,
    batch: options.batch
  }

  const folderName = renderString_(context.drive.subfolderFormat, context);
  const folderId =  createOrFindFolder( context.drive.parentFolder, folderName).getId();
  const folderUrl =  createOrFindFolder( context.drive.parentFolder, folderName).getUrl();
  context.pdf.folderName = folderName,
  context.pdf.folderId = folderId,
  context.pdf.folderUrl = folderUrl

  let userList =[];

  if (exportOptions.batch) { 
    userList =  getNamedRangeValues(context.dataRanges.bulkSendNames)
    if (context.delivery.email) {uiWarnBatchEmails(userList.length)};
  } else {
    userList = [ getNamedCellValue(context.dataRanges.personName)];
  }

  return (uiDeliveryProgress(userList,context));

} // exportPDFs
