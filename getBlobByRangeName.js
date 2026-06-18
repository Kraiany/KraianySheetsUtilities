/** 
 * Returns blob by named range name and current spreadsheet
 * @param {namedRange} rangeName 
 * @param {number} scale - specifies whether page is sclled to fith width (4) or height (3)
 * 
 * @return {blob}
 */
function getBlobByRangeName (rangeName,scale) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const url         = spreadsheet.getUrl()
  const range       = getNamedRangeByName(rangeName)
    // PDF view
  const sheet = range.getSheet()
  return getRangeAsBlob_(url, sheet , range,scale)
}

/**
 * Converts a specified range to a PDF blob. Used by getBlobByRangeName and 
 * getBlobByRange functions.
 * Note: the export URL and parameters are reverse-engineered and may break 
 * in the future if Google changes their implementation.
 * @param {string} url 
 * @param {Sheet} sheet 
 * @param {Range} range 
 * @param {number} scale 
 * @returns {Blob}
 */
function getRangeAsBlob_(url, sheet, range, scale) {
  let rangeParam =
      '&r1=' + (range.getRow() - 1)
      + '&r2=' + range.getLastRow()
      + '&c1=' + (range.getColumn() - 1)
      + '&c2=' + range.getLastColumn()
  let sheetParam = '&gid=' + sheet.getSheetId()

  let scaleParam = scale ? 3 : 4

  // A credit to https://gist.github.com/Spencer-Easton/78f9867a691e549c9c70
  // these parameters are reverse-engineered (not officially documented by Google)
  // they may break overtime.
  let exportUrl = url.replace(/\/edit.*$/, '')
      + '/export?exportFormat=pdf&format=pdf'
      + '&size=a4'
      + '&scale=' + scaleParam // fit height - 3, fit width - 4
      + '&portrait=true' 
      + '&top_margin=0.1'              
      + '&bottom_margin=0.1'          
      + '&left_margin=.5'             
      + '&right_margin=.5'           
      + '&sheetnames=false&printtitle=false'
      + '&pagenum=UNDEFINED' // change it to CENTER to print page numbers
      + '&gridlines=false'
      + '&fzr=true'      
      + sheetParam
      + rangeParam
      
  let response
  let i = 0
  for (; i < 5; i += 1) {
    response = UrlFetchApp.fetch(exportUrl, {
      muteHttpExceptions: true,
      headers: { 
        Authorization: 'Bearer ' +  ScriptApp.getOAuthToken(),
      },
    })
    if (response.getResponseCode() === 429) {
      // printing too fast, retrying
      Utilities.sleep(3000)
    } else {
      break
    }
  }
  if (i === 5) {
    throw new Error('Printing failed. Too many sheets to print.')
  }
  return response.getBlob()
}