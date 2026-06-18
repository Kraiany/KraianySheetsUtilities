/**
 * Створює або оновлює звіт по іменованим діапазонам на окремому аркуші.
 * Виправлена версія: використовує RichTextValue для створення надійних гіперпосилань.
 */
function updateNamedRangesSheetReport() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const reportSheetName = "Звіт по іменованим діапазонам";
  let reportSheet = spreadsheet.getSheetByName(reportSheetName);

  // --- 1. Створення або очищення аркуша для звіту ---
  if (!reportSheet) {
    reportSheet = spreadsheet.insertSheet(reportSheetName);
    const headers = [["Назва діапазону", "Аркуш", "A1 нотація", "Нотатки"]];
    const headerRange = reportSheet.getRange("A1:D1");
    headerRange.setValues(headers).setFontWeight("bold");
    reportSheet.setFrozenRows(1);
    reportSheet.getRange("A:D").setVerticalAlignment("middle");
  }

  // --- 2. Збір існуючих даних зі звіту ---
  const reportDataRange = reportSheet.getDataRange();
  const reportValues = reportDataRange.getValues().slice(1); 
  
  const reportMap = new Map();
  reportValues.forEach((row, index) => {
    const name = row[0];
    if (name) {
      reportMap.set(name, { rowIndex: index + 2, notes: row[3] });
    }
  });

  // --- 3. Отримання актуальних іменованих діапазонів ---
  const namedRanges = spreadsheet.getNamedRanges();
  const spreadsheetUrl = spreadsheet.getUrl();
  
  // --- 4. Оновлення існуючих та додавання нових записів ---
  let newRangesData = [];
  
  for (const namedRange of namedRanges) {
    try {
      const range = namedRange.getRange();
      const name = namedRange.getName();
      const sheet = range.getSheet();
      const sheetName = sheet.getName();
      const a1Notation = range.getA1Notation();
      const sheetId = sheet.getSheetId();
      
      // Створюємо URL-адреси
      const sheetUrl = `${spreadsheetUrl}#gid=${sheetId}`;
      const rangeUrl = `${spreadsheetUrl}#gid=${sheetId}&range=${a1Notation}`;

      // Створюємо об'єкти RichText для посилань
      const sheetLinkRichText = SpreadsheetApp.newRichTextValue()
        .setText(sheetName)
        .setLinkUrl(sheetUrl)
        .build();
      
      const rangeLinkRichText = SpreadsheetApp.newRichTextValue()
        .setText(a1Notation)
        .setLinkUrl(rangeUrl)
        .build();
      
      if (reportMap.has(name)) {
        // Оновлюємо існуючий рядок за допомогою .setRichTextValue()
        const { rowIndex } = reportMap.get(name);
        reportSheet.getRange(rowIndex, 2).setRichTextValue(sheetLinkRichText);
        reportSheet.getRange(rowIndex, 3).setRichTextValue(rangeLinkRichText);
        reportMap.delete(name);
      } else {
        // Додаємо дані для нового рядка
        newRangesData.push({
          name: name,
          sheetRichText: sheetLinkRichText,
          rangeRichText: rangeLinkRichText
        });
      }
    } catch (e) {
      Logger.log(`Помилка при обробці діапазону "${namedRange.getName()}": ${e.message}`);
      continue;
    }
  }
  
  // Додаємо нові рядки
  if (newRangesData.length > 0) {
    const firstNewRow = reportSheet.getLastRow() + 1;
    newRangesData.forEach((data, index) => {
      const currentRow = firstNewRow + index;
      reportSheet.getRange(currentRow, 1).setValue(data.name);
      reportSheet.getRange(currentRow, 2).setRichTextValue(data.sheetRichText);
      reportSheet.getRange(currentRow, 3).setRichTextValue(data.rangeRichText);
      reportSheet.getRange(currentRow, 4).setValue("");
    });
  }
  
  // (Опціональний блок видалення)
  /*
  const rowsToDelete = [];
  reportMap.forEach(data => rowsToDelete.push(data.rowIndex));
  rowsToDelete.sort((a, b) => b - a).forEach(rowIndex => {
    reportSheet.deleteRow(rowIndex);
  });
  */
  
  reportSheet.autoResizeColumns(1, 3);
  SpreadsheetApp.flush();
  Logger.log(`Звіт по іменованим діапазонам оновлено з надійними гіперпосиланнями.`);
  spreadsheet.setActiveSheet(reportSheet);
}