class BurgerFunBot {
    constructor() {
        this.name = "БургерФанБот";
        this.greetings = ["привет", "hello", "здравствуй", "хай", "ку"];
        this.farewells = ["пока", "до свидания", "прощай", "bye"];
        
        this.burgerFacts = [
            "🍔 Первый гамбургер был создан в 1900 году в США",
            "🍔 Самый дорогой бургер в мире стоит $5000!",
            "🍔 В мире съедают более 50 миллиардов бургеров в год",
            "🍔 Бургер получил название в честь города Гамбург",
            "🍔 Самый большой бургер весил 914 кг!",
            "🍔 В Японии есть бургер с черным булочками из бамбукового угля",
            "🍔 Чизбургер был изобретен в 1924 году"
        ];
        
        this.burgerRecipes = {
            "классический": {
                name: "🍔 Классический бургер",
                ingredients: [
                    "Булочка с кунжутом - 1 шт",
                    "Говяжья котлета - 150г",
                    "Сыр Чеддер - 1 ломтик",
                    "Лист салата",
                    "Помидор - 2 кружка",
                    "Красный лук - 2 кружка",
                    "Кетчуп и майонез по вкусу"
                ],
                steps: [
                    "Обжарьте котлету до золотистой корочки",
                    "Подрумяньте булочку на гриле",
                    "Соберите бургер: булка + соус + салат + помидор + лук + котлета + сыр + булка",
                    "Подавайте сразу же!"
                ]
            },
            "чизбургер": {
                name: "🧀 Чизбургер",
                ingredients: [
                    "Булочка - 1 шт",
                    "Говяжья котлета - 120г",
                    "Сырный соус - 2 ст.л.",
                    "Маринованные огурчики - 3 шт",
                    "Горчица - 1 ч.л.",
                    "Кетчуп - 1 ч.л."
                ],
                steps: [
                    "Обжарьте котлету, в конце положите сыр",
                    "Подогрейте булочку",
                    "Намажьте соусы на обе половинки булки",
                    "Выложите котлету с сыром и огурчики",
                    "Накройте верхней половинкой булки"
                ]
            },
            "вегетарианский": {
                name: "🥬 Вегетарианский бургер",
                ingredients: [
                    "Булочка - 1 шт",
                    "Нутовая котлета - 1 шт",
                    "Авокадо - ½ шт",
                    "Шпинат - горсть",
                    "Помидор - 2 кружка",
                    "Соус песто - 1 ст.л."
                ],
                steps: [
                    "Обжарьте нутовую котлету",
                    "Разомните авокадо вилкой",
                    "Подрумяньте булочку",
                    "Соберите: булка + песто + шпинат + помидор + котлета + авокадо + булка"
                ]
            }
        };
        
        this.burgerGames = {
            "угадайка": {
                name: "🎯 Угадай ингредиент",
                description: "Попробуй угадать, что входит в бургер!",
                questions: [
                    {
                        question: "Какой сыр чаще всего используют в чизбургерах?",
                        options: ["Моцарелла", "Чеддер", "Пармезан", "Бри"],
                        answer: 1
                    },
                    {
                        question: "Из какого мяса делают классический бургер?",
                        options: ["Свинина", "Курица", "Говядина", "Баранина"],
                        answer: 2
                    },
                    {
                        question: "Что НЕ является традиционным соусом для бургера?",
                        options: ["Кетчуп", "Горчица", "Майонез", "Соевый соус"],
                        answer: 3
                    }
                ]
            },
            "собери": {
                name: "🧩 Собери идеальный бургер",
                description: "Собери бургер своей мечты!",
                ingredients: [
                    "Булочка с кунжутом", "Булочка бриошь", "Безглютеновая булка",
                    "Говяжья котлета", "Куриная котлета", "Вегетарианская котлета",
                    "Чеддер", "Моцарелла", "Голубой сыр",
                    "Бекон", "Яйцо", "Авокадо",
                    "Салат айсберг", "Руккола", "Шпинат",
                    "Помидор", "Огурец", "Лук",
                    "Кетчуп", "Майонез", "Горчица", "Соус барбекю"
                ]
            }
        };
        
        this.userScores = {};
        this.currentGames = {};
    }

    async onStart(context) {
        await context.reply({
            text: "🍔 Добро пожаловать в БургерМир! 🍔\n\n" +
                  "Я знаю всё о бургерах и могу:\n\n" +
                  "🎮 Играть в бургер-игры\n" +
                  "📖 Показать рецепты\n" +
                  "📚 Рассказать факты\n" +
                  "🍴 Дать советы по приготовлению\n\n" +
                  "Выбери, чем хочешь заняться!",
            buttons: this.getMainMenuButtons()
        });
    }

