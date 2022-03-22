function testEdit()
{
  var ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PEOPLE");
  var cell = ws.getRange("L4");
  applyValidationsOnPeople(cell);
}

function onEdit(e)
{
  if (!e) throw new Error('Please do not run the script in the script editor window. It runs automatically when you edit the spreadsheet.');
  var cell = e.range;
  switch(cell.getSheet().getName())
  {
    case "PEOPLE": { applyValidationsOnPeople(e.range); break; }
  }
}

function applyValidationsOnPeople(cell)
{
  switch(cell.getSheet().getRange(3, cell.getColumn()).getValue())
  {
    case "Region": { applyPlaceValidationsOnPeople(cell); break; }
  }
}

function applyPlaceValidationsOnPeople(cell)
{
  var locations = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LOCATIONS");
  var region = cell.getValue();
  var place = cell.getSheet().getRange(cell.getRow(), cell.getColumn() + 1);
  if (region === "")
  {
    var values = ["- No Region -"];
    applyDataValidationToCell(values, place);
  }
  else
  {
    var list = locations.getRange(4, 1, locations.getLastRow()-1, 6).getValues();
    var filtered = list.filter(function(o){ return o[5] === region; })
    if (filtered.length === 0)
    {
      var values = ["- No Places -"];
      applyDataValidationToCell(values, place);
    }
    else
    {
      var values = filtered.map(function(o){ return o[0]});
      applyDataValidationToCell(values, place);
    }
  }
}

function applyDataValidationToCell(list, cell) 
{
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(list).build();
  cell.setDataValidation(rule);
}
