/**
 * Show warning to user before sending batch emails. Stops execution if user cancels.
 * 
 * @param {Number} number - Number of emails to be sent.
 * @return {void}
 * 
 */
function uiWarnBatchEmails (number) {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
  `If you continue this would send emails to ${number} people` + 
  " Are you sure you want to continue?",
  ui.ButtonSet.YES_NO
  )
  if (response !== ui.Button.YES) { 
    Logger.log("Canceling email export on user request")
    throw new Error("Operation cancelled by user")
    }
}
