
/**
 * Application configuration settings for the Kraiany Sheets Engine.
 * -----------------------------------------------------------------
 * 
 * This configuration consists of two sections: 
 * * configuration object `appConfig` and options, and 
 * * helper function `getLiveDeliveryLog()`.
 * 
 * Configuration object `appConfig` 
 * ----------------------
 * 
 * This is an example of how to structure the configuration object for the
 * `exportPDFs()` function. The configuration object contains all necessary 
 * information for generating PDF statements and delivering them via email 
 * and/or saving to Google Drive.
 * 
 * Configuration object structure
 * ===============================
 * 
 * The configuration object is a nested structure that defines all necessary
 * parameters for generating and delivering the PDF statements. It includes
 * information about the delivery methods, data ranges, PDF templates,
 * email templates, and UI strings for progress updates.
 * 
 * Configuration object is passed to the main function that generates and
 * delivers PDF statements as `context`:
 * `KraianySheetUtilities.exportPDFs(exampleConfig.monthlyStatement, options)`
 * 
 * Properties 
 * ----------
 * 
 * * `organization` - {string} (REQUIRED) The name of the organization, used in email templates and file naming.
 * * `delivery` - (REQUIRED) Configuration for delivery methods. At least one method must be set to true.
 *   - `delivery.email` - If true, the generated PDF will be sent as an email attachment.
 *   - `delivery.file` - If true, the generated PDF will be saved to Google Drive.
 * * `drive` - (REQUIRED if `delivery.file === true`) Configuration for Google Drive delivery.
 *   - `drive.parentFolder` - (REQUIRED) ID of the parent folder where statements are saved. Under parent folder subfolder for each month are created.
 *   - `drive.subfolderFormat` - (REQUIRED) Format for subfolder naming. Can include template variables, e.g. `"<?= fetch(dataRanges.reportYear) ?>年<?= fetch(dataRanges.reportMonth) ?>月"`
 * * `dataRanges` - (REQUIRED) Named ranges in the spreadsheet that contain necessary data for generating statements.
 *   - `dataRanges.personName` - (REQUIRED) Cell reference for the person's name. This cell will be populated for each name in bulk or read when mail is sent to 1 person.
 *   - `dataRanges.personEmail` - (REQUIRED) Cell reference for the person's email. This cell is read for sending single email. Your Google Sheet formulas are responsible for populating this cell when name in `dataRanges.personName` changes (when sending bulk emails).
 *   - `dataRanges.bulkSendNames` - (REQUIRED for the bulk sending of emails) Cell reference for the list of names for bulk generation of email. Populates field `dataRanges.personName`.
 *   - (other) Other named cell names can be added here if they are used in templates. For example – year or month, etc.
 * * `pdf` - (REQUIRED) Configuration for PDF generation.
 *   - `pdf.printForm` - (REQUIRED) Named range that defines the print area for PDF generation, also used as a template for PDF content.
 *   - `pdf.fileName` - (REQUIRED) Template for naming the generated PDF files. Can include template variables, e.g. `[<?= organization ?>] - <?= fetch(dataRanges.personName) ?> - <?= fetch(dataRanges.reportYear) ?>.<?= fetch(dataRanges.reportMonth) ?>.pdf`
 * * `email` - (REQUIRED if delivery.email === true) Configuration for email delivery.
 *   - `email.subject` - Template for the email subject line. Can include template variables, e.g. `[<?= organization ?>] Платіжна відомість за <?= fetch(dataRanges.reportYear) ?>/<?= fetch(dataRanges.reportMonth) ?>`
 *   - `email.bcc` - (Optional) Email address to BCC on all outgoing emails.
 *   - `email.template.text` - (REQUIRED) Google Apps Script HTML template for the plain text body of the email.
 *   - `email.template.html` - (REQUIRED) Google Apps Script HTML template for the HTML body of the email.
 *   - `email.debug` - (Optional) Configuration for debugging email delivery.
 *     - `email.debug.debug` - If true, email sending will be skipped and email headers will be logged instead.
 *     - `email.debug.testEmail` - If specified, all emails will be sent to this address instead of the actual recipients.
 *     - `email.debug.level` - Level of logging for email headers. Higher number means more detailed logs.
 *   - `email.doNotSendEmail` - If true, email sending will be skipped. Email templates are parsed but only log is printed with email headers.
 * * `ui` - (REQUIRED) Configuration for UI strings used in HTML dialog(s).
 *   - `ui.progress` - Strings for progress HTML dialog window updates during the export process.
 *     - `ui.progress.title` - Title for the progress dialog.
 *     - `ui.progress.start_processing` - Template string for the initial processing message. Can include template variables, e.g. `🚀 Звітність по зарплатах за місяць...(<?= number ?> користувачів)`
 *     - `ui.progress.processing_user` - Template string for the message when processing each user. Can include template variables, e.g. `🔄 (<?= index ?>) Обробка користувача: <b><?=user?></b>`
 *     - `ui.progress.email_sent_to` - Template string for the message when an email is sent. Can include template variables, e.g. `✉️ Надіслано на пошту: <u><?=email?></u>`
 *     - `ui.progress.file_saved` - Template string for the message when a file is saved to Drive. Can include template variables, e.g. `📄 Збережено в Drive: <a href='<?= fileUrl ?>' target='_blank'> <?= fileName ?></a>`
 *     - `ui.progress.open_folder_link` - Template string for the message with a link to the folder where files are saved. Can include template variables, e.g. `"📂 Всі PDF файли збережені у <a href='<?= folderUrl ?>' target='_blank'> теці на диску</a>"`
 *     - `ui.progress.all_done` - String for the message when the process is completed, e.g. `"</ol><br><b>🎉 Процес завершено!</b>"`
 * -----
 * 
 * Options
 * -------
 * 
 * Optional parameters for the exportPDFs function can be passed as a second argument in the form of an options object:
 * `KraianySheetUtilities.exportPDFs(exampleConfig.monthlyStatement, {email: true, quiet: false})`
 * Options override default behaviors of the exportPDFs function. For example, you can choose to skip email sending or file saving while still generating the PDFs and updating the progress dialog.
 * 
 * The options object can include the following properties:
 * 
 * - `email` - If true, emails will be sent according to the configuration. If false, email sending will be skipped but all other processes (like PDF generation and file saving) will still occur.
 * - `file` - If true, files will be saved to Google Drive according to the configuration. If false, file saving will be skipped but all other processes (like PDF generation and email sending) will still occur.
 * - `batch` - If true, the function will process all names in the `dataRanges.bulkSendNames` list. If false, only the name currently in `dataRanges.personName` will be processed.
 * 
 * **Defaults**: `{email: true, file: true, batch: false}`
 * 
 * ----
 * 
 * Usage
 * -----
 * The configuration object is passed to the main function that generates and delivers PDF statements as `context`:
 * `const result = KraianySheetUtilities.exportPDFs(exampleConfig.monthlyStatement, options)`
 * 
 * ----
 * 
 * Helper function
 * ===============
 *  
 * Following function MUST live be created in calling script so
 * `google.script.run` can find it! It is used by the jQuery script in the HTML
 * dialog to fetch live updates of the delivery log. It binds the client-side
 * jQuery script to the server-side cache where delivery progress updates are
 * stored during the export process. 
 *
 * ``` 
 * function getLiveDeliveryLog() { 
 *    // Pass the incoming client request over to the 
 *    // KraianySheetsUtilities Library helper
 *    return KraianySheetsUtilities.getLiveDeliveryLog(); 
 * }
 * ```

-----

Full example of appConfig object
--------------------------------

```
const appConfig = {  
organization: "«Краяни»", 
delivery: {
    email: true, // Deliver email to user with PDF attachment
    file: true   // Save PDF to Drive Folder
    },
// REQUIRED if delivery.file === true
drive: {
    parentFolder: "1-DriveFolderId", 
    subfolderFormat: "<?= fetch(dataRanges.reportYear) ?>年<?= fetch(dataRanges.reportMonth) ?>月",
},
dataRanges: {
    personName:  "printRange.monthlySalary.name", // REQUIRED
    personEmail: "printRange.monthlySalary.email", // REQUIRED
    reportYear:  "printRange.monthlySalary.year",
    reportMonth: "printRange.monthlySalary.month",
    bulkSendNames: "monthlySalary.namesList", // REQUIRED for the bulk sending of emails.
},
pdf: {
    printForm: "printRange.monthlySalary", // PDF template // REQUIRED
    fileName:  "[<?= organization ?>] - <?= fetch(dataRanges.personName) ?> - <?= fetch(dataRanges.reportYear) ?>.<?= fetch(dataRanges.reportMonth) ?>.pdf", // REQUIRED
},
email: {
    subject: "[<?= organization ?>] Платіжна відомість за <?= fetch(dataRanges.reportYear) ?>/<?= fetch(dataRanges.reportMonth) ?>", // REQUIRED
    bcc: "bcc-email@example.com", // OPTIONAL
    // Accepted optional configs: cc, bcc, replyTo, from
    template: {
    text: HtmlService.createTemplateFromFile('example_txt'),// REQUIRED
    html: HtmlService.createTemplateFromFile('example'), // REQUIRED
    },
    // Optional
    debug: {
      debug: true,
      testEmail: "email@example.com", // if testEmail is specified, then all mails delivered to this address.
      level: 5, 
    },
    doNotSendEmail: true // Skip email sending. Only log is printed with email headers.
},
ui: {
    progress: {
    title: "Статус виконання",
    start_processing: "🚀 Звітність по зарплатах за місяць...(<?= number ?> користувачів)",
    processing_user: "🔄 (<?= index ?>) Обробка користувача: <b><?=user?></b>",
    email_sent_to: "✉️ Надіслано на пошту: <u><?=email?></u>",
    file_saved: "📄 Збережено в Drive: <a href='<?= fileUrl ?>' target='_blank'> <?= fileName ?></a>",
    open_folder_link: "📂 Всі PDF файли збережені у <a href='<?= folderUrl ?>' target='_blank'> теці на диску</a>",
    all_done: "</ol><br><b>🎉 Процес завершено!</b>"
    }
    }
  }
```
 */
function exampleConfig() {
}
