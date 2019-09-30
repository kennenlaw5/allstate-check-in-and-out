function filterFieldNames() { return ['name', 'month', 'day', 'year']; }
function filterSheetName() { return 'Primary'; }
function clearInput(fieldName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(filterSheetName());
  var fields = filterFieldNames();
  var fieldColumn = fields.indexOf(fieldName.toLowerCase()) + 1;
  
  if (!fieldColumn) throw 'Could not find target field "' + fieldName + '".';
  
  sheet.getRange(2, fieldColumn).setValue('');
}

function clearName() { clearInput('name'); }
function clearMonth() { clearInput('month'); }
function clearDay() { clearInput('day'); }
function clearYear() { clearInput('year'); }
function clearAll() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(filterSheetName());
  sheet.getRange(2, 1, 1, filterFieldNames().length).setValue('');
}

function getAgentNames() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var agents = ss.getRangeByName('AgentNames').getValues();
  agents = agents.map(function (agent) {
    return agent[0];
  });
  agents = agents.filter(function (agent) {
    return !!agent;
  });
  
  return agents;
}

