# KraianySheetsUtilities

[![GitHub](https://img.shields.io/badge/GitHub-Kraiany-blue)](https://github.com/Kraiany/KraianySheetsUtilities)

A Google Apps Script utility collection for working with Google Sheets, Drive, PDF export, and email delivery workflows.

**Repository**: https://github.com/Kraiany/KraianySheetsUtilities

## Project structure

- `appsscript.json` — Apps Script project manifest
- `exampleConfig.js` — example configuration file
- `createFullBackup.js` — backup generation utilities
- `driveFiles.js` — Google Drive file and folder helpers
- `findOrCreateFolder.js` — folder lookup / creation helper
- `exportPDFs.js` — PDF generation and delivery orchestration
- `pdf.js` — PDF export helper functions
- `renderString.js` — template string renderer
- `renderFiles.js` — email/template renderer using HTML templates
- `sendEmail.js` — email sending helper with attachments
- `getBlobByRangeName.js` — blob creation by named range
- `nameRanges.js` — named range support utilities
- `NamedRangesReport.js` — named range reporting
- `getLibraryHtml.js` — library HTML helper
- `uiDelieveryProgress.js` — delivery progress UI helper
- `uiWarnBatchEmails.js` — batch email warning dialog
- `UI.js` — general UI helpers
- `ProgressDialog.html` — progress dialog HTML template
- `DoW_UK.js` — utility for day-of-week formatting in Ukrainian
- `JapaneseYear.js` — Japanese year formatting helper

## Summary

This repository is designed for spreadsheet-driven workflows that need export, delivery, and reporting capabilities around Google Sheets data. It includes utilities for rendering templates, generating PDFs, managing Drive folders, emailing attachments, and showing UI dialogs during operations.

## Setup

1. Open the project in the Google Apps Script editor or use `clasp` for local development.
2. Copy `exampleConfig.js` to a local configuration file if needed, then update IDs, email settings, and template references.
3. Grant required permissions for Drive, Spreadsheet, HTML service, and Mail services when prompted.

## Usage

- Run `exportPDFs` to generate PDFs and optionally deliver them by email or save them to Drive.
- Use `sendEmail` and `renderFiles` to build HTML/text email content from templates.
- Use `nameRanges` and `NamedRangesReport` for named range management and reporting.
- Use UI helpers like `uiWarnBatchEmails` and `uiDelieveryProgress` to display prompts and progress during batch operations.

## Development

Optional `clasp` workflow:

```bash
npm install -g @google/clasp
clasp login
clasp clone <scriptId>
```

Then push or pull files using the Apps Script project ID.

## Getting the code

Clone this repository:

```bash
git clone https://github.com/Kraiany/KraianySheetsUtilities.git
cd KraianySheetsUtilities
```

## License

This project is maintained by Kraiany. See LICENSE file for details.
