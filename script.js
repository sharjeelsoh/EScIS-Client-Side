/* 
Name: Sharjeel Sohail
Email: sharjeelsoh@gmail.com
File: script.js (3/3)
*/

// Variables
let popup = document.getElementById('project-popup');
let popupBody = document.getElementById('popup-body');
let closeBtn = document.getElementById('closeBtn');
let popupHeading = document.getElementById('popup-heading');
let standardsTable = document.getElementById('standardsTable')

// Fucntion Calls
getActionLevelSources();

// --------------------------------------------------------------------------------------------- //

// Function: DisplayPopup(props)
// Purpose:  Displays the popup, takes Action Level Source Name as an argument, 
//           and shows Environmental Standards of in a separate modal

function displayPopup(prop){
    popup.classList.add("open-popup");
    document.body.style.overflow = "hidden";
    
    let actionLevelSource = prop.childNodes[1].childNodes[1].textContent;
    popupHeading.textContent = actionLevelSource;
    
    // Using encodeURIComponent to replace special characters in Action level Source name when making a request
    const url = `https://staging.esdat.net/EnvironmentalStandards/GetGlobalEnvironmentalStandards?actionLevelSource=${encodeURIComponent(actionLevelSource)}`;
    getStandards(url);
}

// --------------------------------------------------------------------------------------------- //

// Function: getStandards(url)
// Purpose:  Generates Environmental Standards in a table format by making an API call, 
//           taking url as an input, and sorting them by ChemName

async function getStandards(url){
    const result = await fetch(url);
    result.json()
    .then(json => {
        
        // Sorting algorithm
        json.sort(function(a, b) {
            return a.ChemName.toString().localeCompare(b.ChemName.toString(), 'en', {numeric: true})
        })

        // Creates a Table row for each entry
        json.forEach(entry => {
            const markup = 
            `<tr>
                <td>${entry.ChemCode}</td>
                <td>${entry.ChemName}</td>
                <td>${entry.ActionLevelDisplayText}</td>    
            </tr>`
            standardsTable.insertAdjacentHTML('beforeend', markup)
        })
    })
}

// --------------------------------------------------------------------------------------------- //

// Function: closePopup()
// Purpose:  Hides the modal

function closePopup(){
    popup.classList.remove("open-popup");
    document.body.style.overflow = "auto";
    standardsTable.innerHTML = "";
}

// --------------------------------------------------------------------------------------------- //

// Function: getActionLevelSources()
// Purpose:  Generates an initial listing of Action Level Sources by making an API call
//           Displaying the hierarchical group and Action Level Source Text

async function getActionLevelSources(){
    const url = "https://staging.esdat.net/EnvironmentalStandards/GetAllGlobalActionLevelSources";
    const result = await fetch(url);
    result.json()
    .then(json => {
        json.forEach(entry => {

            // Creates a Group & Parent Group Name in hierarchical format
            let groupName = entry.Group.Name;
            let parentGroupName = "";
            if (entry.Group.ParentGroup != null ) {
                parentGroupName = entry.Group.ParentGroup.Name;
                if (entry.Group.ParentGroup.ParentGroup != null){
                    parentGroupName = entry.Group.ParentGroup.ParentGroup.Name + " > "+ parentGroupName;
                }
            }

            // Creates a list item for each entry
            const markup = 
            `<li class="list-item" onclick="displayPopup(this)">
                <div>
                    <h4>${entry.ActionLevelSource}</h4>
                    <p>${parentGroupName} > ${groupName}</p>
                </div>
            </li>`
            document.getElementById('listing').insertAdjacentHTML('beforeend', markup);
        });
    })
}

// --------------------------------------------------------------------------------------------- //