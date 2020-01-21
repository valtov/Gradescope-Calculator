var grade_map = new Object();
var categories = []
function updateCurrentGrade(){
    //console.log("BOP");

}
//document.addEventListener('click', () => {calculateLetterGrades()});
var bool = false;
//console.log("content.js executed");
colors = {
    "A": "Green",
    "B": "Chartreuse",
    "C": "Gold",
    "D": "Red",
    "F": "Maroon"
}
function calcLetterGrade(num){
    switch(true){
        case (num >= 9): return 'A';
        case (num >= 8): return 'B';
        case (num >= 7): return 'C';
        case (num >= 6): return 'D';
        case (num < 6): return 'F';
    }
}
var eventHandler = function(e){e.preventDefault(); editDiv(this);};

/*
* score: A / B where A and B are floats to 2 decimals 
*/
function letterAndPercentage(score) {
    if (score.indexOf('/') == -1){
        return "invalid"
    } 
    var finalLetter;
    var nums_arr = score.split('/');
    var a = parseFloat(nums_arr[0]);
    var b = parseFloat(nums_arr[1]);
    if(a == null || b == null){
        return "invalid"
    }

    percentage = (a/b)*100.0;
    var letter_grade = Math.trunc( (a/b)*10.0 );
    var plus_or_minus = ((a/b)*100.0) % 10;
    var letter = calcLetterGrade(letter_grade);
    if(letter_grade >= 10)
        finalLetter = letter + "+";
    else if(plus_or_minus >= 7)
        finalLetter = letter + "+";
    else if(plus_or_minus <= 2)
        finalLetter = letter + "-";
    else 
        finalLetter = letter + " ";
    return (finalLetter + " " + percentage.toFixed(2) + "% ")
}


chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        /*
        console.log('Storage key "%s" in namespace "%s" changed. ' +
        'Old value was "%s", new value is "%s".',
        key,
        namespace,
        storageChange.oldValue,
        storageChange.newValue); */
    }
});

function addStoredCategories() { 
    //console.log("add stored categories")
    chrome.storage.sync.get( {catArray : "default value"}, function(items) {
        var selectorList = document.getElementsByClassName('categorySelector')
        //console.log(selectorList)
        for(var category of items.catArray) {
            //console.log(category[0])
            var option = document.createElement('option')
            option.textContent = category[0] + ' - ' + category[1] + '%'
            for(var select of selectorList){
              //  console.log(select)
                //console.log(option)
                select.appendChild(option.cloneNode(true))
            }
          }
      });
}

function insertCategories() {
    //console.log("insert Categories")
    var main_table = document.getElementById("assignments-student-table");
    for(var i = 1, row; row = main_table.rows[i]; i++) {
      //  console.log(row.cells[1].textContent)
        
        if (row.cells[1].textContent.indexOf('/') == -1) {
            row.insertCell(1).appendChild(document.createTextNode(" "));
            continue
        }
        
        var selectorCell = row.insertCell(1)
        selectorCell.setAttribute('id', 'selector')
        var categorySelector = document.createElement('select')
        categorySelector.setAttribute('class', 'categorySelector')
        //addStoredCategories(categorySelector)
        //var defaultOption = document.createElement('option')
        //defaultOption.textContent = 'default'
        //categorySelector.appendChild(defaultOption)
        selectorCell.appendChild(categorySelector)
    }
    addStoredCategories()

}

function get_categories() {
   // console.log("restore")
    chrome.storage.sync.get( {catArray : "default value"}, function(items) {
      });
    return
  }

function editDiv(div) {
    var text = div.innerText,
    textarea = document.createElement("INPUT");
    textarea.setAttribute('id', 'inputx1')
    textarea.value = text;

    var divClone = div.cloneNode(true);

    div.replaceChild(textarea, div.children[0]);
    textarea.focus();
    textarea.addEventListener ("focusout", function(e){ finishEditDiv(textarea, div, text); });

    div.removeEventListener("click", eventHandler);

}

