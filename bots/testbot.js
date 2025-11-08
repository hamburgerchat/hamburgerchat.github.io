class GameBot {
    constructor() {
        this.name = "ИгровойБот";
        this.greetings = ["привет", "hello", "здравствуй", "хай", "ку"];
        this.farewells = ["пока", "до свидания", "прощай", "bye"];
        this.games = {
            "угадай число": "guessNumber",
            "викторина": "quiz",
            "камень ножницы бумага": "rps",
            "слова": "words"
        };
        this.currentGame = null;
        this.gameState = {};
    }

    async onStart(context) {
        await context.reply({
            text: "🎮 Привет! Я игровой бот!\n\n" +
                  "Доступные игры:\n" +
                  "• \"угадай число\" - попробуй угадать число от 1 до 100\n" +
                  "• \"викторина\" - ответь на интересные вопросы\n" +
                  "• \"камень ножницы бумага\" - сыграй против бота\n" +
                  "• \"слова\" - составь слово из букв\n\n" +
                  "Напиши название игры, чтобы начать!"
        });
    }

    async onMessage(message, context) {
        const text = message.text.toLowerCase().trim();

        // Приветствие
        if (this.greetings.some(greet => text.includes(greet))) {
            await context.reply({
                text: `👋 Привет, ${context.userName}! Готов поиграть? Выбери игру из списка выше! 🎯`
            });
            return;
        }

        // Прощание
        if (this.farewells.some(farewell => text.includes(farewell))) {
            await context.reply({
                text: "👋 Пока! Возвращайся поиграть! 🎮"
            });
            return;
        }

        // Выход из игры
        if (text === "выход" || text === "стоп" || text === "закончить") {
            if (this.currentGame) {
                await this.endGame(context);
                return;
            }
        }

        // Если есть активная игра, обрабатываем ход
        if (this.currentGame) {
            await this.handleGameMove(text, context);
            return;
        }

        // Выбор игры
        for (const [gameName, gameId] of Object.entries(this.games)) {
            if (text.includes(gameName)) {
                await this.startGame(gameId, context);
                return;
            }
        }

        // Помощь
        if (text.includes("помощь") || text.includes("что ты умеешь")) {
            await this.showHelp(context);
            return;
        }

        // Как дела
        if (text.includes("как дела") || text.includes("как ты")) {
            await context.reply({
                text: "🎮 Отлично! Готов к игре! Выбери, во что хочешь поиграть!"
            });
            return;
        }

        // Ответ по умолчанию
        if (text) {
            const responses = [
                "Хочешь поиграть? Напиши название игры! 🎲",
                "Готов к игре! Выбери: угадай число, викторина, камень ножницы бумага или слова 🎯",
                "Давай поиграем! Напиши, в какую игру хочешь сыграть 🕹️",
                "Игры ждут! Выбирай одну из доступных игр 🎪"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            await context.reply({
                text: randomResponse
            });
        }
    }

    async startGame(gameId, context) {
        this.currentGame = gameId;
        
        switch(gameId) {
            case 'guessNumber':
                this.gameState = {
                    targetNumber: Math.floor(Math.random() * 100) + 1,
                    attempts: 0
                };
                await context.reply({
                    text: "🎯 Игра 'Угадай число'!\n\n" +
                          "Я загадал число от 1 до 100. Попробуй угадать!\n" +
                          "Напиши число от 1 до 100.\n\n" +
                          "Чтобы выйти из игры, напиши 'выход'"
                });
                break;
                
            case 'quiz':
                this.gameState = {
                    questions: [
                        {
                            question: "Столица Франции?",
                            answer: "париж"
                        },
                        {
                            question: "Сколько планет в Солнечной системе?",
                            answer: "8"
                        },
                        {
                            question: "Самая большая планета?",
                            answer: "юпитер"
                        }
                    ],
                    currentQuestion: 0,
                    score: 0
                };
                await this.askQuizQuestion(context);
                break;
                
            case 'rps':
                await context.reply({
                    text: "✂️ Игра 'Камень, ножницы, бумага'!\n\n" +
                          "Напиши: камень, ножницы или бумага\n\n" +
                          "Чтобы выйти из игры, напиши 'выход'"
                });
                break;
                
            case 'words':
                this.gameState = {
                    letters: this.generateRandomLetters(7),
                    usedWords: []
                };
                await context.reply({
                    text: "🔤 Игра 'Слова'!\n\n" +
                          `Составь слово из этих букв: ${this.gameState.letters.join(', ')}\n\n` +
                          "Напиши слово, которое можно составить из этих букв.\n" +
                          "Чтобы выйти из игры, напиши 'выход'"
                });
                break;
        }
    }

    async handleGameMove(text, context) {
        switch(this.currentGame) {
            case 'guessNumber':
                await this.handleGuessNumber(text, context);
                break;
                
            case 'quiz':
                await this.handleQuizAnswer(text, context);
                break;
                
            case 'rps':
                await this.handleRPS(text, context);
                break;
                
            case 'words':
                await this.handleWords(text, context);
                break;
        }
    }

    async handleGuessNumber(text, context) {
        if (isNaN(text)) {
            await context.reply({
                text: "Пожалуйста, введи число от 1 до 100"
            });
            return;
        }

        const guess = parseInt(text);
        this.gameState.attempts++;

        if (guess === this.gameState.targetNumber) {
            await context.reply({
                text: `🎉 Поздравляю! Ты угадал число ${this.gameState.targetNumber} за ${this.gameState.attempts} попыток!\n\nХочешь сыграть ещё? Напиши "угадай число"`
            });
            this.currentGame = null;
        } else if (guess < this.gameState.targetNumber) {
            await context.reply({
                text: "📈 Больше! Попробуй ещё раз"
            });
        } else {
            await context.reply({
                text: "📉 Меньше! Попробуй ещё раз"
            });
        }
    }

    async handleQuizAnswer(text, context) {
        const currentQ = this.gameState.questions[this.gameState.currentQuestion];
        
        if (text === currentQ.answer) {
            this.gameState.score++;
            await context.reply({
                text: "✅ Правильно! 🎉"
            });
        } else {
            await context.reply({
                text: `❌ Неправильно! Правильный ответ: ${currentQ.answer}`
            });
        }

        this.gameState.currentQuestion++;
        await this.askQuizQuestion(context);
    }

    async askQuizQuestion(context) {
        if (this.gameState.currentQuestion >= this.gameState.questions.length) {
            await context.reply({
                text: `🏁 Викторина окончена!\nТвой результат: ${this.gameState.score}/${this.gameState.questions.length}\n\nХочешь сыграть ещё? Напиши "викторина"`
            });
            this.currentGame = null;
            return;
        }

        const question = this.gameState.questions[this.gameState.currentQuestion];
        await context.reply({
            text: `❓ Вопрос ${this.gameState.currentQuestion + 1}/${this.gameState.questions.length}:\n${question.question}`
        });
    }

    async handleRPS(text, context) {
        const choices = ['камень', 'ножницы', 'бумага'];
        const userChoice = choices.find(choice => text.includes(choice));
        
        if (!userChoice) {
            await context.reply({
                text: "Пожалуйста, выбери: камень, ножницы или бумага"
            });
            return;
        }

        const botChoice = choices[Math.floor(Math.random() * 3)];
        let result;

        if (userChoice === botChoice) {
            result = "🤝 Ничья!";
        } else if (
            (userChoice === 'камень' && botChoice === 'ножницы') ||
            (userChoice === 'ножницы' && botChoice === 'бумага') ||
            (userChoice === 'бумага' && botChoice === 'камень')
        ) {
            result = "🎉 Ты выиграл!";
        } else {
            result = "🤖 Я выиграл!";
        }

        await context.reply({
            text: `Ты: ${this.emojiForChoice(userChoice)}\nЯ: ${this.emojiForChoice(botChoice)}\n\n${result}\n\nИграем ещё? Напиши свой выбор или "выход" чтобы закончить`
        });
    }

    emojiForChoice(choice) {
        const emojis = {
            'камень': '🪨',
            'ножницы': '✂️',
            'бумага': '📄'
        };
        return `${choice} ${emojis[choice]}`;
    }

    async handleWords(text, context) {
        if (this.gameState.usedWords.includes(text.toLowerCase())) {
            await context.reply({
                text: "❌ Это слово уже было! Попробуй другое"
            });
            return;
        }

        if (this.canFormWord(text, this.gameState.letters)) {
            this.gameState.usedWords.push(text.toLowerCase());
            await context.reply({
                text: `✅ Отлично! Слово "${text}" принято!\n\nТвои слова: ${this.gameState.usedWords.join(', ')}\n\nПродолжай или напиши "выход" чтобы закончить`
            });
        } else {
            await context.reply({
                text: "❌ Не могу составить это слово из данных букв. Попробуй другое слово"
            });
        }
    }

    canFormWord(word, availableLetters) {
        const wordLetters = word.toLowerCase().split('');
        const available = [...availableLetters];
        
        for (const letter of wordLetters) {
            const index = available.indexOf(letter);
            if (index === -1) return false;
            available.splice(index, 1);
        }
        return true;
    }

    generateRandomLetters(count) {
        const letters = 'авеикнопрстух'; // Часто используемые русские буквы
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(letters[Math.floor(Math.random() * letters.length)]);
        }
        return result;
    }

    async endGame(context) {
        await context.reply({
            text: `🎮 Игра "${this.currentGame}" завершена!\n\nВыбери другую игру или напиши "помощь" для списка игр`
        });
        this.currentGame = null;
        this.gameState = {};
    }

    async showHelp(context) {
        await context.reply({
            text: "🎮 **Игровой бот - Помощь**\n\n" +
                  "**Доступные игры:**\n" +
                  "• **угадай число** - угадай число от 1 до 100\n" +
                  "• **викторина** - ответь на вопросы\n" +
                  "• **камень ножницы бумага** - классическая игра\n" +
                  "• **слова** - составь слова из букв\n\n" +
                  "**Как играть:**\n" +
                  "Напиши название игры чтобы начать\n" +
                  "Во время игры напиши 'выход' чтобы закончить\n\n" +
                  "**Пример:** Напиши 'угадай число' чтобы начать игру!"
        });
    }
}
