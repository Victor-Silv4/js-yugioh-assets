
const state = {
    score:  {
        computerScore: 0,
        playerScore: 0,
        scoreBox: document.getElementById("score_points")
    },

    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },

    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },

    action: {
        button: document.getElementById("next-duel")
    }
};

const cardData = [

    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        winOf: [1],
        loseOf: [2] 
    },

    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        winOf: [2],
        loseOf: [0] 
    },

    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: "./src/assets/icons/exodia.png",
        winOf: [0],
        loseOf: [1] 
    }

];

async function updateScore() {

    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | lose: ${state.score.computerScore}`;
}

async function drawButton(duelResults) {
    state.action.button.innerText = duelResults;
    state.action.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)) {
        duelResults = "Ganhou";
        await playAudio("win");
        state.score.playerScore++;
    }

    if(playerCard.loseOf.includes(computerCardId)) {
        duelResults = "Perdeu";
        await playAudio("lose");
        state.score.computerScore++;
    }

    return duelResults;
}

async function removeAllCardsImage() {

    let cards = state.playerSides.computerBox;

    let imageElements = cards.querySelectorAll("img");

    imageElements.forEach((img) => img.remove());

    cards = state.playerSides.player1Box;

    imageElements = cards.querySelectorAll("img");

    imageElements.forEach((img) => img.remove());
}

async function setCardsField(cardId) {

    await removeAllCardsImage();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";


    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await drawButton(duelResults);
    await updateScore();
}

async function drawSelectedCard(id) {
    state.cardSprites.avatar.src = cardData[id].img;

    console.log(cardData[id].img);

    
    state.cardSprites.name.innerText = cardData[id].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[id].type;
}

async function createCardImage(randomIdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height",  "100px");
    cardImage.setAttribute("src",  "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");


    if(fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(randomIdCard)
        });
    }

   

    return cardImage;
}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function drawCards(cardNumbers, fieldSide) {

    console.log(fieldSide);

    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.action.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status) {

    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

init();