    async onMessage(message, context) {
        const text = message.text.toLowerCase().trim();
        const userId = context.userId;

        // Приветствие
        if (this.greetings.some(greet => text.includes(greet))) {
            await context.reply({
                text: `👋 Привет, ${context.userName}! Готов погрузиться в мир бургеров? 🍔`,
                buttons: this.getMainMenuButtons()
            });
            return;
        }

        // Прощание
        if (this.farewells.some(farewell => text.includes(farewell))) {
            await context.reply({
                text: "👋 Пока! Возвращайся за новыми бургер-приключениями! 🍔"
            });
            return;
        }

        // Обработка кнопок
        if (context.buttonPayload) {
            await this.handleButton(context.buttonPayload, context);
            return;
        }

        // Текстовые команды
        if (text.includes("факт") || text.includes("интересно")) {
            await this.showRandomFact(context);
            return;
        }

        if (text.includes("рецепт") || text.includes("готовить")) {
            await this.showRecipesMenu(context);
            return;
        }

        if (text.includes("игра") || text.includes("игр")) {
            await this.showGamesMenu(context);
            return;
        }

        if (text.includes("совет") || text.includes("советы")) {
            await this.showCookingTips(context);
            return;
        }

        if (text.includes("счет") || text.includes("очки")) {
            await this.showScore(context);
            return;
        }

        // Ответ по умолчанию
        await context.reply({
            text: "🍔 Хочешь узнать больше о бургерах? Выбери действие!",
            buttons: this.getMainMenuButtons()
        });
    }

    getMainMenuButtons() {
        return [
            [
                { type: "text", label: "🎮 Игры", payload: "games" },
                { type: "text", label: "📖 Рецепты", payload: "recipes" }
            ],
            [
                { type: "text", label: "📚 Факты", payload: "facts" },
                { type: "text", label: "🍴 Советы", payload: "tips" }
            ],
            [
                { type: "text", label: "🏆 Мой счет", payload: "score" },
                { type: "text", label: "❓ Помощь", payload: "help" }
            ]
        ];
    }

    async handleButton(payload, context) {
        const userId = context.userId;

        switch(payload) {
            case 'games':
                await this.showGamesMenu(context);
                break;

            case 'recipes':
                await this.showRecipesMenu(context);
                break;

            case 'facts':
                await this.showRandomFact(context);
                break;

            case 'tips':
                await this.showCookingTips(context);
                break;

            case 'score':
                await this.showScore(context);
                break;

            case 'help':
                await this.showHelp(context);
                break;

            case 'game_guess':
                await this.startGuessGame(context);
                break;

            case 'game_build':
                await this.startBuildGame(context);
                break;

            case 'recipe_classic':
                await this.showRecipe('классический', context);
                break;

            case 'recipe_cheese':
                await this.showRecipe('чизбургер', context);
                break;

            case 'recipe_vegan':
                await this.showRecipe('вегетарианский', context);
                break;

            case 'back_to_menu':
                await this.showMainMenu(context);
                break;

            default:
                // Обработка ответов в игре
                if (payload.startsWith('guess_')) {
                    await this.handleGuessAnswer(payload, context);
                }
                break;
        }
    }

    async showMainMenu(context) {
        await context.reply({
            text: "🍔 Главное меню БургерМира! 🍔\n\n" +
                  "Выбери, чем хочешь заняться:",
            buttons: this.getMainMenuButtons()
        });
    }

    async showGamesMenu(context) {
        await context.reply({
            text: "🎮 **Бургер-Игры** 🎮\n\n" +
                  "Выбери игру:\n\n" +
                  "🎯 **Угадай ингредиент** - проверь свои знания о бургерах\n" +
                  "🧩 **Собери бургер** - создай идеальную комбинацию",
            buttons: [
                [
                    { type: "text", label: "🎯 Угадай ингредиент", payload: "game_guess" },
                    { type: "text", label: "🧩 Собери бургер", payload: "game_build" }
                ],
                [
                    { type: "text", label: "⬅️ Назад", payload: "back_to_menu" }
                ]
            ]
        });
    }

    async showRecipesMenu(context) {
        await context.reply({
            text: "📖 **Рецепты бургеров** 📖\n\n" +
                  "Выбери рецепт:\n\n" +
                  "🍔 **Классический** - традиционный вкус\n" +
                  "🧀 **Чизбургер** - с сырной ноткой\n" +
                  "🥬 **Вегетарианский** - для любителей зелени",
            buttons: [
                [
                    { type: "text", label: "🍔 Классический", payload: "recipe_classic" },
                    { type: "text", label: "🧀 Чизбургер", payload: "recipe_cheese" }
                ],
                [
                    { type: "text", label: "🥬 Вегетарианский", payload: "recipe_vegan" },
                    { type: "text", label: "⬅️ Назад", payload: "back_to_menu" }
                ]
            ]
        });
    }

