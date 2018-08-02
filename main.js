const swApi = 'https://www.swapi.co/api/people/'

const get = function(url) {
    return new Promise ((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            const DONE = 4;
            const OK = 200;
            if (this.readyState === DONE) {
                if (this.status === OK) {
                    // Everything Ok
                    resolve(JSON.parse(this.responseText));
                } else {
                    // There was an error
                    reject(new Error(`An error ocurred while perfoming the request ${this.status}`));
                }

            }
        }

        xhr.open('GET', url)
        xhr.send(null)
    })
}

function _handleError(err){
	console.log(`Request failed: ${err}`) 
}

// Templates
let person = function(persons) {
    return `
        <h4>${persons.name}</h4>
        <ul>
            <li>${persons.height}</li>
            <li>${persons.mass}</li>
            <li>${persons.hair_color}</li>
            <li>${persons.skin_color}</li>
        </ul>
    `;
}

// Pagination
const pageSize = 9;
var pageNum = 1;

let totalPage = function(num, size) {
    let previousButton = document.getElementById('previous');
    let nextButton = document.getElementById('next'); 

    if (num === 1) {
        previousButton.setAttribute("disabled", "");
    } else {
        previousButton.removeAttribute("disabled", "");
    }

    if (num >= size) {
        nextButton.setAttribute("disabled", "");
    } else {
        nextButton.removeAttribute("disabled", "");
    }
}

let itemsPage = function(numbers) {
    return `
        <li id="item-${numbers}" onclick="callItemPage(${numbers})">${numbers}</li>
    `
}

let activatedItem = function(num) {
    let number = num;

    let itemActivate = document.getElementById('item-' + num);
    itemActivate.classList.add("activated");
    if (number !== num) {
        itemActivate.classList.remove("activated");
    }
}

let callItemPage = function(num) {
    loadData(swApi + '?page=' + num, pageSize);
    activatedItem(num)
}

let nextPage = function() {
    pageNum++;
    loadData(swApi + '?page=' + pageNum, pageSize);
}

let previousPage = function() {
    pageNum--;
    loadData(swApi + '?page=' + pageNum, pageSize);
}

// Call people
let  people = function(response) {
    let data = response
    let people = data.results
    console.log(data)

    document.getElementById('people').innerHTML = `
        ${people.map(person).join("")}
    `
    return get(data.results[0].homeworld)
}

let homeworld = function(homeworld) {
    homeworld = homeworld
    console.log(homeworld)
}

let loadData = function(mainApi, size) {
    let countNumbers = document.getElementById('countNumbers');
    let numPage = [];

    get(mainApi)
        .then(people)
        .then(homeworld)
        .catch((err) => _handleError(err))

    totalPage(pageNum, size);
    for ( i = 1; i <= pageSize; ++i) {
        numPage.push(i)
    }
    
    countNumbers.innerHTML = `
        <ul>
            ${numPage.map(itemsPage).join("")}
        </ul>
    `;
}

loadData(swApi, pageSize)
activatedItem(pageNum)