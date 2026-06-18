/**
 * 
 */
function uiDeliveryProgress(userList,context) {
  const ui = SpreadsheetApp.getUi();
  const cache = CacheService.getScriptCache();

  const strings = context.ui.progress;
  
  cache.put("delivery_log", `<b>${renderString_(strings.start_processing, {number: userList.length})}</b>||`);
  
  const htmlDialog =  getLibraryHtml('ProgressDialog', 'Status');

  htmlDialog
    .setWidth(450)
    .setHeight(350);
  ui.showModalDialog(htmlDialog, strings.title);

  let deliveryResult = {};
  let index = 0;
  userList.forEach((user) => {
    index++;
     getNamedRangeByName(context.dataRanges.personName).setValue(user);
    deliveryResult[user] = deliverLoad(user,context, index);
  });

  let currentLog = cache.get("delivery_log") || "";
  let fiolder_link = "";
  if (context.delivery.file) {
    fiolder_link = `<b>${renderString_(strings.open_folder_link, {folderUrl: context.pdf.folderUrl})}</b><br>`;
  } 
  cache.put("delivery_log", currentLog + fiolder_link + `</ol><b>${strings.all_done}</b>||<!-- PROCESS_END -->`);

  return (deliveryResult)
} // uiDeliveryProgress

// Target function for jQuery script framework
function getLiveDeliveryLog() {
  return CacheService.getScriptCache().get("delivery_log") || "";
}

/**
 * Deliver the generated PDF to Drive or Email.
 * 
 * @param {string} user - The name of the user beingprocessed.
 * @param {Object} context - The configuration object.
 * @return {Object} The result of the delivery operation.
 *
 */
function deliverLoad(user,context, index) {
  const strings = context.ui.progress;
  const cache = CacheService.getScriptCache();
  
  const appendLog = (msg) => {
    let current = cache.get("delivery_log") || "";
    cache.put("delivery_log", current + msg + "||"); // Glue on the delimiter marker
  };

  const subItem = (template, data, index="") => {
    if (index != "") { 
      return (`<div class="sub-item"><b>(${index})</b>&nbsp;<i>${renderString_(template, data)}</i></div>`)
    } else {
      return (`<div class="sub-item">&nbsp;&nbsp;&nbsp;<i>${renderString_(template, data)}</i></div>`)
    }
  }
  appendLog(`<li>${subItem(strings.processing_user, {user: user, index: Math.round(index)})} `);
  
  const blob = pdf_(context);
  const fileName = renderString_(context.pdf.fileName, context);
  let result = { name: user };

  if (context.delivery.file) {
    const fileName = renderString_(context.pdf.fileName, context);

    result.file = saveFile_(blob, context.pdf.folderId, fileName);
    const fileUrl = result.file.url;
    appendLog(subItem(strings.file_saved, {fileName: fileName, fileUrl: fileUrl}));
  } 
  
  if (context.delivery.email) {
    const email =  getNamedCellValue(context.dataRanges.personEmail);
    const attachments = [{
      fileName: fileName,
      content: blob.getBytes(),
      mimeType: "application/pdf"
    }];

    result.email = sendEmail_(context, attachments);
    appendLog(subItem(strings.email_sent_to,{email: result.email.to})); // Email sent
  }

  return result;
}