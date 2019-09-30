function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var indvAgentMenu = ui.createMenu('Single Agent').addItem('For Today', 'singleAgentForToday').addItem('For Specific Date', 'singleAgentForCustomDate');
  var groupAgentMenu = ui.createMenu('All Agents').addItem('For Today', 'multiAgentForToday').addItem('For Specific Date', 'multiAgentForCustomDate');
  var filterMenu = ui.createMenu('Filter').addItem('Refresh Filter', 'reportFilter').addItem('Clear Filters', 'clearAll');
  ui.createMenu('Utilities').addSubMenu(ui.createMenu('Generate Sheets').addSubMenu(groupAgentMenu).addSubMenu(indvAgentMenu))
  .addSubMenu(filterMenu).addToUi();
}
