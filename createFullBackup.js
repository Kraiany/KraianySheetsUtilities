/**
 * EXAMPLE USAGE AS A LIBRARY
 * * If this script is deployed as a library named 'KraianySheetUtilities', 
 * you can call it from your main project's onOpen() function like this:
 * * function onOpen() {
 * const ui = SpreadsheetApp.getUi();
 * ui.createMenu('🛠️ Utils')
 * .addItem('Create Full Backup', 'KraianySheetUtilities.createFullBackup();')
 * .addToUi();
 * }
 * * function runLibraryBackup() {
 * // Ensure you have set the Script Properties in the PROJECT 
 * // where the library is being CALLED.
 * KraianySheetUtilities.createFullBackup();
 * }
 */

/**
 * @fileoverview Spreadsheet Backup Utility
 * * This script performs a comprehensive backup of the active Google Spreadsheet.
 * * MAIN FEATURES:
 * 1. Creates a named version marker using Developer Metadata.
 * 2. Generates a timestamped copy of the spreadsheet in a designated Drive folder.
 * 3. Unlinks Google Forms from the backup copy using the Form API.
 * 4. Moves duplicate backup forms to the trash.
 * 5. Provides a TRULY clickable HTML link to the backup folder.
 * * REQUIRED SCRIPT PROPERTIES IN THE MAIN PROJECT:
 * - BACKUP_FOLDER_ID: The ID of the Google Drive folder for storing backups.
 * - VERSION_PREFIX: A string prefix for versioning metadata.
 * * @author Gemini
 * @version 1.5
 */

function createFullBackup(evt,folderId, prefix) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ssId = ss.getId();
  let ui = null;
  try {
    ui = SpreadsheetApp.getUi(); 
  } catch (e) {
    Logger.log("KraianySheetsUtilities.createFullBackup: ui is not defined. Running from trigger.");
    // If run by a trigger, getUi() might throw an error immediately here,
    // so keeping ui = null is a safe fallback.
  }

  // if (!evt) {
  //   const ui = SpreadsheetApp.getUi();
  // };


/*
Add this to the main script
function runLibraryBackup() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const folderId = scriptProperties.getProperty('BACKUP_FOLDER_ID');
  const prefix = scriptProperties.getProperty('VERSION_PREFIX') || "BACKUP";
  
  KraianySheetUtilities.createFullBackup(folderId, prefix);
}  
*/  

  const timestamp = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd_HH-mm-ss");
  const originalName = ss.getName();
  const backupName = `[BACKUP ${timestamp}] ${originalName}`;

  try {
    // 1. Version Marker
    ss.addDeveloperMetadata("backup_version", `${prefix}${timestamp}`);

    // 2. Create the physical copy
    const destinationFolder = DriveApp.getFolderById(folderId);
    const folderUrl = destinationFolder.getUrl(); 
    
    const backupFile = DriveApp.getFileById(ssId).makeCopy(backupName, destinationFolder);
    const backupSs = SpreadsheetApp.openById(backupFile.getId());

    // 3. Process and Cleanup Forms in the Backup Copy
    const sheets = backupSs.getSheets();
    sheets.forEach(sheet => {
      const formUrl = sheet.getFormUrl();
      if (formUrl) {
        try {
          const form = FormApp.openByUrl(formUrl);
          form.removeDestination();
          DriveApp.getFileById(form.getId()).setTrashed(true);
        } catch (err) {
          console.error(`Could not unlink form on ${sheet.getName()}: ${err.message}`);
        }
      }
    });


    // 4. SHOW CLICKABLE HTML DIALOG
    const htmlOutput = HtmlService
      .createHtmlOutput(
        `<div style="font-family: sans-serif; line-height: 1.5;">
          <p style="color: #0b8043; font-weight: bold; font-size: 16px;">✅ Backup Successful</p>
          <p>File created: <b>${backupName}</b></p>
          <p>You can view all backups in the folder below:</p>
          <a href="${folderUrl}" target="_blank" 
             style="display: inline-block; padding: 10px 15px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 4px;">
             Open Backup Folder
          </a>
          <br><br>
          <button onclick="google.script.host.close()" style="cursor: pointer;">Close</button>
        </div>`
      )
      .setWidth(400)
      .setHeight(250);
  

  if (!evt) {
        ui.showModalDialog(htmlOutput, 'Backup Status')
  };


  } catch (err) {
    console.error(`Backup Error: ${err.toString()}`);
  if (!evt && ui) {
      ui.alert(`❌ Backup Failed: ${err.toString()}`);
    }  
  }
}