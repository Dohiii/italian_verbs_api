//query selectors
const category = document.getElementById("category")
const czasownik = document.getElementById("czasownik")
const tlumaczenie = document.getElementById("tlumaczenie")
const tense = document.getElementById("tense")
const osoba = document.getElementById("osoba")
const word = document.getElementById("name")
const inputGreen = document.getElementById("input-green")
const icon = document.querySelector(".icon")
const checkboxes = document.querySelectorAll("input[name=checkbox_char]");
const zwrotne = document.querySelectorAll("input[name=checkbox_zwrotne]")
const checkboxesOsoba = document.querySelectorAll("input[name=checkbox_osoba]");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
const checkboxAll = document.querySelector("input[name=checkbox_all]");
const uncheckAll = document.querySelector("input[name=checkbox_un_all]");
const checkboxAll_osoba = document.querySelector("input[name=checkbox_all_osoba]");
const uncheckAll_osoba = document.querySelector("input[name=checkbox_un_all_osoba]");

const loader = document.querySelector(".loader")
const form = document.querySelector(".form")
const mainSection = document.querySelector(".main-section");

const btnLetter = document.querySelectorAll(".btn-italian-letter");
const submit = document.getElementById("submit")
const new_verb = document.getElementById("new_verb")
const helpBtn = document.getElementById("pdopowiedż")
const correctWordDOM = document.getElementById("correctWordDOM")

// Utils
let checkboxValueChecked = []
let checkboxOsobaValueChecked = []
let count = [0]
let correctVerbObject = {}
let isLoading = true

console.log(correctVerbObject)


// function to form url from checked checkboxes
const formUrl = async () => {
    let charactersSelected = await getValueCheckbox(checkboxes, "tense");
    let osobaSelected = await getValueCheckbox(checkboxesOsoba, "osoba");
    let getZwrotne = await getValueCheckbox(zwrotne, "zwrotne")

    let categorySelected = await category.value
    let charString = charactersSelected.join("")
    let osobaString = osobaSelected.join("")

    // charactersSelected.join("")
    if (charString.length === 0) {
        charString = `&tense=Presente Indicativo`
    }


    if (osobaString.length === 0) {
        osobaString = `&osoba=IO`
    }

    if (categorySelected === "all") {
        categorySelected = ["regularny", "nieregularny"][Math.floor(Math.random() * 2)];
    }
    // const url = `http://127.0.0.1:3000/api/v1/verbs?categoria=${categorySelected}${charString}${osobaString}${getZwrotne[0]}`
    const url = `https://italian-verbs.onrender.com/api/v1/verbs?categoria=${categorySelected}${charString}${osobaString}${getZwrotne[0]}`

    return url
}

// submit verb:
const submitVerb = async () => {
    console.log(correctVerbObject)
    let correctWordValue = correctVerbObject.correctWord

    count[0]++
    if (count[0] >= 3) {
        helpBtn.style.display = "block"
    }
    const inputetWord = word.value.toLowerCase()

    if (typeof correctWordValue === "string") {
        if (inputetWord === correctWordValue) {
            mainFormFunction()
            celebrateCorrect()
            word.value = ""
        }
    }

    if (typeof correctWordValue === "object") {
        const arrToString = correctWordValue.join(",")
        console.log(arrToString)

        if (
            correctWordValue.includes(inputetWord) || arrToString === inputetWord
        ) {
            mainFormFunction()
            celebrateCorrect()
            word.value = ""
        }
    }
    if (inputetWord !== correctWordValue) {
        word.style.borderColor = "red"
    }
}


const celebrateCorrect = async () => {
    count[0] = 0
    icon.style.display = "block"
    word.style.display = "none"
    inputGreen.style.display = "block"
    submit.disabled = true
    helpBtn.style.display = "none"
    await delay(1.5)
    submit.disabled = false
    word.style.display = "block"
    inputGreen.style.display = "none"
    icon.style.display = "none"

}

// function to form an VERB from fetch to server
const formObject = (data) => {
    const verb = data.verb
    const capitalizedVerb =
        verb.czasownik.charAt(0).toUpperCase()
        + verb.czasownik.slice(1)

    czasownik.textContent = capitalizedVerb
    tlumaczenie.textContent = `(${verb.tlumaczenie})`
    tense.textContent = verb.tense
    osoba.textContent = verb.pluc

    let correctVerbArr = []

    if (verb.correctWord.includes(";") || verb.correctWord.includes(",")) {
        // verb.correctWord
        const tempArr = verb.correctWord.split(/[;,]/)

        tempArr.forEach(word => {
            const newWord = word.trim()
            correctVerbArr.push(newWord)
        })

        verb.correctWord = correctVerbArr
    }
    return verb
}


