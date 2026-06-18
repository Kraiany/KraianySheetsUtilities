/**
 * Send email to a user with attached PDF.
 * @param {Object} context - Configuration hash for the application.
 * @param {Array} attachments - Array of Blob objects or file descriptors
 */
function sendEmail_(context, attachments) {

  const emailContents = renderFiles_(context);

  const recipient =  getNamedCellValue(context.dataRanges.personEmail);
  const name =  getNamedCellValue(context.dataRanges.personName)
  if (!recipient) {
    throw new Error("Recipient email address is missing for " + name);
  }

  let emailOptions = {
    to: recipient,
    subject: emailContents.subject,
    body: emailContents.text,
    htmlBody: emailContents.html,
  };
  
  Object.keys(context.email).forEach(key => {
    if (["cc", "bcc", "replyTo", "from"].includes(key) && context.email[key]) {
      emailOptions[key] = context.email[key];
    }
  });

  const debug = (context.email.debug && context.email.debug.debug === true)
  const debugLevel = (context.email.debug && context.email.debug.level)

  if (debug) {
    if (context.email.debug.testEmail) {
        emailOptions.to = context.email.debug.testEmail;
    }
    if (debugLevel > 5) {
      Logger.log("Debug Email options (2):" + JSON.stringify(emailOptions));
    }
  }

  emailOptions.attachments = attachments;

  let result ={
    debugLevel: context.email.debug && context.email.debug.level,
    result: true,
    name: name,
    message: "Email sent successfully",
  };

  if (context.email.doNotSendEmail && context.email.doNotSendEmail === true ) {
    Logger.log ("doNotSendEmail is set. Not devlivering email.")
    result.message = `NOTE: ${result.message} (doNotSendEmail is set. Not devlivering email)`
  } else {
    MailApp.sendEmail(emailOptions)
  }


  Object.keys(emailOptions).forEach(key => {
    if (key != 'attachments' && key != 'body' && key != 'htmlBody') {
      result[key] = emailOptions[key]
    } else {
      if (key === 'attachments') {
        result['fileName'] = attachments[0].fileName
      }
    }
  })
  
  let logLine = "";
  if (debug) {
    Object.keys(result).forEach(key => {
      logLine = logLine + `${key.padEnd(10)}: ${result[key]}\n`
    })
    Logger.log(logLine)
  } 

  return(result);
}