    async showRandomFact(context) {
        const randomFact = this.burgerFacts[Math.floor(Math.random() * this.burgerFacts.length)];
        
        await context.reply({
            text: `📚 **Бургер-Факт** 📚\n\n${randomFact}`,
            buttons: [
                [
                    { type: "text", label: "📚 Еще факт", payload: "facts" },
                    { type: "text", label: "⬅️ Назад", payload: "back_to_menu" }
                ]
            ]
        });
    }

    async showRecipe(recipeKey, context) {
        const recipe = this.burgerRecipes[recipeKey];
        
        let text = `📖 **${recipe.name}** 📖\n\n`;
        text += "**Ингредиенты:**\n";
        recipe.ingredients.forEach(ingredient => {
            text += `• ${ingredient}\n`;
        });
        
        text += "\n**Приготовление:**\n";
        recipe.steps.forEach((step, index) => {
            text += `${index + 1}. ${step}\n`;
        });
        
        await context.reply({
            text: text,
            buttons: [
                [
                    { type: "text", label: "📖 Другие рецепты", payload: "recipes" },
                    { type: "text", label: "⬅️ Назад", payload: "back_to_menu" }
                ]
            ]
        });
    }

    async startGuessGame(context) {
        const userId = context.userId;
        this.currentGames[userId] = {
            type: 'guess',
            currentQuestion: 0,
            score: 0,
            totalQuestions: this.burgerGames.угадайка.questions.length
        };

        await this.askNextGuessQuestion(context);
    }

    async askNextGuessQuestion(context) {
        const userId = context.userId;
        const game = this.currentGames[userId];
        
        if (game.currentQuestion >= game.totalQuestions) {
            await this.finishGuessGame(context);
            return;
        }

        const question = this.burgerGames.угадайка.questions[game.currentQuestion];
        
        let text = `🎯 Вопрос ${game.currentQuestion + 1}/${game.totalQuestions}\n\n`;
        text += `**${question.question}**\n\n`;
        
        question.options.forEach((option, index) => {
            text += `${index + 1}. ${option}\n`;
        });

        const buttons = [
            [
                { type: "text", label: "1", payload: `guess_0` },
                { type: "text", label: "2", payload: `guess_1` },
                { type: "text", label: "3", payload: `guess_2` },
                { type: "text", label: "4", payload: `guess_3` }
            ],
            [
                { type: "text", label: "🏃 Выйти из игры", payload: "games" }
            ]
        ];

        await context.reply({
            text: text,
            buttons: buttons
        });
    }

    async handleGuessAnswer(payload, context) {
        const userId = context.userId;
        const game = this.currentGames[userId];
        
        if (!game || game.type !== 'guess') {
            await this.showGamesMenu(context);
            return;
        }

        const selectedAnswer = parseInt(payload.split('_')[1]);
        const currentQuestion = this.burgerGames.угадайка.questions[game.currentQuestion];
        
        if (selectedAnswer === currentQuestion.answer) {
            game.score++;
            await context.reply({
                text: "✅ Правильно! 🎉\nТы отлично разбираешься в бургерах!"
            });
        } else {
            const correctAnswer = currentQuestion.options[currentQuestion.answer];
            await context.reply({
                text: `❌ Неправильно! Правильный ответ: ${correctAnswer}`
            });
        }

        game.currentQuestion++;
        setTimeout(() => this.askNextGuessQuestion(context), 1500);
    }

    async finishGuessGame(context) {
        const userId = context.userId;
        const game = this.currentGames[userId];
        
        // Сохраняем счет пользователя
        if (!this.userScores[userId]) {
            this.userScores[userId] = 0;
        }
        this.userScores[userId] += game.score;

        let resultText = "🎮 **Игра завершена!** 🎮\n\n";
        resultText += `🏆 Твой результат: ${game.score}/${game.totalQuestions}\n\n`;
        
        if (game.score === game.totalQuestions) {
            resultText += "🔥 Идеально! Ты настоящий бургер-эксперт! 🍔";
        } else if (game.score >= game.totalQuestions * 0.7) {
            resultText += "👍 Отлично! Ты хорошо знаешь бургеры!";
        } else if (game.score >= game.totalQuestions * 0.5) {
            resultText += "😊 Неплохо! Продолжай изучать мир бургеров!";
        } else {
            resultText += "📚 Есть куда расти! Учи рецепты и возвращайся!";
        }

        delete this.currentGames[userId];

        await context.reply({
            text: resultText,
            buttons: [
                [
                    { type: "text", label: "🎮 Играть еще", payload: "game_guess" },
                    { type: "text", label: "📊 Мой счет", payload: "score" }
                ],
                [
                    { type: "text", label: "⬅️ В меню", payload: "back_to_menu" }
                ]
            ]
        });
    }