// function to get values from checkboxes
const getValueCheckbox = async (arr, str) => {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
            result.push(`&${str}=${arr[i].value}`)
        }
    }
    return result;
}

// render verb data to DOM
function renderFunction(verb) {
    const capitalizedVerb =
        verb.czasownik.charAt(0).toUpperCase()
        + verb.czasownik.slice(1)
    czasownik.textContent = capitalizedVerb
    tlumaczenie.textContent = `(${verb.tlumaczenie})`
    tense.textContent = verb.tense
    osoba.textContent = verb.pluc
}


async function mainFormFunction() {
    const url = await formUrl()
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const verb = formObject(data)
            renderFunction(verb)
            // correctWordDOM.textContent = verb.correctWord
            correctVerbObject["correctWord"] = verb.correctWord
            // localStorage.setItem('correctWordLOCAL', verb.correctWord);
        }).catch(e => { console.log(e) })
    showForm()
}


// EVENT listeners 

// buttons listeners
submit.addEventListener("click", (e) => {
    e.preventDefault()
    submitVerb()
})

helpBtn.addEventListener("click", (e) => {
    e.preventDefault()
    word.value = correctVerbObject.correctWord
    helpBtn.style.display = "none"
    count[0] = 0
})

new_verb.addEventListener("click", e => {
    e.preventDefault()
    count[0] = 0
    helpBtn.style.display = "none"
    word.value = ""
    mainFormFunction()
})

word.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        submitVerb()
    }
});


// selector event listener
category.addEventListener('change', (event) => {
    // const result = document.querySelector('.result');
    // result.textContent = `You like ${event.target.value}`;
    mainFormFunction()
});

// selector event listener
zwrotne.forEach(zwrot => {
    zwrot.addEventListener('change', (event) => {
        // const result = document.querySelector('.result');
        // result.textContent = `You like ${event.target.value}`;
        mainFormFunction()
    });
})

// checkboxes event listener
checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        checkboxValueChecked =
            Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
                .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
                .map(i => `&tense=${i}`) // Use Array.map to extract only the checkbox values from the array of objects.
        mainFormFunction()
    })
});

// Use Array.forEach to add an event listener to each checkbox.
checkboxesOsoba.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        checkboxOsobaValueChecked =
            Array.from(checkboxesOsoba) // Convert checkboxes to an array to use filter and map.
                .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
                .map(i => `&osoba=${i}`) // Use Array.map to extract only the checkbox values from the array of objects.
        mainFormFunction()
    })
});


checkboxAll.addEventListener('change', chk => {
    uncheckAll.checked = false
    for (i = 0; i < checkboxes.length; i++)
        checkboxes[i].checked = true;
})


uncheckAll.addEventListener('change', chk => {
    checkboxAll.checked = false
    // uncheckAll.checked = false
    for (i = 0; i < checkboxes.length; i++)
        checkboxes[i].checked = false;
})


checkboxAll_osoba.addEventListener('change', chk => {
    uncheckAll_osoba.checked = false
    for (i = 0; i < checkboxesOsoba.length; i++)
        checkboxesOsoba[i].checked = true;
})


uncheckAll_osoba.addEventListener('change', chk => {
    checkboxAll_osoba.checked = false
    // uncheckAll.checked = false
    for (i = 0; i < checkboxesOsoba.length; i++)
        checkboxesOsoba[i].checked = false;
})


btnLetter.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault()
        word.value += btn.textContent
    })
})


const getData = async (url_ping) => {
    const response = await fetch(url_ping)

    if (response.ok) {
        console.log("OK")
    }
    // Handle errors
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.status
}

const showLoader = () => {
    loader.style.display = "block"
    mainSection.style.display = "none"
    form.style.display = "none"
}

const showForm = () => {
    mainSection.style.display = "block"
    loader.style.display = "none"
    form.style.display = "block"
}


function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}

const pingServer = async () => {
    showLoader()
    try {
        const ping = await getData("https:/italian-verbs.onrender.com/api/v1/verbs/ping")
        // const ping = await getData("http://127.0.0.1:3000/api/v1/verbs/ping")
        console.log(ping)
        if (ping === 200) {
            stopInterval()
            showForm()
            mainFormFunction()
        }
    } catch (e) {
        console.log(e)
    }
}

// Function to start setInterval call
function startInterval() {
    intervalID = setInterval(pingServer, 1000);
}

// Function to stop setInterval call
function stopInterval() {
    clearInterval(intervalID);
}


startInterval()






