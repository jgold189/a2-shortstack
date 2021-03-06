"use strict";

//Function to get all the items on load of the page
function getAllItems() {
    const body = JSON.stringify({allData: 1})
    fetch( '/submit', {
        method:'POST',
        body 
    })
    .then(response => response.json())
    .then( function( response ) {
        for (let index = 0; index < response.length; index++) {
            const element = response[index];
            addRows(element);
        }
    })
}

//Function for marking an item off your list
//If the item is not marked purchased then it will mark it purchased and then change its text
//If the item is marked purchased then it will remove that mark
function gotItem(e) {
    //Get the table row that is the parent's parent
    let tr = e.target.parentElement.parentElement;
    //Swap purchased or not
    if (tr.className === "purchased") {
        tr.className = "";
        e.target.innerHTML = "✓";
    } else {
        tr.className = "purchased";
        e.target.innerHTML = "✗";
    }
}

//Delete the purchased rows from both the local table and the server
function deleteRows(e) {
    //Find all the table rows marked purchased
    let toDelete = document.getElementsByClassName("purchased");
    let len = toDelete.length;
    //Iterate through all of these elements
    for (let i = 0; i < len; i++) {
        //Get the index of that row - 2 as you must ignore the two header rows
        let index = toDelete[0].rowIndex - 2;
        //Put that info into json
        let jsonDelete = {delete: 1, i: index};
        const body = JSON.stringify(jsonDelete);

        //Send it off as a POST request to the server and log the result
        fetch("/submit", {
            method:"POST",
            body
        })
        .then(response => console.log(response.status))

        //Actually remove the row
        toDelete[0].remove();
    }
}

//Handles the click action
const handleButton = function(e) {
    //Ignores if you click on anything but a button
    if (e.target.tagName === "BUTTON") {
        //Route the button press to the correct function
        if (e.target.id === "submit") {
            submit(e);
        } else if (e.target.className === "checkButton") {
            gotItem(e);
        } else if (e.target.id === "delete") {
            deleteRows(e);
        }
    }
}

//Takes a json object and adds it to the table as a row
function addRows(jsonEntry) {
    //Find the table
    const tableBody = document.getElementById("groceryBody");
    //Insert a new row and then new cells
    let row = tableBody.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);

    //Fill those cells with the data gotten back from the server, this includes the new fields
    cell1.innerHTML = jsonEntry.quantity;
    cell2.innerHTML = jsonEntry.food;
    cell3.innerHTML = jsonEntry.cal;
    cell4.innerHTML = "<button class=\"checkButton\">✓</button>";
}

//Validates the input
function validateInput() {
    const inputQ = document.getElementById("quantity").value;
    console.log(inputQ);
    if (inputQ < 1 || inputQ > 999) {
        alert("Quantity must be between 1 and 999");
        return false;
    }
    const inputF = document.getElementById("food").value;
    console.log(inputF);
    const regex = /^[A-Za-z ]+$/;
    if (!inputF.match(regex)) {
        alert("Item must not contain numbers of symbols");
        return false;
    }
    return true;
}

//Submit the form data to the servers
const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    //check that the input is valid before sending the data off
    if (!validateInput()) {
        return false;
    }

    let json = {};
    const input = document.forms["inputForm"].getElementsByTagName("input");
    //Put the data into json format dynamically using the id as its key
    for (let index = 0; index < input.length; index++) {
        const element = input[index];
        json[element["id"]] = element["value"]
    }
    const body = JSON.stringify(json)

    //Fetch the data then conver the response into json and then insert it into the table
    fetch( '/submit', {
      method:'POST',
      body 
    })
    .then(response => response.json())
    .then( function( response ) {
        addRows(response);
    })

    return false;
  }

//When the page loads stick the click listener on there to handle all the buttons/clicks
window.onload = function() {
    getAllItems();
    document.addEventListener("click", handleButton, false);
}
