class GameBot {
    constructor() {
        this.name = "ИгровойБот";
        this.games = new Map();
    }

    async onStart(context) {
        await context.reply({
            text: "🎮 **Добро пожаловать в игровую зону!**\\\\nВыберите игру:",
            buttons: [
                [
                    { type: "text", label: "🎲 Угадай число", payload: "guess_number" },
                    { type: "text", label: "❓ Викторина", payload: "quiz" }
                ],
                [
                    { type: "text", label: "🎯 Камень-ножницы-бумага", payload: "rps" },
                    { type: "text", label: "🏆 Статистика", payload: "stats" }
                ]
            ]
        });
    }

    async onMessage(message, context) {
        const text = message.text.toLowerCase();

        if (text.includes('start') || text.includes('игры') || text.includes('игра')) {
            await this.onStart(context);
            return;
        }

        // Обработка нажатий кнопок
        if (context.buttonPayload) {
            await this.handleButton(context.buttonPayload, context);
        }

        // Обработка игровых команд
        const userGame = this.games.get(context.userId);
        if (userGame && userGame.type === 'guess_number') {
            await this.handleGuessNumber(text, context);
        }
    }

    async handleButton(payload, context) {
        switch(payload) {
            case 'guess_number':
                await this.startGuessNumber(context);
                break;
            case 'quiz':
                await this.startQuiz(context);
                break;
            case 'rps':
                await this.startRockPaperScissors(context);
                break;
            case 'stats':
                await this.showStats(context);
                break;
            case 'play_again':
                await this.onStart(context);
                break;
        }
    }

    async startGuessNumber(context) {
        const secretNumber = Math.floor(Math.random() * 100) + 1;
        this.games.set(context.userId, {
            type: 'guess_number',
            secretNumber: secretNumber,
            attempts: 0
        });

        await context.reply({
            text: "🎲 **Угадай число!**\\\\n\\\\nЯ загадал число от 1 до 100. Попробуй угадать! Просто напиши число.",
            buttons: [
                [
                    { type: "text", label: "⬅️ Другие игры", payload: "main_menu" }
                ]
            ]
        });
    }

    async handleGuessNumber(text, context) {
        const userGame = this.games.get(context.userId);
        if (!userGame || userGame.type !== 'guess_number') return;

        const guess = parseInt(text);
        if (isNaN(guess)) {
            await context.reply({
                text: "Пожалуйста, введите число от 1 до 100."
            });
            return;
        }

        userGame.attempts++;

        if (guess === userGame.secretNumber) {
            await context.reply({
                text: \`🎉 **Поздравляю! Ты угадал!**\\\\n\\\\nЗагаданное число: \${userGame.secretNumber}\\\\nКоличество попыток: \${userGame.attempts}\\\\n\\\\nОтличный результат! 🏆\`,
                buttons: [
                    [
                        { type: "text", label: "🔄 Играть снова", payload: "guess_number" },
                        { type: "text", label: "⬅️ Другие игры", payload: "main_menu" }
                    ]
                ]
            });
            this.games.delete(context.userId);
        } else if (guess < userGame.secretNumber) {
            await context.reply({
                text: "📈 Загаданное число БОЛЬШЕ твоего. Попробуй еще раз!"
            });
        } else {
            await context.reply({
                text: "📉 Загаданное число МЕНЬШЕ твоего. Попробуй еще раз!"
            });
        }
    }

    async startQuiz(context) {
        const questions = [
            {
                question: "Столица Франции?",
                options: ["Лондон", "Берлин", "Париж", "Мадрид"],
                correct: 2
            },
            {
                question: "Сколько планет в Солнечной системе?",
                options: ["7", "8", "9", "10"],
                correct: 1
            },
            {
                question: "Самое большое млекопитающее?",
                options: ["Слон", "Синий кит", "Жираф", "Бегемот"],
                correct: 1
            }
        ];

        const currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        this.games.set(context.userId, {
            type: 'quiz',
            currentQuestion: currentQuestion
        });

        await context.reply({
            text: \`❓ **Викторина!**\\\\n\\\\n\${currentQuestion.question}\\\\n\\\\n\${currentQuestion.options.map((opt, idx) => \`\${idx + 1}. \${opt}\`).join('\\\\n')}\`,
            buttons: currentQuestion.options.map((opt, idx) => [
                { 
                    type: "text", 
                    label: \`\${idx + 1}\`, 
                    payload: \`quiz_answer_\${idx}\` 
                }
            ]).concat([
                [
                    { type: "text", label: "⬅️ Другие игры", payload: "main_menu" }
                ]
            ])
        });
    }

    async startRockPaperScissors(context) {
        await context.reply({
            text: "🎯 **Камень-ножницы-бумага!**\\\\n\\\\nВыбери свой ход:",
            buttons: [
                [
                    { type: "text", label: "✊ Камень", payload: "rps_rock" },
                    { type: "text", label: "✌️ Ножницы", payload: "rps_scissors" },
                    { type: "text", label: "✋ Бумага", payload: "rps_paper" }
                ],
                [
                    { type: "text", label: "⬅️ Другие игры", payload: "main_menu" }
                ]
            ]
        });
    }

    async showStats(context) {
        await context.reply({
            text: "🏆 **Статистика игр**\\\\n\\\\nЗдесь будет отображаться ваша статистика по играм. Функция в разработке! 🚧",
            buttons: [
                [
                    { type: "text", label: "🎮 К играм", payload: "main_menu" }
                ]
            ]
        });
    }
}
