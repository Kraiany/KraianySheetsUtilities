/**
 * Generates and returns an HtmlOutput object from the library's internal assets
 * @param {string} filename - The name of the HTML file inside the library
 * @param {string} title - Optional title for the modal dialog box
 * @return {HtmlOutput}
 */
function getLibraryHtml(filename, title = "Dialog") {
  // 🚀 CRITICAL: This reads the HTML file from the LIBRARY'S file tree, not the main script!
  return HtmlService.createTemplateFromFile(filename)
    .evaluate()
    .setTitle(title);
}