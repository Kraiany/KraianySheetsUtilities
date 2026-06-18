/**
 * Shows HTML formatted alert to user
 * @param {alert = title: String, message: String}
 * @return: void
 */
function notifyUser (alert) {
   const htmlOutput = HtmlService
      .createHtmlOutput('<hr>'+ alert.message)
      .setWidth(alert.width || 300)
      .setHeight(alert.height || 120) 
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, alert.title)
}
