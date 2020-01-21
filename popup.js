var categories = []
var eventHandler = function(e){e.preventDefault(); editDiv(this);};

function processInput(inputCell) {
  console.log(inputCell)
  var inputText = inputCell.value
  var convertedFloat = parseFloat(inputText)
  if(isNaN(convertedFloat) || convertedFloat > 100) {
    alert("Invalid input, percentages only")
    inputCell.setAttribute('value', 'F')
    save_options()
    return
  }
  console.log(convertedFloat)
  inputCell.setAttribute('value', convertedFloat)
  save_options()

}
function editDiv(div) {
  var divCopy = div.cloneNode(true)
  //console.log(divCopy)
  //console.log('********************')
  //console.log(div)
  //div.innerHTML = "BooNigga"
  div.removeEventListener('mouseover', eventHandler)

  // var text = div.innerText,
  // textarea = document.createElement("INPUT");
  // textarea.setAttribute('id', 'inputx1')
  // textarea.value = text;

   //var divClone = div.cloneNode(true);

   //div.replaceChild(textarea, div.children[0]);
  // textarea.focus();
  // textarea.addEventListener ("focusout", function(e){ finishEditDiv(textarea, div, text); });
 
   //div.removeEventListener("click", eventHandler);

}

function removeSampleRow(nameCell, row, index){
  //console.log("clicked x")
  //console.log(nameCell)
  //console.log(row)
  categories.splice(index, 1)
  var row1 = nameCell.parentNode
  nameCell.removeEventListener("click", function(e){ removeSampleRow(row1); });
  row1.parentNode.removeChild(row1)
  save_options()
  //row.parentNode.removeChild(row) THIS
}

//textarea.addEventListener ("focusout", function(e){ finishEditDiv(textarea, div, text); });

function addCategory(name, percentage) {
  //var row = document.createElement('tr')
  //var cell = document.createElement('input')
  //row.cells[0] = cell
  //console.log("Got into addCategory")

  var span = document.createElement('span')
  span.textContent = name
  var table = document.getElementById('assignments-student-table-right')
  var row = table.insertRow(0)
  var inputCell = row.insertCell(0)
  var nameCell = row.insertCell(0)
  row.setAttribute('class', 'letterGradeRow')
  nameCell.setAttribute("class", "letterGrade");
  nameCell.appendChild(span)
  categories.push([name, percentage])
  nameCell.addEventListener("click", function(e){ removeSampleRow(nameCell, row, categories.length - 1); });
  var div = document.createElement('div')
  div.textContent = percentage
  
  inputCell.appendChild(div)
  //input.addEventListener("focusout", function(e) { processInput(input); });
  
  save_options()
  //newCell.appendChild()

  }

// Saves options to chrome.storage
function save_options() {
  //console.log("save")
  //var mainTable = document.getElementById('main-table');
  chrome.storage.sync.set({catArray: categories}, function() {
    //console.log(mainTable.innerHTML)
  });
}
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  console.log("restore")
  chrome.storage.sync.get( {catArray : "default value"}, function(items) {
    //categories = items.catArray
    for(var category of items.catArray){
      addCategory(category[0], category[1])
    }  });
  return
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get( {table : "default value"}, function(items) {
    //console.log(items.table)
    if(items.table == null) {
      console.log("Did nothing")
    }
    else {
      
      var mainTable = document.getElementById('main-table')
      mainTable.innerHTML = items.table
      console.log(items.table)
     /*
      var gradesList = document.getElementsByClassName('letterGrade')
      for(let grade of gradesList){
        console.log("Grade")
        console.log(grade)
        console.log("Parent")
        console.log(grade.parentNode)
        var row = grade.parentNode
        grade.addEventListener("click", function(e){ removeSampleRow(grade, row); });
        //grade.children[0].addEventListener("click", function(e){ removeSampleRow(grade, row); });
        //grade.children[1].addEventListener("focusout", function(e) { processInput(input); });
      }
      */

      var rowList = document.getElementsByClassName('letterGradeRow')
      for(let row of rowList){
        //console.log("Row")
        //console.log(row)
        //console.log("Children")
        //console.log(row.children)
        
        
        row.children[0].addEventListener("click", function(e){ removeSampleRow(row.children[0], row); });
        //console.log(row.children[1].children[0])
        row.children[1].children[0].addEventListener("focusout", function(e) { processInput(row.children[1].children[0]); });
      }
    }
    initPage()
  });
  
}

function initPage() {
  document.getElementById('secretButton').addEventListener('click', 
  function(e) {
    addCategory(document.getElementById('categoryInput').value, 
    document.getElementById('categoryPercentage').value)
  });
  ///document.getElementById('categoryInput').addEventListener('focusout', (event) => {
    //console.log(document.getElementById('categoryInput').value)
  //});

  document.addEventListener('DOMContentLoaded', restore_options);
}

initPage()
