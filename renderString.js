/**
 * Renders a template string using a full context object.
 * @param {string} templateStr - The template string (e.g., "<?= year ?>年")
 * @param {Object} context - The root object containing all properties.
 */
function renderString_(templateStr, context) {
  const template = HtmlService.createTemplate(templateStr);

  Object.keys(context).forEach(key => {
    template[key] = context[key];
  });

  template.fetch =  getNamedCellValue;
  return template.evaluate().getContent();
}
