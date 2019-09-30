function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Utilities').addItem('Create Today\'s Sheets', 'newDaySetup')
  .addItem('Clear Filters', 'clearAll')
  .addItem('Refresh Filter', 'reportFilter').addToUi();
}