    async startBuildGame(context) {
        await context.reply({
            text: "🧩 **Собери идеальный бургер** 🧩\n\n" +
                  "Выбери ингредиенты для своего бургера:\n\n" +
                  "**Доступные ингредиенты:**\n" +
                  "• 3 вида булок\n" +
                  "• 3 вида котлет\n" +
                  "• 3 вида сыров\n" +
                  "• 3 вида дополнений\n" +
                  "• 3 вида зелени\n" +
                  "• 3 вида овощей\n" +
                  "• 4 вида соусов\n\n" +
                  "Собирай свою уникальную комбинацию!",
            buttons: [
                [
                    { type: "text", label: "🍞 Выбрать булку", payload: "build_bun" },
                    { type: "text", label: "🥩 Выбрать котлету", payload: "build_patty" }
                ],
                [
                    { type: "text", label: "⬅️ Назад к играм", payload: "games" }
                ]
            ]
        });
    }

    async showCookingTips(context) {
        const tips = [
            "🔥 **Всегда подрумянивайте булочку** - это добавит хруста и аромата",
            "🥩 **Не давите на котлету** при жарке - так она останется сочной",
            "🧀 **Кладете сыр?** Накройте сковороду крышкой на 30 секунд",
            "🍅 **Овощи режьте перед сборкой** - так они будут свежее",
            "🌡️ **Мясо комнатной температуры** жарится равномернее",
            "⏱️ **Дайте котлете отдохнуть** 2-3 минуты после жарки",
            "🥬 **Салат кладите между соусом и котлетой** - так он не размокнет"
        ];

        const randomTips = tips.sort(() => Math.random() - 0.5).slice(0, 3);

        let text = "🍴 **Советы по приготовлению** 🍴\n\n";
        randomTips.forEach(tip => {
            text += `${tip}\n\n`;
        });

        await context.reply({
            text: text,
            buttons: [
                [
                    { type: "text", label: "🍴 Еще советы", payload: "tips" },
                    { type: "text", label: "⬅️ Назад", payload: "back_to_menu" }
                ]
            ]
        });
    }

    async showScore(context) {
        const userId = context.userId;
        const score = this.userScores[userId] || 0;

        let level = "Новичок";
        if (score >= 20) level = "Бургер-Мастер 🏆";
        else if (score >= 15) level = "Шеф-повар 👨‍🍳";
        else if (score >= 10) level = "Любитель бургеров 🍔";
        else if (score >= 5) level = "Начинающий гурман";

        await context.reply({
            text: `🏆 **Твой бургер-счет** 🏆\n\n` +
                  `📊 Очков: ${score}\n` +
                  `🎯 Уровень: ${level}\n\n` +
                  `Зарабатывай очки в играх и становись бургер-экспертом!`,
            buttons: [
                [
                    { type: "text", label: "🎮 Заработать очки", payload: "games" },
                    { type: "text", label: "⬅️ Назад", payload: "back_to_menu" }
                ]
            ]
        });
    }

    async showHelp(context) {
        await context.reply({
            text: "🍔 **Помощь по БургерБоту** 🍔\n\n" +
                  "**Что я умею:**\n" +
                  "🎮 **Игры** - угадай ингредиенты, собери бургер\n" +
                  "📖 **Рецепты** - классические и необычные бургеры\n" +
                  "📚 **Факты** - интересное о бургерах\n" +
                  "🍴 **Советы** - как готовить идеальные бургеры\n\n" +
                  "**Команды:**\n" +
                  "• \"игры\" - показать все игры\n" +
                  "• \"рецепты\" - выбрать рецепт\n" +
                  "• \"факт\" - случайный факт\n" +
                  "• \"советы\" - советы по готовке\n" +
                  "• \"счет\" - твой прогресс\n\n" +
                  "Используй кнопки для навигации!",
            buttons: [
                [
                    { type: "text", label: "🎮 Начать играть", payload: "games" },
                    { type: "text", label: "📖 Изучить рецепты", payload: "recipes" }
                ]
            ]
        });
    }
}

// Экспорт бота
if (typeof module !== 'undefined') {
    module.exports = BurgerFunBot;
}
