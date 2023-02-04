//query selectors

const allInputsOsoba = document.querySelectorAll("input[type=search]");
const successAnimationCheckmark = document.querySelector(".success-checkmark")
const confettiDiv = document.querySelector(".confetti")



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
let tryes = [0, 0]


const checkIfAllOsobyCorrect = async () => {
  let arrAllinputsOsoba = Array.from(allInputsOsoba)
  let check = arrAllinputsOsoba.every(item => item.classList.contains('correct'))
  if (check) {
    celebrateCorrect()
  }
}

//trye again

const uncheckAllClasses = async () => {
  allInputsOsoba.forEach(item => item.classList.remove('correct'))
}

const celebrateCorrect = async () => {
  confettiDiv.style.display = "block"
  mainFormFunction()
  initConfetti();
  render();
  // hideForm()
  await delay(3)
  confettiDiv.style.display = "none"
  clearForm()
  uncheckAllClasses()
  // showForm()
}

const correctVerb = (el) => {
  el.style.border = "3px solid green";
}

const incorrectVerb = (el) => {
  if (el.disabled.true) {
    el.style.border = "none";
  } else {
    el.style.border = "3px solid #ff3333";
  }
}

// function to form url from checked checkboxes
const formUrl = async () => {
  let charactersSelected = await getValueCheckbox(checkboxes, "tense");
  let getZwrotne = await getValueCheckbox(zwrotne, "zwrotne")

  let categorySelected = category.value
  let charString = charactersSelected.join("")

  // charactersSelected.join("")
  if (charString.length === 0) {
    charString = `&tense=Presente Indicativo`
  }

  if (categorySelected === "all") {
    categorySelected = ["regularny", "nieregularny"][Math.floor(Math.random() * 2)];
  }
  // const url = `http://127.0.0.1:3000/api/v1/verbs/full?categoria=${categorySelected}${charString}${getZwrotne[0]}`
  const url = `https://italian-verbs.onrender.com/api/v1/verbs/full?categoria=${categorySelected}${charString}${getZwrotne[0]}`
  // const url2 = `https://italian-verbs.onrender.com/api/v1/verbs/full?categoria=${categorySelected}${charString}${getZwrotne[0]}`

  return url
}


const checkIfAllGuessed = (arr) => {
  console.log(arr.disabled === true)
  if (tryes.length === 0) {
    return true
  } else {
    return NaN
  }
}






// submit verb:
const submitVerb = async () => {

  let correctVerbArr = []
  let tempArr = []

  allInputsOsoba.forEach(osoba => {
    let inputtetWord = osoba.value.toLowerCase()

    if (osoba.name.includes(";") || osoba.name.includes(",")) {
      // verb.correctWord
      tempArr = osoba.name.split(/[;,]/)
      tempArr.forEach(word => {
        const newWord = word.trim()
        correctVerbArr.push(newWord)
      })
    }


    if (inputtetWord === osoba.name || correctVerbArr.includes(inputtetWord)) {
      console.log(correctVerbArr)
      osoba.className = "correct"
      correctVerb(osoba)
      checkIfAllOsobyCorrect()

      // if (checkIfAllGuessed(allInputsOsoba)) {
      //   celebrateCorrect()
      //   clearForm()
      // }

    }
    if (inputtetWord !== osoba.name && osoba.disabled !== true) {
      incorrectVerb(osoba)
    }
  })


}

// render verb data to DOM
function renderFunction(verb) {
  const capitalizedVerb =
    verb.czasownik.charAt(0).toUpperCase()
    + verb.czasownik.slice(1)
  czasownik.textContent = capitalizedVerb
  tlumaczenie.textContent = `(${verb.tlumaczenie})`
  tense.textContent = verb.tense

  // allInputsOsoba.forEach(osoba => {
  //   if
  // })

  // check if all verbs are correct.

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
  // osoba.textContent = verb.pluc
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



const populateOsoba = async (data) => {
  allInputsOsoba.forEach(input => {

    if (data[input.id]) {
      input.disabled = false
      input.name = data[input.id]
    } else {
      input.disabled = true
      input.className = "correct"
      input.style.border = "none"
    }

  })



}


async function mainFormFunction() {
  const url = await formUrl()
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const verb = formObject(data)
      populateOsoba(verb)
      console.log(verb)
      renderFunction(verb)
    }).catch(e => { console.log(e) })
  // showForm()
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
  clearForm()
  mainFormFunction()
})


// selector event listener
category.addEventListener('change', (event) => {
  // const result = document.querySelector('.result');
  // result.textContent = `You like ${event.target.value}`;
  mainFormFunction()
});

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



let focusInputVal = NaN

allInputsOsoba.forEach(osoba => {
  osoba.addEventListener("focus", (e) => {
    focusInputVal = document.querySelector(":focus");
  })
  // osoba.value += btn.textContent

})


allInputsOsoba.forEach(osoba => {


  osoba.addEventListener("keypress", function (event) {
    const tryWord = osoba.value.toLowerCase()
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      if (osoba.name === tryWord) {
        correctVerb(osoba)
        osoba.className = "correct"
      } else {
        incorrectVerb(osoba)
      }
    }
  });
})



btnLetter.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault()
    focusInputVal.value += btn.textContent
  })
})



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
const hideForm = () => {
  mainSection.style.display = "none"
  loader.style.display = "none"
  form.style.display = "none"
}

const clearForm = () => {
  allInputsOsoba.forEach(osoba => {
    osoba.style.border = "2px solid black"
    osoba.value = ""
  })
}


function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}



const pingServer = async () => {
  showLoader()
  try {
    const url = "https://italian-verbs.onrender.com/api/v1/verbs?categoria=nieregularny&tense=Presente Indicativo&osoba=IO&zwrotne=false"

    const ping = await fetch(url)
    // const ping = await getData("http://127.0.0.1:3000/api/v1/verbs/ping")
    if (ping.status === 200) {
      stopInterval()
      showForm()
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


mainFormFunction()
startInterval()




// confetti 

//-----------Var Inits--------------
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cx = ctx.canvas.width / 2;
cy = ctx.canvas.height / 2;

let confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
  { front: 'red', back: 'darkred' },
  { front: 'green', back: 'darkgreen' },
  { front: 'blue', back: 'darkblue' },
  { front: 'yellow', back: 'darkyellow' },
  { front: 'orange', back: 'darkorange' },
  { front: 'pink', back: 'darkpink' },
  { front: 'purple', back: 'darkpurple' },
  { front: 'turquoise', back: 'darkturquoise' }];


//-----------Functions--------------
resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30)
      },

      position: {
        x: randomRange(0, canvas.width),
        y: canvas.height - 1
      },

      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1
      },

      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50)
      }
    });


  }
};

//---------Render-----------
render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;

    // Move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    // Delete confetti when out of frame
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

    // Loop confetto x position
    if (confetto.position.x > canvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.width;

    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    // Draw confetti
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // Reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  // Fire off another round of confetti
  if (confetti.length <= 10) initConfetti();

  window.requestAnimationFrame(render);
};

//---------Execution--------


// //----------Resize----------
// window.addEventListener('resize', function () {
//   resizeCanvas();
// });

// //------------Click------------
// window.addEventListener('click', function () {
//   initConfetti();
// });