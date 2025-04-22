// UNO Game - Vanilla JavaScript Implementation
document.addEventListener("DOMContentLoaded", () => {
  // Game elements
  const gameSetup = document.getElementById("game-setup")
  const gameBoard = document.getElementById("game-board")
  const gameOver = document.getElementById("game-over")
  const playerCountSelect = document.getElementById("player-count")
  const playerNamesContainer = document.getElementById("player-names-container")
  const playersContainer = document.getElementById("players-container")
  const currentPlayerDisplay = document.getElementById("current-player")
  const gameMessageDisplay = document.getElementById("game-message")
  const discardPile = document.getElementById("discard-pile")
  const deck = document.getElementById("deck")
  const colorSelector = document.getElementById("color-selector")
  const winnerDisplay = document.getElementById("winner-display")
  const rulesModal = document.getElementById("rules-modal")
  const questionModal = document.getElementById("question-modal")
  const questionText = document.getElementById("question-text")
  const optionsContainer = document.getElementById("options-container")
  const submitAnswerBtn = document.getElementById("submit-answer")
  const closeQuestionBtn = document.getElementById("close-question")

  // Buttons
  const newGameBtn = document.getElementById("new-game-btn")
  const startGameBtn = document.getElementById("start-game-btn")
  const drawCardBtn = document.getElementById("draw-card-btn")
  const nextPlayerBtn = document.getElementById("next-player-btn")
  const playAgainBtn = document.getElementById("play-again-btn")
  const rulesBtn = document.getElementById("rules-btn")
  const closeRulesBtn = document.getElementById("close-rules")

  // Game state
  let players = []
  let currentPlayerIndex = 0
  let gameDirection = 1 // 1 for clockwise, -1 for counter-clockwise
  let gameDeck = []
  let discardPileCards = []
  let selectedCard = null
  let gameStarted = false
  let canDrawCard = true
  let mustDrawCards = 0
  let skipNextPlayer = false
  let needToSelectColor = false
  let isProcessingTurn = false // Flag to prevent multiple card plays
  let pendingCardsToDraw = 0 // Cards that will be automatically drawn by the next player
  let currentQuestion = null // Current question being asked
  let correctAnswerIndex = null // Index of the correct answer option

  // Player colors for identification
  const playerColors = ["#d10000", "#0066cc", "#00aa00", "#ffcc00"]

  // Card definitions
  const colors = ["red", "blue", "green", "yellow"]
  const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Skip", "Reverse", "Draw Two"]
  const wilds = ["Wild", "Wild Draw Four"]

  // Questions database with multiple choice options
  const questions = [
    // Estructuras Dinámicas
    {
      category: "Estructuras Dinámicas",
      question: "¿Qué estructura de datos sigue el principio LIFO (Last In, First Out)?",
      options: ["Cola", "Pila", "Árbol", "Grafo"],
      correctIndex: 1,
    },
    {
      category: "Estructuras Dinámicas",
      question: "¿Qué estructura de datos sigue el principio FIFO (First In, First Out)?",
      options: ["Pila", "Árbol Binario", "Cola", "Tabla Hash"],
      correctIndex: 2,
    },
    {
      category: "Estructuras Dinámicas",
      question: "¿Cómo se llama la estructura de datos que almacena pares clave-valor?",
      options: ["Lista Enlazada", "Diccionario", "Árbol AVL", "Cola de Prioridad"],
      correctIndex: 1,
    },
    {
      category: "Estructuras Dinámicas",
      question: "¿Qué estructura de datos no lineal se utiliza para representar jerarquías?",
      options: ["Árbol", "Lista", "Cola", "Pila"],
      correctIndex: 0,
    },
    {
      category: "Estructuras Dinámicas",
      question: "¿Cuál es la complejidad temporal promedio de búsqueda en un árbol binario de búsqueda balanceado?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctIndex: 2,
    },

    // Teoría de Conteo
    {
      category: "Teoría de Conteo",
      question: "Si tengo 5 camisas y 3 pantalones, ¿cuántos conjuntos diferentes puedo formar?",
      options: ["8", "15", "12", "5"],
      correctIndex: 1,
    },
    {
      category: "Teoría de Conteo",
      question: "¿Cuántos números de 3 dígitos se pueden formar con los dígitos 1, 2, 3, 4, 5 sin repetir dígitos?",
      options: ["60", "120", "24", "125"],
      correctIndex: 0,
    },
    {
      category: "Teoría de Conteo",
      question: "¿Cuántas diagonales tiene un polígono de 6 lados?",
      options: ["6", "9", "12", "15"],
      correctIndex: 1,
    },
    {
      category: "Teoría de Conteo",
      question: "¿Cuántos subconjuntos tiene un conjunto de 4 elementos?",
      options: ["8", "16", "4", "24"],
      correctIndex: 1,
    },
    {
      category: "Teoría de Conteo",
      question: "¿Cuál es el resultado de 7! (factorial de 7)?",
      options: ["2520", "5040", "720", "40320"],
      correctIndex: 1,
    },

    // Permutación
    {
      category: "Permutación",
      question: "¿Cuántas permutaciones diferentes se pueden formar con las letras de la palabra 'CASA'?",
      options: ["12", "24", "4", "16"],
      correctIndex: 1,
    },
    {
      category: "Permutación",
      question: "¿Cuántas permutaciones diferentes se pueden formar con las letras de la palabra 'MAMA'?",
      options: ["24", "12", "4", "16"],
      correctIndex: 1,
    },
    {
      category: "Permutación",
      question: "¿Cuántas formas hay de ordenar 5 libros diferentes en un estante?",
      options: ["25", "120", "60", "5"],
      correctIndex: 1,
    },
    {
      category: "Permutación",
      question: "¿Cuál es la fórmula para calcular permutaciones de n elementos tomados de r en r?",
      options: ["n!/(n-r)!", "n!/r!", "n!/(n-r)!r!", "n^r"],
      correctIndex: 0,
    },
    {
      category: "Permutación",
      question: "¿Cuántas permutaciones circulares diferentes hay con 4 personas alrededor de una mesa redonda?",
      options: ["24", "6", "12", "4"],
      correctIndex: 1,
    },

    // Teoría Combinatoria
    {
      category: "Teoría Combinatoria",
      question: "¿Cuántas formas hay de elegir 3 cartas de una baraja de 52 cartas?",
      options: ["22100", "17576", "22880", "140608"],
      correctIndex: 0,
    },
    {
      category: "Teoría Combinatoria",
      question: "¿Cuántas combinaciones de 2 elementos se pueden formar con un conjunto de 6 elementos?",
      options: ["12", "15", "30", "6"],
      correctIndex: 1,
    },
    {
      category: "Teoría Combinatoria",
      question: "¿Cuál es el coeficiente binomial C(8,3)?",
      options: ["56", "28", "70", "35"],
      correctIndex: 0,
    },
    {
      category: "Teoría Combinatoria",
      question: "¿Cuántas formas hay de formar un comité de 4 personas de un grupo de 10 personas?",
      options: ["210", "120", "45", "1024"],
      correctIndex: 0,
    },
    {
      category: "Teoría Combinatoria",
      question: "¿Cuál es la fórmula para calcular combinaciones de n elementos tomados de r en r?",
      options: ["n!/(n-r)!", "n!/r!", "n!/(n-r)!r!", "n^r"],
      correctIndex: 2,
    },
  ]

  // Event listeners for buttons
  newGameBtn.addEventListener("click", setupNewGame)
  startGameBtn.addEventListener("click", startGame)
  drawCardBtn.addEventListener("click", handleDrawCard)
  nextPlayerBtn.addEventListener("click", goToNextPlayer)
  playAgainBtn.addEventListener("click", setupNewGame)
  deck.addEventListener("click", handleDrawCard)
  rulesBtn.addEventListener("click", showRules)
  closeRulesBtn.addEventListener("click", hideRules)
  submitAnswerBtn.addEventListener("click", checkAnswer)
  closeQuestionBtn.addEventListener("click", () => {
    questionModal.classList.add("hidden")
    applyPenalty() // Apply penalty if the player closes the question without answering
  })

  // Color selector event listeners
  document.querySelectorAll(".color-option").forEach((option) => {
    option.addEventListener("click", function () {
      const selectedColor = this.getAttribute("data-color")
      handleColorSelection(selectedColor)
    })
  })

  // Initialize the game
  setupNewGame()

  // Function to show rules
  function showRules() {
    rulesModal.classList.remove("hidden")
  }

  // Function to hide rules
  function hideRules() {
    rulesModal.classList.add("hidden")
  }

  // Function to set up a new game
  function setupNewGame() {
    // Reset game state
    players = []
    currentPlayerIndex = 0
    gameDirection = 1
    gameDeck = []
    discardPileCards = []
    selectedCard = null
    gameStarted = false
    canDrawCard = true
    mustDrawCards = 0
    skipNextPlayer = false
    needToSelectColor = false
    isProcessingTurn = false
    pendingCardsToDraw = 0
    currentQuestion = null
    correctAnswerIndex = null

    // Show setup screen, hide game board and game over
    gameSetup.classList.remove("hidden")
    gameBoard.classList.add("hidden")
    gameOver.classList.add("hidden")
    questionModal.classList.add("hidden")

    // Generate player name inputs
    generatePlayerInputs()
  }

  // Generate input fields for player names
  function generatePlayerInputs() {
    const playerCount = Number.parseInt(playerCountSelect.value)
    playerNamesContainer.innerHTML = ""

    for (let i = 0; i < playerCount; i++) {
      const playerDiv = document.createElement("div")
      playerDiv.className = "player-input"

      const colorSpan = document.createElement("span")
      colorSpan.className = "player-color"
      colorSpan.style.backgroundColor = playerColors[i]

      const label = document.createElement("label")
      label.textContent = `Jugador ${i + 1}:`

      const input = document.createElement("input")
      input.type = "text"
      input.id = `player-name-${i}`
      input.value = `Jugador ${i + 1}`

      playerDiv.appendChild(colorSpan)
      playerDiv.appendChild(label)
      playerDiv.appendChild(input)
      playerNamesContainer.appendChild(playerDiv)
    }
  }

  // Update player count when selection changes
  playerCountSelect.addEventListener("change", generatePlayerInputs)

  // Start the game
  function startGame() {
    const playerCount = Number.parseInt(playerCountSelect.value)

    // Create players
    players = []
    for (let i = 0; i < playerCount; i++) {
      const nameInput = document.getElementById(`player-name-${i}`)
      const playerName = nameInput.value.trim() || `Jugador ${i + 1}`

      players.push({
        name: playerName,
        hand: [],
        color: playerColors[i],
      })
    }

    // Create and shuffle the deck
    createDeck()
    shuffleDeck()

    // Deal cards to players (7 cards each)
    dealCards()

    // Set up the discard pile with the first card
    setupDiscardPile()

    // Show game board, hide setup
    gameSetup.classList.add("hidden")
    gameBoard.classList.remove("hidden")

    // Render player hands
    renderPlayers()

    // Set current player
    currentPlayerIndex = 0
    updateGameStatus()

    gameStarted = true
  }

  // Create a new deck of UNO cards
  function createDeck() {
    gameDeck = []

    // Add number and action cards
    colors.forEach((color) => {
      // Add one 0 card for each color
      gameDeck.push({ color, value: "0" })

      // Add two of each number 1-9 and action cards for each color
      for (let i = 1; i < values.length; i++) {
        gameDeck.push({ color, value: values[i] })
        gameDeck.push({ color, value: values[i] })
      }
    })

    // Add wild cards
    wilds.forEach((wild) => {
      for (let i = 0; i < 4; i++) {
        gameDeck.push({ color: "black", value: wild })
      }
    })
  }

  // Shuffle the deck using Fisher-Yates algorithm
  function shuffleDeck() {
    for (let i = gameDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[gameDeck[i], gameDeck[j]] = [gameDeck[j], gameDeck[i]]
    }
  }

  // Deal cards to players
  function dealCards() {
    for (let i = 0; i < 7; i++) {
      players.forEach((player) => {
        if (gameDeck.length > 0) {
          player.hand.push(gameDeck.pop())
        }
      })
    }
  }

  // Set up the discard pile with the first card
  function setupDiscardPile() {
    // Get the first card for the discard pile
    let firstCard = gameDeck.pop()

    // Make sure the first card is not a wild card or action card
    while (
      firstCard &&
      (firstCard.value === "Wild" ||
        firstCard.value === "Wild Draw Four" ||
        firstCard.value === "Skip" ||
        firstCard.value === "Reverse" ||
        firstCard.value === "Draw Two")
    ) {
      gameDeck.unshift(firstCard)
      firstCard = gameDeck.pop()
    }

    discardPileCards = [firstCard]
    renderDiscardPile()
  }

  // Render all player hands
  function renderPlayers() {
    playersContainer.innerHTML = ""

    // First render opponent players (without showing their cards)
    players.forEach((player, index) => {
      if (index !== currentPlayerIndex) {
        const playerDiv = document.createElement("div")
        playerDiv.className = "player-hand"
        playerDiv.id = `player-${index}`

        const playerInfo = document.createElement("div")
        playerInfo.className = "player-info"

        const playerName = document.createElement("div")
        playerName.className = "player-name"

        const colorDot = document.createElement("span")
        colorDot.className = "player-color"
        colorDot.style.backgroundColor = player.color

        const nameSpan = document.createElement("span")
        nameSpan.textContent = player.name

        playerName.appendChild(colorDot)
        playerName.appendChild(nameSpan)

        const cardCount = document.createElement("div")
        cardCount.className = "card-count"
        cardCount.textContent = `${player.hand.length} cartas`

        playerInfo.appendChild(playerName)
        playerInfo.appendChild(cardCount)
        playerDiv.appendChild(playerInfo)

        // Show card backs for opponent players
        const cardsContainer = document.createElement("div")
        cardsContainer.className = "cards-container"

        for (let i = 0; i < player.hand.length; i++) {
          const cardBack = document.createElement("div")
          cardBack.className = "card card-back mini-card"

          const cardInner = document.createElement("div")
          cardInner.className = "card-inner"
          cardInner.textContent = "UNO"

          cardBack.appendChild(cardInner)
          cardsContainer.appendChild(cardBack)
        }

        playerDiv.appendChild(cardsContainer)
        playersContainer.appendChild(playerDiv)
      }
    })

    // Then render current player's hand with all cards visible
    const currentPlayer = players[currentPlayerIndex]
    const playerDiv = document.createElement("div")
    playerDiv.className = "player-hand active"
    playerDiv.id = `player-${currentPlayerIndex}`

    const playerInfo = document.createElement("div")
    playerInfo.className = "player-info"

    const playerName = document.createElement("div")
    playerName.className = "player-name"

    const colorDot = document.createElement("span")
    colorDot.className = "player-color"
    colorDot.style.backgroundColor = currentPlayer.color

    const nameSpan = document.createElement("span")
    nameSpan.textContent = currentPlayer.name + " (Tú)"

    playerName.appendChild(colorDot)
    playerName.appendChild(nameSpan)

    const cardCount = document.createElement("div")
    cardCount.className = "card-count"
    cardCount.textContent = `${currentPlayer.hand.length} cartas`

    playerInfo.appendChild(playerName)
    playerInfo.appendChild(cardCount)
    playerDiv.appendChild(playerInfo)

    // Show current player's cards in a horizontal scrollable container
    const cardsContainer = document.createElement("div")
    cardsContainer.className = "current-player-cards"

    currentPlayer.hand.forEach((card, cardIndex) => {
      const cardElement = createCardElement(card, cardIndex)
      cardsContainer.appendChild(cardElement)
    })

    playerDiv.appendChild(cardsContainer)
    playersContainer.appendChild(playerDiv)
  }

  // Create a card element
  function createCardElement(card, index) {
    const cardElement = document.createElement("div")
    cardElement.className = `card ${card.color}`
    cardElement.setAttribute("data-index", index)

    const cardInner = document.createElement("div")
    cardInner.className = "card-inner"

    // Change the display text for special cards
    let displayText = card.value
    if (card.value === "Draw Two") {
      displayText = "+2"
    } else if (card.value === "Wild Draw Four") {
      displayText = "+4"
    } else if (card.value === "Skip") {
      displayText = "⊘"
    } else if (card.value === "Reverse") {
      displayText = "⇄"
    } else if (card.value === "Wild") {
      displayText = "W"
    }

    cardInner.textContent = displayText

    cardElement.appendChild(cardInner)

    // Add click event for playing cards
    cardElement.addEventListener("click", () => {
      // Prevent multiple card plays in quick succession
      if (isProcessingTurn) {
        return
      }

      if (needToSelectColor) {
        gameMessageDisplay.textContent = "¡Primero debes seleccionar un color!"
        return
      }

      if (canPlayCard(card)) {
        isProcessingTurn = true // Lock the game while processing this turn
        playCard(index)
      } else {
        gameMessageDisplay.textContent = "¡No puedes jugar esa carta!"
      }
    })

    return cardElement
  }

  // Render the discard pile
  function renderDiscardPile() {
    discardPile.innerHTML = ""

    if (discardPileCards.length > 0) {
      const topCard = discardPileCards[discardPileCards.length - 1]
      const cardElement = document.createElement("div")
      cardElement.className = `card ${topCard.color}`

      const cardInner = document.createElement("div")
      cardInner.className = "card-inner"

      // Change the display text for special cards on the discard pile too
      let displayText = topCard.value
      if (topCard.value === "Draw Two") {
        displayText = "+2"
      } else if (topCard.value === "Wild Draw Four") {
        displayText = "+4"
      } else if (topCard.value === "Skip") {
        displayText = "⊘"
      } else if (topCard.value === "Reverse") {
        displayText = "⇄"
      } else if (topCard.value === "Wild") {
        displayText = "W"
      }

      cardInner.textContent = displayText

      cardElement.appendChild(cardInner)
      discardPile.appendChild(cardElement)
    }
  }

  // Update game status display
  function updateGameStatus() {
    const currentPlayer = players[currentPlayerIndex]
    currentPlayerDisplay.textContent = `Turno de: ${currentPlayer.name}`
    currentPlayerDisplay.style.color = currentPlayer.color

    // Show/hide next player button based on game state
    nextPlayerBtn.classList.add("hidden")
    drawCardBtn.disabled = !canDrawCard || needToSelectColor

    renderPlayers()
  }

  // Check if a card can be played
  function canPlayCard(card) {
    if (mustDrawCards > 0 || needToSelectColor) {
      return false // Player must draw cards first or select a color
    }

    const topCard = discardPileCards[discardPileCards.length - 1]

    // Wild cards can always be played
    if (card.value === "Wild" || card.value === "Wild Draw Four") {
      return true
    }

    // Cards with the same color can be played
    if (card.color === topCard.color) {
      return true
    }

    // Cards with the same value can be played
    if (card.value === topCard.value) {
      return true
    }

    return false
  }

  // Play a card from the current player's hand
  function playCard(cardIndex) {
    const currentPlayer = players[currentPlayerIndex]
    const card = currentPlayer.hand[cardIndex]

    // Remove the card from the player's hand
    currentPlayer.hand.splice(cardIndex, 1)

    // Add the card to the discard pile
    discardPileCards.push(card)

    // Render the updated discard pile
    renderDiscardPile()

    // Check if the player has won
    if (currentPlayer.hand.length === 0) {
      endGame(currentPlayerIndex)
      return
    }

    // Handle special cards
    handleSpecialCard(card)

    // Update the game display
    renderPlayers()
  }

  // Handle special card effects
  function handleSpecialCard(card) {
    switch (card.value) {
      case "Skip":
        if (players.length === 2) {
          // In a two-player game, Skip allows the current player to play again
          gameMessageDisplay.textContent = "¡Turno saltado! Juegas de nuevo."
          skipNextPlayer = false
          isProcessingTurn = false // Allow the current player to play again
          return // Don't show the next player button
        } else {
          // In games with more than 2 players, Skip makes the next player lose their turn
          skipNextPlayer = true
          gameMessageDisplay.textContent = "¡Turno saltado!"
          nextPlayerBtn.classList.remove("hidden")
        }
        break

      case "Reverse":
        gameDirection *= -1

        if (players.length === 2) {
          // In a two-player game, Reverse allows the current player to play again
          gameMessageDisplay.textContent = "¡Dirección invertida! Juegas de nuevo."
          skipNextPlayer = false
          isProcessingTurn = false // Allow the current player to play again
          return // Don't show the next player button
        } else {
          gameMessageDisplay.textContent = "¡Dirección invertida!"
          nextPlayerBtn.classList.remove("hidden")
        }
        break

      case "Draw Two":
        // Set the cards to be drawn by the NEXT player
        pendingCardsToDraw = 2
        gameMessageDisplay.textContent = "¡El siguiente jugador debe robar 2 cartas!"
        nextPlayerBtn.classList.remove("hidden")
        break

      case "Wild":
        needToSelectColor = true
        showColorSelector()
        return // Don't proceed to next player yet

      case "Wild Draw Four":
        // Set the cards to be drawn by the NEXT player
        pendingCardsToDraw = 4
        needToSelectColor = true
        showColorSelector()
        return // Don't proceed to next player yet

      default:
        // Regular number card - go directly to next player
        gameMessageDisplay.textContent = "Carta jugada."
        // Automatically go to next player instead of showing the button
        setTimeout(() => {
          goToNextPlayer()
        }, 1000)
    }
  }

  // Show the color selector for Wild cards
  function showColorSelector() {
    colorSelector.classList.remove("hidden")
    gameMessageDisplay.textContent = "Selecciona un color"
    canDrawCard = false
  }

  // Handle color selection for Wild cards
  function handleColorSelection(color) {
    // Update the color of the top card
    const topCard = discardPileCards[discardPileCards.length - 1]
    topCard.color = color

    // Hide the color selector
    colorSelector.classList.add("hidden")

    // Render the updated discard pile
    renderDiscardPile()

    // Enable drawing cards again
    canDrawCard = true
    needToSelectColor = false

    // Show next player button
    nextPlayerBtn.classList.remove("hidden")

    if (topCard.value === "Wild") {
      gameMessageDisplay.textContent = `Color cambiado a ${color}.`
    } else {
      gameMessageDisplay.textContent = `Color cambiado a ${color}. ¡El siguiente jugador debe robar 4 cartas!`
    }
  }

  // Handle drawing a card
  function handleDrawCard() {
    if (!canDrawCard || needToSelectColor || isProcessingTurn) return

    isProcessingTurn = true // Lock the game while processing this turn
    const currentPlayer = players[currentPlayerIndex]

    // Draw a single card
    if (gameDeck.length === 0) {
      reshuffleDeck()
    }

    if (gameDeck.length > 0) {
      const drawnCard = gameDeck.pop()
      currentPlayer.hand.push(drawnCard)

      gameMessageDisplay.textContent = `${currentPlayer.name} robó una carta.`

      // Check if the drawn card can be played
      const topCard = discardPileCards[discardPileCards.length - 1]
      if (canPlayCard(drawnCard)) {
        renderPlayers()
        isProcessingTurn = false // Allow the player to play the drawn card
      } else {
        // Player can't play the drawn card, move to next player
        canDrawCard = false
        nextPlayerBtn.classList.remove("hidden")
      }
    } else {
      gameMessageDisplay.textContent = "No hay más cartas para robar."
      isProcessingTurn = false
    }

    renderPlayers()
  }

  // Reshuffle the discard pile to create a new deck
  function reshuffleDeck() {
    if (discardPileCards.length <= 1) return

    const topCard = discardPileCards.pop()
    gameDeck = [...discardPileCards]
    discardPileCards = [topCard]

    shuffleDeck()
    gameMessageDisplay.textContent = "Mazo rebarajado."
  }

  // Move to the next player
  function goToNextPlayer() {
    // Reset for next player
    canDrawCard = true
    nextPlayerBtn.classList.add("hidden")

    // Determine the next player
    if (skipNextPlayer) {
      currentPlayerIndex = (currentPlayerIndex + gameDirection * 2 + players.length) % players.length
      skipNextPlayer = false
    } else {
      currentPlayerIndex = (currentPlayerIndex + gameDirection + players.length) % players.length
    }

    // If there are pending cards to draw, show a question for +4 or directly add cards for +2
    if (pendingCardsToDraw > 0) {
      const nextPlayer = players[currentPlayerIndex]

      if (pendingCardsToDraw === 4) {
        // For +4, show a question
        showQuestion()
      } else {
        // For +2, directly add the cards
        addPendingCardsToDraw()
      }
    } else {
      gameMessageDisplay.textContent = `Turno de ${players[currentPlayerIndex].name}.`
      // Reset the processing turn flag to allow the next player to play
      isProcessingTurn = false
      // Show a message to pass the device to the next player
      if (players.length > 1) {
        alert(`Pasa el dispositivo a ${players[currentPlayerIndex].name} para su turno.`)
      }
    }

    updateGameStatus()
  }

  // Show a random question with multiple choice options
  function showQuestion() {
    // Select a random question
    const randomIndex = Math.floor(Math.random() * questions.length)
    currentQuestion = questions[randomIndex]
    correctAnswerIndex = currentQuestion.correctIndex

    // Display the question
    questionText.textContent = `[${currentQuestion.category}] ${currentQuestion.question}`

    // Clear previous options
    optionsContainer.innerHTML = ""

    // Create radio buttons for each option
    currentQuestion.options.forEach((option, index) => {
      const optionDiv = document.createElement("div")
      optionDiv.className = "option"

      const radio = document.createElement("input")
      radio.type = "radio"
      radio.name = "question-option"
      radio.id = `option-${index}`
      radio.value = index

      const label = document.createElement("label")
      label.htmlFor = `option-${index}`
      label.textContent = option

      optionDiv.appendChild(radio)
      optionDiv.appendChild(label)
      optionsContainer.appendChild(optionDiv)
    })

    questionModal.classList.remove("hidden")
  }

  // Check the selected answer
  function checkAnswer() {
    // Get the selected option
    const selectedOption = document.querySelector('input[name="question-option"]:checked')

    if (!selectedOption) {
      alert("Por favor selecciona una respuesta")
      return
    }

    const selectedIndex = Number.parseInt(selectedOption.value)

    // Check if the answer is correct
    if (selectedIndex === correctAnswerIndex) {
      // Answer is correct, cancel the penalty
      alert("¡Respuesta correcta! No recibirás las 4 cartas de penalización.")
      pendingCardsToDraw = 0
      questionModal.classList.add("hidden")

      // Continue with the player's turn
      gameMessageDisplay.textContent = `¡${players[currentPlayerIndex].name} respondió correctamente y evitó la penalización!`
      isProcessingTurn = false
    } else {
      // Answer is incorrect, apply the penalty
      alert(`Respuesta incorrecta. La respuesta correcta era: ${currentQuestion.options[correctAnswerIndex]}`)
      questionModal.classList.add("hidden")
      applyPenalty()
    }
  }

  // Apply the penalty (add the pending cards to the player's hand)
  function applyPenalty() {
    addPendingCardsToDraw()
  }

  // Add pending cards to the current player's hand
  function addPendingCardsToDraw() {
    const currentPlayer = players[currentPlayerIndex]

    // Make sure we have enough cards
    if (gameDeck.length < pendingCardsToDraw) {
      reshuffleDeck()
    }

    // Draw the cards
    for (let i = 0; i < pendingCardsToDraw; i++) {
      if (gameDeck.length > 0) {
        currentPlayer.hand.push(gameDeck.pop())
      }
    }

    // Show a message about the drawn cards
    gameMessageDisplay.textContent = `${currentPlayer.name} ha recibido ${pendingCardsToDraw} cartas de penalización.`

    // Reset the pending cards
    pendingCardsToDraw = 0

    // Reset the processing turn flag to allow the next player to play
    isProcessingTurn = false

    // Show a message to pass the device to the next player
    if (players.length > 1) {
      alert(`Pasa el dispositivo a ${players[currentPlayerIndex].name} para su turno.`)
    }
  }

  // End the game
  function endGame(winnerIndex) {
    gameStarted = false

    // Show game over screen
    gameBoard.classList.add("hidden")
    gameOver.classList.remove("hidden")

    // Display winner
    const winner = players[winnerIndex]
    winnerDisplay.textContent = `¡${winner.name} ha ganado!`
    winnerDisplay.style.color = winner.color
  }
})