function finishEditDiv(textarea, divClone, original){

    var newText = textarea.value;
    var test = letterAndPercentage(newText);
    var splitArr = newText.split('/') 
    var a = parseFloat(splitArr[0])
    var b = parseFloat(splitArr[1])
    var iDiv = document.createElement('div');
    iDiv.className = 'submissionStatus--score';
    if(newText.indexOf('/') == -1 || isNaN(a) || isNaN(b) || a < 0 || b < 0){
        alert('Invalid score, please fill out as (SCORE1 / SCORE2). Please note negative numbers are invalid'
 
        );
        iDiv.textContent = original
        divClone.replaceChild(iDiv, divClone.children[0]);

        //newCell.appendChild(document.createTextNode(finalLetter + " " + percentage.toFixed(2) + "% "));
        textarea.removeEventListener("focusout", function(e){ finishEditDiv(textarea, divClone); });
        //divClone.addEventListener ("focusout", function(e){ finishEditDiv(textarea, divClone); });
        divClone.addEventListener('click', eventHandler);
        return;
    }
    //divClone.parentNode.cells[1]
    //divClone.textContent = a + " / " + b;
    //textarea.parentNode.replaceChild(divClone, textarea);
  
    iDiv.textContent = a.toFixed(1) + " / " + b.toFixed(1);
    
    //divClone.appendChild(iDiv);
    
    divClone.parentNode.cells[2].textContent = test
    divClone.parentNode.cells[2].style.color = colors[test[0]];

    divClone.replaceChild(iDiv, divClone.children[0]);

    //newCell.appendChild(document.createTextNode(finalLetter + " " + percentage.toFixed(2) + "% "));
    

    textarea.removeEventListener("focusout", function(e){ finishEditDiv(textarea, divClone); });
    //divClone.addEventListener ("focusout", function(e){ finishEditDiv(textarea, divClone); });
    divClone.addEventListener('click', eventHandler);

    //console.log(textarea)
    //console.log("&&&&&&&&&&&&&&&&")
    //console.log(textarea.value)
    //console.log('********************')
    //console.log(divClone)

    //var text = div.querySelector('textarea').value;
    //div.innerHTML = text;
    //document.querySelector('.editable').addEventListener("click", eventHandler);
  }

  function updateGrades() {
    
    
    var main_table = document.getElementById("assignments-student-table");
    for(var i = 1, row; row = main_table.rows[i]; i++) {
        // Name of the assignment, used to map assignments to grade categories
        var assignmentName = row.cells[0].textContent
        
        var category = row.cells[1].getElementById('categorySelector')
        category = category.options[category.selectedIndex]

        var points = row.cells[3].textContent

        var nums_arr = points.split('/');
        var num = parseFloat(nums_arr[0]); // numerator
        var denom = parseFloat(nums_arr[1]); // denominator

        
        
    }
    
  }
 

  

  
function insertGrades() {
    var main_table = document.getElementById("assignments-student-table");
    for(var i = 1, row; row = main_table.rows[i]; i++) {
        // Name of the assignment, used to map assignments to grade categories
        var assignmentName = row.cells[0].textContent
      
        var cell_element = row.cells[2];
        var points_cell = cell_element.textContent;
        var text_box = document.createElement('input');
        text_box.innerHTML = cell_element.innerHTML;
        if (points_cell.indexOf('/') == -1)
            row.insertCell(2).appendChild(document.createTextNode(" "));   
        else 
        {
            cell_element.setAttribute("role", "button");
        
            cell_element.addEventListener('click', eventHandler);
            
            //var finalLetter = letterAndPercentage(points_cell)
            var newCell = row.insertCell(2)//.setAttribute("class","letterGrade");
            newCell.setAttribute("class", "letterGrade");
            var iDiv = document.createElement('div');
            iDiv.className = 'letterGrade--grade';
            var test = letterAndPercentage(points_cell)
            iDiv.innerHTML = test;
            //newCell.appendChild(document.createTextNode(finalLetter + " " + percentage.toFixed(2) + "% "));
            newCell.appendChild(iDiv);
            row.cells[2].style.color = colors[test[0]];
            row.cells[2].style.fontWeight = "bold"
            row.cells[2].style.fontSize = "large"
            row.cells[2].style.outlineColor = "black"
        }
        bool = false;
    }
}

