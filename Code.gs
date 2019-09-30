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

function getAgentNameInput() {
  var ui = SpreadsheetApp.getUi();
  var agents = getAgentNames();
  var agent;
  while (!agent) {
    agent = ui.prompt('Enter Agent', 'Please enter the agent name the sheet should be created for.', ui.ButtonSet.OK_CANCEL);
    
    if (agent.getSelectedButton() !== ui.Button.OK) return;
    
    agent = agent.getResponseText().toLowerCase();
    agent = agent[0].toUpperCase() + agent.slice(1);
    
    if (agents.indexOf(agent) === -1) {
      ui.alert('Invalid Agent', 'No agents with the name "' + agent + '" were found in the agent names list in the "Settings" sheet. Please try again.', ui.ButtonSet.OK);
      agent = null;
    }
  }
  
  return agent;
}

function confirm(title, message, buttons) {
  var ui = SpreadsheetApp.getUi();
  var input = ui.alert(title, message, buttons);
  return input === ui.Button.OK || input === ui.Button.YES;
}