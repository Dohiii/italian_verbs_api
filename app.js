//query selectors
const category = document.getElementById("category")
const czasownik = document.getElementById("czasownik")
const tlumaczenie = document.getElementById("tlumaczenie")
const tense = document.getElementById("tense")
const osoba = document.getElementById("osoba")
const word = document.getElementById("name")

const icon = document.querySelector(".icon")


const checkboxes = document.querySelectorAll("input[name=checkbox_char]");
const btnLetter = document.querySelectorAll(".btn-italian-letter");

const submit = document.getElementById("submit")
const new_verb = document.getElementById("new_verb")
const helpBtn = document.getElementById("pdopowiedż")

// Utils
let checkboxValueChecked = []
let count = []

// deployed url
// https://italian-verbs.onrender.com
// http://127.0.0.1:3000


// console.log(checkboxValueChecked)

async function renderFunction() {
    let charactersSelected = await getValueCheckbox();
    let categorySelected = await category.value
    let charString = charactersSelected.join("")

    // charactersSelected.join("")
    if (charString.length === 0) {
        charString = `&tense=Presente Indicativo`
    }

    if (categorySelected === "all") {
        categorySelected = ["regularny", "nieregularny"][Math.floor(Math.random() * 2)];
    }

    // const url = `http://127.0.0.1:3000/api/v1/verbs?categoria=${categorySelected}${charString}`
    const url = `https://italian-verbs.onrender.com/api/v1/verbs?categoria=${categorySelected}${charString}`

    // console.log(url)

    const data = await getData(url)
    // console.log(charactersSelected, categorySelected)

    const verb = data.verb

    // console.log(verb)
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

    console.log(verb.correctWord)



    submit.addEventListener("click", (e) => {
        e.preventDefault()

        submitVerb()

    })

    helpBtn.addEventListener("click", (e) => {
        e.preventDefault()
        word.value = verb.correctWord
        // helpBtn.style.display = "none"
        count.length = 0
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

    word.style.borderColor = "black"
    showForm()




    // submit verb:
    const submitVerb = async () => {
        const inputetWord = word.value.toLowerCase()
        if (typeof verb.correctWord === "string") {
            if (inputetWord === verb.correctWord) {
                renderFunction()
                celebrateCorrect()
                word.value = ""
            }
        }

        if (typeof verb.correctWord === "object") {
            if (
                verb.correctWord.includes(inputetWord)
            ) {
                renderFunction()
                celebrateCorrect()
                word.value = ""
            }
        }
        if (inputetWord !== correctWord) {
            word.style.borderColor = "red"
        }
    }


}


const celebrateCorrect = async () => {
    icon.style.display = "block"
    await delay(1.5)
    icon.style.display = "none"

}


// next function
const getValueCheckbox = async () => {
    let result = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            result.push(`&tense=${checkboxes[i].value}`)
        }
    }
    return result;
}


// selector event listener
category.addEventListener('change', (event) => {
    // const result = document.querySelector('.result');
    // result.textContent = `You like ${event.target.value}`;
    renderFunction()
});


// checkboxes event listener


// Use Array.forEach to add an event listener to each checkbox.
checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        checkboxValueChecked =
            Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
                .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
                .map(i => `&tense=${i}`) // Use Array.map to extract only the checkbox values from the array of objects.
        renderFunction()
    })
});


btnLetter.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault()
        word.value += btn.textContent
    })
})



async function getData(url) {
    const response = await fetch(url)
    // Extract data from response
    const data = await response.json();
    // Handle errors
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data
}

new_verb.addEventListener("click", e => {
    e.preventDefault()
    word.value = ""
    renderFunction()
})



const showLoader = () => {
    const loader = document.querySelector(".loader")
    const form = document.querySelector(".form")
    loader.style.display = "block"
    form.style.display = "none"
}

const showForm = () => {
    const loader = document.querySelector(".loader")
    const form = document.querySelector(".form")
    loader.style.display = "none"
    form.style.display = "block"
}


function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}




const pingServer = async () => {
    getData("https:/italian-verbs.onrender.com/api/v1/admin")
    const loader = document.querySelector(".loader")
    const form = document.querySelector(".form")
    loader.style.display = "block"
    form.style.display = "none"
    await delay(10)

    await getData("https:/italian-verbs.onrender.com/api/v1/admin")

    await delay(10)

    loader.style.display = "none"
    form.style.display = "block"
}



try {
    pingServer()

} catch (error) {
    console.log(error)
} finally {
    renderFunction()
}
