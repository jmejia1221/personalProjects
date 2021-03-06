const swApi = 'https://www.swapi.co/api/people/'
const pageSize = 9;
var pageNum = 1;
var searchButton = false;

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
    let filterPerson = persons.name.replace(/ /g,'&')

    let urlPerson = swApi + '?search=' + filterPerson
    return `
        <div class="building-block">
            <h4 class="building-block__name" onclick="searchLink('${persons.name}')">${persons.name}</h4>
            <ul class="building-block__info">
                <li><strong>Birth Year: </strong>${persons.birth_year}</li>
                <li><strong>Height: </strong>${persons.height}</li>
                <li><strong>Mass: </strong>${persons.mass}</li>
                <li><strong>Hair Color: </strong>${persons.hair_color}</li>
                <li><strong>Skin Color: </strong>${persons.skin_color}</li>
                <li><strong>Eye Color: </strong>${persons.eye_color}</li>
            </ul>
        </div>
    `;
}

let dataPerson = function(persons) {
    return `
        <div class="building-block">
            <h4 class="building-block__name" onclick="searchLink('${persons.name}')">${persons.name}</h4>
        </div>
    `;
}

// Search

let searchPeople = function(person) {
    let inputSearch = document.getElementById("search").value;
    searchButton = true;

    if (inputSearch !== '') {
        loadData(swApi + '?search=' + inputSearch, 0)
    } else {
        loadData(swApi + '?search=' + inputSearch, pageSize)
    }
}

let searchLink = function(searchPerson) {
    console.log(searchPerson)
    let filterPerson = searchPerson.replace(/ /g,'&');

    loadData(swApi + '?search=' + filterPerson, 0)
}

window.addEventListener('keyup', (e) => {
    if (e.defaultPrevented) {
        return
    }

    if (e.keyCode === 13) {
        searchPeople()
        document.getElementById('searchIn').classList.add('search-hide');
    }
})

let searchFocus = function() {
    let searchIcon = document.getElementById('search-people');
    let clearInput = document.getElementById('clear-input');

    searchIcon.classList.remove('visible');
    clearInput.classList.add('visible');
}

let toggleSearchIcon = function() {
    let searchIcon = document.getElementById('search-people');
    let clearInput = document.getElementById('clear-input');


    setTimeout(() => {
        searchIcon.classList.add('visible');
        clearInput.classList.remove('visible');
        document.getElementById('searchIn').classList.add('search-hide');
    }, 300)
}

let clearInput = function() {
    let search = document.getElementById('search');

    document.getElementById('searchIn').innerHTML = "";
    search.value = '';

    toggleSearchIcon();

    if (searchButton === true) {
        searchButton = false;
        loadData(swApi, pageSize)
        search.focus();
    }
}


let keySearch = function() {
    document.getElementById('searchIn').classList.remove('search-hide');
    setTimeout(() => {
        let search = document.getElementById('search').value;
        searchData(swApi + '?search=' + search, 0)
    }, 800)
}
// Pagination

let totalPage = function(num, size) {
    let previousButton = document.getElementById('previous');
    let nextButton = document.getElementById('next'); 
    
    if (num === 1) {
        previousButton.setAttribute("disabled", "");
    } else {
        previousButton.removeAttribute("disabled", "");
    }

    if (num === size) {
        nextButton.setAttribute("disabled", "");
    } else {
        nextButton.removeAttribute("disabled", "");
    }
}

let createPaginationList = function(size) {
    if (size !== 0) {
        let numPage = [];
        let countNumbers = document.getElementById('countNumbers');

        for ( i = 1; i <= pageSize; ++i) {
            numPage.push(i)
        }
        countNumbers.innerHTML = `
            <button id="previous" class="previous" onclick="previousPage()"></button>
            <ul>
                ${numPage.map(itemsPage).join("")}
            </ul>
            <button id="next" class="next" onclick="nextPage()"></button>
        `;
    } else {
        countNumbers.innerHTML = ""
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

    itemActivate.classList.add("activate");
    if (number !== num) {
        itemActivate.classList.remove("activate");
    }
}

let callItemPage = function(num) {
    loadData(swApi + '?page=' + num, pageSize, num);
    activatedItem(num)
}

let nextPage = function() {
    pageNum++;
    loadData(swApi + '?page=' + pageNum, pageSize);
    activatedItem(pageNum);
}

let previousPage = function() {
    pageNum--;
    loadData(swApi + '?page=' + pageNum, pageSize);
    activatedItem(pageNum);
}

// Call people
let  people = function(response) {
    let data = response
    let people = data.results

    document.getElementById('people').innerHTML = `
        ${people.map(person).join("")}
    `
    return get(data.results[0].homeworld)
}

let searchPeopleData = function(response) {
    let data = response;
    let people = data.results;

    document.getElementById('searchIn').innerHTML = `
        ${people.map(dataPerson).join("")}
    `
}

let homeworld = function(homeworld) {
    homeworld = homeworld
    console.log(homeworld)
}

let searchData = function(mainApi, size, itemNum) {
    get(mainApi)
        .then(searchPeopleData)
        .catch((err) => _handleError(err))
}

let loadData = function(mainApi, size, itemNum) {

    get(mainApi)
        .then(people)
        .then(homeworld)
        .catch((err) => _handleError(err))

    createPaginationList(size);

    if (itemNum) {
        pageNum = itemNum
        totalPage(pageNum, size);
    } else {
        if (size !== 0) {
            totalPage(pageNum, size);
            pageNum = 1
            activatedItem(pageNum)
        } 
    }

}

loadData(swApi, pageSize)
activatedItem(pageNum)