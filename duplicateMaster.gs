function newDaySetup() {
  duplicateMasterSheet(null, getAgentNames())
}

function singleAgentForToday() {
  var ui = SpreadsheetApp.getUi();
  if (!confirm('Are you sure?', 'You are about to generate a new sheet for an individual agent for today. Continue?', ui.ButtonSet.YES_NO)) return;
  
  duplicateMasterSheet('today', [getAgentNameInput()]);
}

function singleAgentForCustomDate() {
  var ui = SpreadsheetApp.getUi();
  if (!confirm('Are you sure?', 'You are about to generate a new sheet for an individual agent for a custom date. Continue?', ui.ButtonSet.YES_NO)) return;
  
  duplicateMasterSheet(null, [getAgentNameInput()]);
}

function multiAgentForToday() {
  var ui = SpreadsheetApp.getUi();
  if (!confirm('Are you sure?', 'You are about to generate a new sheet for all agents for today. Continue?', ui.ButtonSet.YES_NO)) return;
  
  duplicateMasterSheet('today', getAgentNames());
}

function multiAgentForCustomDate() {
  var ui = SpreadsheetApp.getUi();
  if (!confirm('Are you sure?', 'You are about to generate a new sheet for all agents for a custom date. Continue?', ui.ButtonSet.YES_NO)) return;
  
  duplicateMasterSheet(null, getAgentNames());
}

function duplicateMasterSheet(date, agents) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var master = ss.getSheetByName('Master');
  var checked = false;
  var sheetName;
  
  date = getDate(date);
  ss.getRangeByName('Master!Date').setValue(date);
  
  if (typeof agents === 'string') agents = [agents];
  
  for (var i = 0; i < agents.length; i++) {
    ss.getRangeByName('Master!AgentName').setValue(agents[i]);
    SpreadsheetApp.flush();
    sheetName = agents[i] + '-' + date;
    
    if (ss.getSheetByName(sheetName)) {
      ui.alert('Skipping Existing Sheet',
               'The sheet "' + sheetName + '" already exists. Nothing will be done to this sheet. No new sheet will be created for this agent/date combo.',
               ui.ButtonSet.OK);
      continue;
    }
    master.copyTo(ss).setName(sheetName);
  }
  
  ss.getRangeByName('Master!AgentName').clearContent();
  ss.getRangeByName('Master!Date').clearContent();
}

function getDate(date) {
  var ui = SpreadsheetApp.getUi();
  var checked = false;
  
  if (!date && ui) {
    while (!checked) {
      date = ui.prompt('Enter Date',
                       'Please enter date in the following format (mm/dd/yyyy). Leave this field blank to use the current date.',
                       ui.ButtonSet.OK_CANCEL);
      if (date.getSelectedButton() === ui.Button.CANCEL) return;
      
      date = date.getResponseText();
      if (date) {
        if (date.indexOf('/') === -1) {
          ui.alert('Invalid Format', 'The format (' + date + ') is not valid. Please make sure to use "/" to separate the date.', ui.ButtonSet.OK);
          continue;
        }
        
        checked = true;
        date = date.split('/').map(function (item) {
          var int = parseInt(item, 10);
          if (isNaN(int)) checked = false;
          return int;
        });
        
        if (date.length !== 3 || !checked) {
          ui.alert('Error', 'There was an error parsing the date. Please Try again.', ui.ButtonSet.OK);
        } else if (date[0] < 1 || date[0] > 12) {
          checked = false;
          ui.alert('Invalid Month', 'The month entered (' + date[0] + ') is not a valid month.', ui.ButtonSet.OK);
        } else if (date[1] < 1 || date[1] > 31) {
          checked = false;
          ui.alert('Invalid Date', 'The day entered (' + date[1] + ') is not a valid day.', ui.ButtonSet.OK);
        } else if (date[2] < 2019) {
          checked = false;
          ui.alert('Invalid Year', 'The year entered (' + date[2] + ') is not a valid year. Please enter a year of "2019" or later.', ui.ButtonSet.OK);
        }
        
        continue;
      }
      
      checked = true;
    }
  }
  
  if (!date || date === 'today') {
    date = new Date();
    date = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
  }
  
  if (typeof date === 'object') date = date.join('/');
  
  return date;
}