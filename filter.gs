function reportFilter() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var sheets = ss.getSheets();
  var ignoreSheets = ['Primary', 'Settings', 'Master'];
  var sheet = ss.getSheetByName('Primary');
  var filter = sheet.getRange(2, 1, 1, 4).getValues()[0];
  var selection;
  filter = {
    agent: filter[0],
    month: filter[1],
    day: filter[2],
    year: filter[3],
  };
  
  sheets = sheets.map(function (sheet) {
    var name = sheet.getSheetName();
    
    if (ignoreSheets.indexOf(name) !== -1) return false;
    
    name = name.split('-');
    var agent = name[0].toLowerCase();
    var date = name[1].split('/');
    
    if (
      (!filter.agent || filter.agent.toLowerCase() === agent) &&
      (!filter.month || filter.month == date[0]) &&
      (!filter.day || filter.day == date[1]) &&
      (!filter.year || filter.year == date[2])
      ) {
        sheet.showSheet();
        return true;
      }
    
    sheet.hideSheet();
    return false;
  });
  
  if (filter.agent && filter.month && filter.day && filter.year && sheets.indexOf(true) === -1) {
    var date = [filter.month, filter.day, filter.year].join('/');
    var dayEmpty = allAgentCheck(date);
    
    if (dayEmpty) {
      selection = ui.alert('No Sheets Found',
                           'There were no sheets found for any agents with the filtered date. Would you like to create all agent sheets for the date (' + date + ')?',
                           ui.ButtonSet.YES_NO_CANCEL);
      if (selection === ui.Button.YES) {
        duplicateMasterSheet(date, getAgentNames());
        return reportFilter();
      }
      if (selection === ui.Button.CANCEL) return;
    }
    
    selection = ui.alert('No Sheets Found',
             'There were no sheets found for ' + filter.agent + ' on ' + date + '. Would you like to create one?',
             ui.ButtonSet.YES_NO);
    
    if (selection === ui.Button.YES) {
      duplicateMasterSheet(date, [filter.agent]);
      return reportFilter();
    }
  }
}

function allAgentCheck(date) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var agents = getAgentNames();
  
  agents = agents.filter(function (agent) {
    var name = agent + '-' + date;
    var sheet = ss.getSheetByName(name);
    return !!sheet;
  });
  
  return agents.length === 0;
}

function test () {
  allAgentCheck('9/30/2019');
}
