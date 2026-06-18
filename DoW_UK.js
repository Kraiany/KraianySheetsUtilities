/** Returns day of week in Ukrainian from given date
 * @param {date} date
 * @return {string} DoW
 * 
 * @customFunction
 */
function DAY_OF_WEEK_UA(date) {
  var options = { weekday: 'short', timeZone: Session.getScriptTimeZone() };
  return new Date(date).toLocaleDateString('uk-UA', options);
}