var table = document.getElementById("assignments-student-table");
if(table == null) {
    throw new Error("Table was null");
}
var head = table.tHead.children[0];
var nameElem = table.rows[0].cells[0];
var clone = nameElem.cloneNode();
//console.log(clone);

//head.insertCell(0).appendChild(document.createTextNode("Letter Grade"));
var x1 = head.insertCell(1);
var x2 = head.insertCell(1);


x1 = clone;
x2 = clone;

var header = document.getElementsByClassName("courseHeader");
var div = document.createElement('div')
var button = document.createElement('button')
button.setAttribute('id', 'calculateGrades')
button.textContent = "Calculate Grades"
button.addEventListener('click', calculateGrade)
div.appendChild(button)
header[0].appendChild(div)

var div2 = document.createElement('div')
div2.setAttribute('id', 'finalGrade')
header[0].appendChild(div2)

insertCategories()
insertGrades()

function calculateGrade() {
    // convert both to arrays so they have the full complement of Array methods
    var array1 = Array.prototype.slice.call(document.getElementsByClassName("odd"), 0);
    var array2 = Array.prototype.slice.call(document.getElementsByClassName("even"), 0);
    var array = array1.concat(array2)
    //var even = document.getElementsByClassName("even");
    //var odd = document.getElementsByClassName("odd");
    //even = even.concat(odd)
    //console.log(array)
    //var map = new Object()
    var denoms = new Object()
    var nums = new Object()
    //var percentages = new Object()
    for(var row of array) {
        
        var selector = row.cells[1].children[0]
        //console.log("HABIBIBIBIBIIBIB")
        //console.log(!row.cells[1].textContent)
        console.log(row.cells[3].textContent);
        if (row.cells[3].textContent.indexOf('/') == -1) { console.log('skipped'); continue; }
        var category = selector.options[selector.selectedIndex].value
        
        var points = row.cells[3].children[0].textContent
        if (points.indexOf('/') == -1){
            continue
        } 
        var nums_arr = points.split('/');
        var num = parseFloat(nums_arr[0]);
        var denom = parseFloat(nums_arr[1]);

        // **** 
          if(!(category in nums)) { 
            nums[category] = num 
            denoms[category] = denom
        } else {
            nums[category] += num 
            denoms[category] += denom
        }  
         
        // ****
        /*
        if(!(category in map)) { 
            map[category] = (num / denom) 
        } else {
            map[category] = ((map[category] * 100.0) + (num / denom * 100.0)) / 200
        }
        */
    }
    var percentagesAddedUp = 0
    var overallGrade = 0
    for (let category in nums) {
        if(denoms[category] && nums[category] == 0) continue
        var percentage = parseFloat(category.split('-')[1])
        percentagesAddedUp += percentage
        
        overallGrade += (   (nums[category] / denoms[category])   *   (percentage / 100)   )
    }

    if(percentagesAddedUp != 100) {
        alert('Percentages don\'t add to 100%, please check categories ')
        return
    }

      overallGrade *= 100.0;
      var letter_grade = Math.trunc( overallGrade/10.0 );
      var plus_or_minus = (overallGrade*10.0) % 10;
      var letter = calcLetterGrade(letter_grade);
      if(letter_grade >= 10)
          finalLetter = letter + "+";
      else if(plus_or_minus >= 7)
          finalLetter = letter + "+";
      else if(plus_or_minus <= 2)
          finalLetter = letter + "-";
      else 
          finalLetter = letter + " ";
      

      var div = document.getElementById("finalGrade");
      div.style.color = colors[finalLetter[0]];
      div.style.fontWeight = "bold"
      div.style.font = 24
      div.style.fontSize = "large"
      div.style.outlineColor = "black"
      div.textContent = finalLetter + " " + overallGrade.toFixed(2) + "% "
      


}




