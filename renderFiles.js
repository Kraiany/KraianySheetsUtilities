/**
 * Render HTML and TXT template files. 
 * Template can have complex variables that can pull data from named range cell, 
 * and parsing strings which also can pull data from a cell.
 * 
 * Example strings:
 *     <h1>  <?= render(context.email.subject, context) ?> </h1>
 *     <p> Шановн(а/ий) п. <?= fetch(context.dataRanges.personName) ?>, 
 * 
 * where  context.email.subject is:
 * 
 * subject: "[<?= organization ?>] Платіжна відомість за <?= fetch(dataRanges.reportYear) ?>/<?= fetch(dataRanges.reportMonth) ?>",
 * 
 * fetch() - pull data from named cell.
 * render() - renders a string.
 * 
 * @param {Object} context - Configuration hash for the application.
 * 
 * @return {Object} evaluated templates.
 */
function renderFiles_(context) {
  let template = {}
  let result = {
    subject: renderString_(context.email.subject, context),
    html: "",
    text: ""
  }
  
  for (const key of ["html", "text"]) {

    template[key] = context.email.template[key] //HtmlService.createTemplateFromFile(context.email.template[key])
    Object.keys(context).forEach(dataKey => {
      if (dataKey !== 'email') {
        template[key][dataKey] = context[dataKey];
      }
    });

    template[key].fetch   =  getNamedCellValue;
    template[key].context = context;             
    template[key].render  = renderString_;

    result[key] = template[key].evaluate().getContent()
  }
  return (result);
}
