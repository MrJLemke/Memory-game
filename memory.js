const cardImages = [
    'imgs/assets/bobrossparrot.gif',
    'imgs/assets/explodyparrot.gif',
    'imgs/assets/fiestaparrot.gif',
    'imgs/assets/metalparrot.gif',
    'imgs/assets/revertitparrot.gif',
    'imgs/assets/tripletsparrot.gif',
    'imgs/assets/unicornparrot.gif',
];

let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let moves = 0;

function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

function startGame() {
    const board = document.getElementById('board');
    board.innerHTML = ''; // limpa o tabuleiro
    const numberOfCards = promptForCards();
    const selectedImages = cardImages.slice(0, numberOfCards / 2); // seleciona imagens para o número de cartas
    const doubledImages = [...selectedImages, ...selectedImages]; // cria pares das imagens
    const shuffledCards = shuffle(doubledImages); // embaralha as cartas

    shuffledCards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card', 'closed'); // inicia como fechada
        card.setAttribute('data-id', index);

        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face', 'face');
        frontFace.innerHTML = `<img src="${image}" alt="parrot" style="display:none;">`; // front com o gif inicialmente escondido

        const backFace = document.createElement('div');
        backFace.classList.add('back-face', 'face');
        backFace.innerHTML = `<img src="imgs/assets/back.png" alt="back">`; // back com a imagem de trás

        card.appendChild(backFace);
        card.appendChild(frontFace);
        board.appendChild(card);

        card.addEventListener('click', flipCard);
    });

    // reseta contadores
    cardsChosen = [];
    cardsChosenId = [];
    cardsWon = [];
    moves = 0;
}

function promptForCards() {
    let numberOfCards;
    do {
        numberOfCards = parseInt(prompt("Quantas cartas você quer jogar? (Deve ser par entre 4 e 14)"));
    } while (isNaN(numberOfCards) || numberOfCards < 4 || numberOfCards > 14 || numberOfCards % 2 !== 0);
    return numberOfCards;
}

function flipCard() {
    const selectedCard = this;
    const cardId = selectedCard.getAttribute('data-id');

    if (cardsChosenId.length < 2 && !cardsChosenId.includes(cardId)) {
        selectedCard.classList.remove('closed'); // abre a carta
        selectedCard.classList.add('open'); // adiciona classe open
        const frontFaceImg = selectedCard.querySelector('.front-face img');
        frontFaceImg.style.display = 'flex'; // mostra o gif ao abrir a carta
        cardsChosen.push(frontFaceImg.src);
        cardsChosenId.push(cardId);
        moves++; // incrementa o número de jogadas

        if (cardsChosen.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const cards = document.querySelectorAll('.card');
    const [firstCardId, secondCardId] = cardsChosenId;

    if (cardsChosen[0] === cardsChosen[1]) {
        cardsWon.push(cardsChosen); // Adiciona as cartas ganhas
        cards[firstCardId].removeEventListener('click', flipCard);
        cards[secondCardId].removeEventListener('click', flipCard);
    } else {
        // aguarda a animação de virar a carta para esconder os GIFs
        setTimeout(() => {
            cards[firstCardId].classList.remove('open');
            cards[secondCardId].classList.remove('open');

            const frontFaceImg1 = cards[firstCardId].querySelector('.front-face img');
            const frontFaceImg2 = cards[secondCardId].querySelector('.front-face img');
            
            frontFaceImg1.style.display = 'none'; // esconde o gif 
            frontFaceImg2.style.display = 'none'; // esconde o gif

            cards[firstCardId].classList.add('closed'); // fecha a carta
            cards[secondCardId].classList.add('closed'); // fecha a carta
        }, 1000); //  1 segundo para sincronizar com a animacao
    }

    cardsChosen = [];
    cardsChosenId = [];

    // verifica se todas as cartas foram combinadas
    if (cardsWon.length === (cards.length / 2)) { // numeros pares
        setTimeout(() => {
            alert(`Você ganhou em ${moves} jogadas!`);
            startGame(); // reinicia o jogo ao clicar em OK
        }, 500); // passa um tempo para o usuário ver a última combinação
    }
}


startGame();
