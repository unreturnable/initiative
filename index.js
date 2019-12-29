let trackedCharacters = []

// Render when the page first loads
render()
resetFocus()

document.addEventListener("keyup", function(event) {
  switch (event.keyCode) {
    case 13:
      event.preventDefault()
      if (checkFocus()) {
        document.getElementById('add-character').click()
      }
      break;
    case 37:
      event.preventDefault()
      previousTurn()
      break;
    case 39:
      event.preventDefault()
      nextTurn()
      break;
    case 46:
      if (trackedCharacters.length !== 0) {
        let element = trackedCharacters.find((el) => {
          return el.turn == 'turn'
        })

        removeCharacter(parseInt(element.index))
      }

      break;
  }
})

function submitCharacter() {
  const name = document.getElementById('name').value
  const score = document.getElementById('score').value
  const hitpoints = document.getElementById('hitpoints').value

  addToTracker(name, score, hitpoints)
  render()
  clearInputs()
  resetFocus()
}

function clearInputs() {
 document.getElementById('name').value = ''
 document.getElementById('score').value = ''
}

function addToTracker(name, score, hitpoints) {
  // Set a default name if one is not set
  if (name === undefined || name === "") {
    name = faker.name.findName()
  }

  // Set a default initiative score if one is not set
  if (score === undefined || score === "") {
    score = 0
  }

  // Set a default hitpoints if one is not set
  if (hitpoints === undefined || hitpoints === "") {
    hitpoints = 0
  }

  let toAdd = {
    'name': name,
    'score': score,
    'hitpoints': hitpoints,
    'turn': ''
  }
  
  if (trackedCharacters.length === 0) {
    toAdd.turn = 'turn'
    document.getElementById('footer-text').style.display = 'none'
  }

  trackedCharacters.push(toAdd)
  sortCharacters()
}

function sortCharacters() {
  trackedCharacters.sort((a, b) => {
    return parseFloat(b.score) - parseFloat(a.score)
  })

  for (let i in trackedCharacters) {
    trackedCharacters[i].index = i
  }
}

function render() {
  let template = document.getElementById('initiative-template').innerHTML
  let rendered = Mustache.render(template, trackedCharacters)
  document.getElementById('tracker').innerHTML = rendered
}

function checkFocus() {
  let focus = document.activeElement

  let scoreFocus = focus === document.getElementById('score')
  let nameFocus = focus === document.getElementById('name')
  let hitpointsFocus = focus === document.getElementById('hitpoints')

  return scoreFocus || nameFocus || hitpointsFocus
}

function resetFocus() {
  document.getElementById('score').focus()
}

function updateInitiative(index) {
  trackedCharacters[index].score = document.getElementById('initiative-' + index).value
  sortCharacters()
  render()
}

function updateName(index) {
  trackedCharacters[index].name = document.getElementById('name-' + index).value
}

function updateHitpoints(index) {
  trackedCharacters[index].hitpoints = document.getElementById('hitpoints-' + index).value
}

function removeCharacter(index) {
  if (index !== -1) {
    if (trackedCharacters[index].turn === 'turn') {
      nextTurn()
    }

    trackedCharacters.splice(index, 1)
  }

  if (trackedCharacters.length === 0) {
    document.getElementById('footer-text').style.display = 'block' 
  }

  sortCharacters()
  render()
}

function previousTurn() {
  // Check there are characters
  if (trackedCharacters.length === 0) {
    return
  }

  let element = trackedCharacters.find((el) => {
    return el.turn == 'turn'
  })

  element.turn = ''
  let index = parseInt(element.index)

  if (index === 0) {
    trackedCharacters[trackedCharacters.length - 1].turn = 'turn'
  } else {
    trackedCharacters[index - 1].turn = 'turn'
  }

  render()
}

function nextTurn() {
  // Check there are characters
  if (trackedCharacters.length === 0) {
    return
  }
  
  let element = trackedCharacters.find((el) => {
    return el.turn == 'turn'
  })

  element.turn = ''
  let index = parseInt(element.index)

  if (index === trackedCharacters.length - 1) {
    trackedCharacters[0].turn = 'turn'
  } else {
    trackedCharacters[index + 1].turn = 'turn'
  }

  render()
}
