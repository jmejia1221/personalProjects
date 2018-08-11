const swApi = 'https://www.swapi.co/api/people/'
const pageSize = 9;
var pageNum = 1;

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
    console.log(persons);
    return `
        <div class="building-block">
            <h4 class="building-block__name">${persons.name}</h4>
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

// Search

let searchPeople = function() {
    let inputSearch = document.getElementById("search").value

    if (inputSearch !== '') {
        loadData(swApi + '?search=' + inputSearch, 0)
    } else {
        loadData(swApi + '?search=' + inputSearch, pageSize)
    }
}

window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) {
        return
    }

    if (e.keyCode === 13) {
        searchPeople()
    }
})

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

let homeworld = function(homeworld) {
    homeworld = homeworld
    console.log(homeworld)
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
            activatedItem(pageNum)
        } 
    }
}

loadData(swApi, pageSize)
activatedItem(pageNum)