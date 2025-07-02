document.addEventListener('DOMContentLoaded', () => {
    // --- BASE DE DATOS DE PALABRAS ---
    const wordDatabase = [
        { word: 'canción', type: 'agudas' }, { word: 'jugar', type: 'agudas' }, { word: 'París', type: 'agudas' },
        { word: 'árbol', type: 'llanas' }, { word: 'mesa', type: 'llanas' }, { word: 'carácter', type: 'llanas' },
        { word: 'página', type: 'esdrujulas' }, { word: 'América', type: 'esdrujulas' }, { word: 'brújula', type: 'esdrujulas' },
        { word: 'cuéntamelo', type: 'sobresdrujulas' }, { word: 'fácilmente', type: 'sobresdrujulas' }, { word: 'repítemelo', type: 'sobresdrujulas' },
        { word: 'reloj', type: 'agudas' }, { word: 'inglés', type: 'agudas' }, { word: 'sofá', type: 'agudas' },
        { word: 'examen', type: 'llanas' }, { word: 'lápiz', type: 'llanas' }, { word: 'casa', type: 'llanas' },
        { word: 'plátano', type: 'esdrujulas' }, { word: 'médico', type: 'esdrujulas' }, { word: 'pirámide', type: 'esdrujulas' },
        { word: 'cómetelo', type: 'sobresdrujulas' }, { word: 'dibújamelo', type: 'sobresdrujulas' }, { word: 'ágilmente', type: 'sobresdrujulas' }
    ];

    const WORDS_PER_GAME = 12;
    let score = 0;
    let currentWords = [];

    // --- ELEMENTOS DEL DOM ---
    const wordsContainer = document.getElementById('words-container');
    const toolboxes = document.querySelectorAll('.toolbox');
    const feedbackEmoji = document.getElementById('feedback-emoji');
    const scoreCounter = document.getElementById('score-counter');
    const endScreen = document.getElementById('end-screen');
    const restartButton = document.getElementById('restart-button');
    const workshopArea = document.querySelector('.workshop-area');

    // --- FUNCIONES DEL JUEGO ---

    function startGame() {
        score = 0;
        wordsContainer.innerHTML = '';
        workshopArea.classList.remove('hidden');
        endScreen.classList.add('hidden');

        // Mezclar y seleccionar palabras
        const shuffled = wordDatabase.sort(() => 0.5 - Math.random());
        currentWords = shuffled.slice(0, WORDS_PER_GAME);

        // Crear las piezas de palabras
        currentWords.forEach((item, index) => {
            const wordPiece = document.createElement('div');
            wordPiece.id = `word-${index}`;
            wordPiece.className = 'word-piece';
            wordPiece.draggable = true;
            wordPiece.textContent = item.word;
            wordPiece.dataset.type = item.type;
            wordsContainer.appendChild(wordPiece);
        });

        addDragAndDropListeners();
        updateScore();
    }

    function addDragAndDropListeners() {
        const wordPieces = document.querySelectorAll('.word-piece');
        wordPieces.forEach(piece => {
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragend', handleDragEnd);
        });

        toolboxes.forEach(box => {
            box.addEventListener('dragover', handleDragOver);
            box.addEventListener('dragenter', handleDragEnter);
            box.addEventListener('dragleave', handleDragLeave);
            box.addEventListener('drop', handleDrop);
        });
    }

    // --- MANEJADORES DE EVENTOS DRAG & DROP ---

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => e.target.classList.add('dragging'), 0);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault(); // Necesario para permitir el drop
    }

    function handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('toolbox')) {
            e.target.classList.add('drag-over');
        }
    }

    function handleDragLeave(e) {
        if (e.target.classList.contains('toolbox')) {
            e.target.classList.remove('drag-over');
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        const targetBox = e.target.closest('.toolbox');
        targetBox.classList.remove('drag-over');

        const wordId = e.dataTransfer.getData('text/plain');
        const wordPiece = document.getElementById(wordId);
        const correctType = wordPiece.dataset.type;

        if (targetBox.id === correctType) {
            // Acierto
            targetBox.appendChild(wordPiece);
            wordPiece.draggable = false;
            wordPiece.classList.add('classified');
            targetBox.classList.add('correct');
            score++;
            updateScore();
        } else {
            // Error
            targetBox.classList.add('incorrect');
            showFeedbackEmoji();
        }

        setTimeout(() => {
            targetBox.classList.remove('correct', 'incorrect');
        }, 500);

        if (score === WORDS_PER_GAME) {
            endGame();
        }
    }

    function showFeedbackEmoji() {
        feedbackEmoji.classList.remove('hidden', 'show');
        void feedbackEmoji.offsetWidth; // Truco para reiniciar la animación
        feedbackEmoji.classList.add('show');
        setTimeout(() => {
            feedbackEmoji.classList.remove('show');
            feedbackEmoji.classList.add('hidden');
        }, 2000);
    }

    function updateScore() {
        scoreCounter.textContent = `Palabras clasificadas: ${score} / ${WORDS_PER_GAME}`;
    }
    
    function endGame() {
        setTimeout(() => {
            workshopArea.classList.add('hidden');
            endScreen.classList.remove('hidden');
        }, 1000);
    }

    // --- INICIAR JUEGO ---
    restartButton.addEventListener('click', startGame);
    startGame();
});
