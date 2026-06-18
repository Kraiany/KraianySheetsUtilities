/**
 * Function to get value of a single cell in a spreadsheet. 
 * Cell should be declared as a named range. 
 * If range is not single cell, then top/left [0][0] cell's value is returned
 * @param {NamedRange} namedCell named range of a cell
 * @returns Value of a cell
 */ 
function getNamedCellValue(namedCell) {
  let range = getNamedRangeByName(namedCell)
  return range.getValues()[0][0]
}

/**
 * Get values of a named range as Array. Array is flattened and compacted.
 * @param {NamedRange} namedRange name of the named range
 * @returns {Array} Array of values
*/
function getNamedRangeValues(namedRange) {
  let range = getNamedRangeByName(namedRange)
  const values = range.getValues().flat().filter( Boolean )
  return values
}
/**
 * Takes name of named range and returns range as class Range
 * @param {string} rangeName - name of the named range
 * @return {Range}
*/
function getNamedRangeByName (rangeName) {
  let namedRange
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let url = spreadsheet.getUrl()
  let allNamedRanges = spreadsheet.getNamedRanges()

  for (let i = 0; i < allNamedRanges.length; i++) {
    if (allNamedRanges[i].getName() === rangeName) {
      namedRange = allNamedRanges[i]
    }
  }
  if (!namedRange) {
    notifyUser({ 
      message: `No named range found. Please add area with the name <code>${rangeName}</CODE> as named range .`, 
      title: `${rangeName}: no such named range`
      })   
    return
  }
  return namedRange.getRange()
}
