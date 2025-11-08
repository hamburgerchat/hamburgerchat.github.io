class RPGBot {
    constructor() {
        this.name = "РПГБот";
        this.players = {};
        this.monsters = {
            "Слайм": { level: 1, hp: 30, attack: 5, defense: 2, exp: 10, gold: 5 },
            "Гоблин": { level: 2, hp: 45, attack: 8, defense: 3, exp: 20, gold: 10 },
            "Скелет": { level: 3, hp: 60, attack: 12, defense: 5, exp: 35, gold: 15 },
            "Орк": { level: 5, hp: 100, attack: 18, defense: 8, exp: 60, gold: 25 },
            "Дракон": { level: 10, hp: 200, attack: 30, defense: 15, exp: 150, gold: 100 }
        };
    }

    async onStart(context) {
        const userId = context.userId;
        
        if (!this.players[userId]) {
            this.players[userId] = this.createNewPlayer();
        }

        await this.showMainMenu(context);
    }

    createNewPlayer() {
        return {
            name: "Герой",
            level: 1,
            exp: 0,
            maxExp: 100,
            hp: 100,
            maxHp: 100,
            attack: 10,
            defense: 5,
            gold: 50,
            potions: 3,
            weapon: "Деревянный меч",
            armor: "Кожаная броня",
            inBattle: false,
            currentMonster: null
        };
    }

    async showMainMenu(context) {
        const player = this.players[context.userId];
        
        await context.reply({
            text: `🏰 **Добро пожаловать в РПГ приключение!**\n\n` +
                  `👤 ${player.name} Ур.${player.level}\n` +
                  `❤️ HP: ${player.hp}/${player.maxHp}\n` +
                  `⚔️ Атака: ${player.attack} 🛡️ Защита: ${player.defense}\n` +
                  `💰 Золото: ${player.gold} ⚗️ Зелья: ${player.potions}\n` +
                  `📊 Опыт: ${player.exp}/${player.maxExp}\n` +
                  `🎒 Оружие: ${player.weapon}\n` +
                  `👕 Броня: ${player.armor}`,
            buttons: [
                [
                    { type: "text", label: "⚔️ Отправиться в бой", payload: "battle" },
                    { type: "text", label: "🏥 Лечиться", payload: "heal" }
                ],
                [
                    { type: "text", label: "🛒 Магазин", payload: "shop" },
                    { type: "text", label: "📊 Статистика", payload: "stats" }
                ],
                [
                    { type: "text", label: "🎒 Инвентарь", payload: "inventory" },
                    { type: "text", label: "🔄 Прокачка", payload: "upgrade" }
                ]
            ]
        });
    }

    async onMessage(message, context) {
        const text = message.text.toLowerCase().trim();
        const userId = context.userId;

        if (!this.players[userId]) {
            this.players[userId] = this.createNewPlayer();
        }

        // Обработка кнопок
        if (context.buttonPayload) {
            await this.handleButton(context.buttonPayload, context);
            return;
        }

        // Текстовые команды
        if (text.includes("помощь") || text.includes("команды")) {
            await this.showHelp(context);
            return;
        }

        if (text.includes("сброс") || text.includes("новый персонаж")) {
            this.players[userId] = this.createNewPlayer();
            await context.reply({
                text: "🔄 Персонаж сброшен! Начинаем новое приключение!",
                buttons: [
                    [
                        { type: "text", label: "🎮 Главное меню", payload: "main" }
                    ]
                ]
            });
            return;
        }

        await this.showMainMenu(context);
    }

    async handleButton(payload, context) {
        const userId = context.userId;
        const player = this.players[userId];

        switch(payload) {
            case 'main':
                await this.showMainMenu(context);
                break;

            case 'battle':
                await this.startBattle(context);
                break;

            case 'heal':
                await this.healPlayer(context);
                break;

            case 'shop':
                await this.showShop(context);
                break;

            case 'stats':
                await this.showStats(context);
                break;

            case 'inventory':
                await this.showInventory(context);
                break;

            case 'upgrade':
                await this.showUpgradeMenu(context);
                break;

            case 'battle_attack':
                await this.battleAttack(context);
                break;

            case 'battle_potion':
                await this.usePotionInBattle(context);
                break;

            case 'battle_flee':
                await this.fleeBattle(context);
                break;

            case 'buy_potion':
                await this.buyPotion(context);
                break;

            case 'buy_sword':
                await this.buyWeapon("Стальной меч", 50, 5, context);
                break;

            case 'buy_armor':
                await this.buyArmor("Кольчуга", 40, 4, context);
                break;

            case 'upgrade_attack':
                await this.upgradeStat('attack', 20, context);
                break;

            case 'upgrade_defense':
                await this.upgradeStat('defense', 20, context);
                break;

            case 'upgrade_hp':
                await this.upgradeStat('maxHp', 15, context);
                break;
        }
    }

    async startBattle(context) {
        const userId = context.userId;
        const player = this.players[userId];

        if (player.inBattle) {
            await this.showBattle(context);
            return;
        }

        // Выбор монстра в зависимости от уровня игрока
        const availableMonsters = Object.entries(this.monsters)
            .filter(([name, stats]) => stats.level <= player.level + 2)
            .sort((a, b) => b[1].level - a[1].level);

        const randomMonster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
        const [monsterName, monsterStats] = randomMonster;

        player.inBattle = true;
        player.currentMonster = {
            name: monsterName,
            ...monsterStats,
            currentHp: monsterStats.hp
        };

        await context.reply({
            text: `⚔️ **ВСТРЕЧА С МОНСТРОМ!**\n\n` +
                  `🐲 ${monsterName} Ур.${monsterStats.level}\n` +
                  `❤️ HP: ${monsterStats.hp}\n` +
                  `⚔️ Атака: ${monsterStats.attack} 🛡️ Защита: ${monsterStats.defense}\n\n` +
                  `Ты встречаешь ${monsterName}! Что будешь делать?`,
            buttons: [
                [
                    { type: "text", label: "🗡️ Атаковать", payload: "battle_attack" },
                    { type: "text", label: "⚗️ Выпить зелье", payload: "battle_potion" }
                ],
                [
                    { type: "text", label: "🏃 Сбежать", payload: "battle_flee" }
                ]
            ]
        });
    }

    async battleAttack(context) {
        const userId = context.userId;
        const player = this.players[userId];
        const monster = player.currentMonster;

        if (!player.inBattle) {
            await this.showMainMenu(context);
            return;
        }

        // Атака игрока
        const playerDamage = Math.max(1, player.attack - monster.defense + Math.floor(Math.random() * 5));
        monster.currentHp -= playerDamage;

        let battleText = `🗡️ Ты атаковал ${monster.name} и нанес ${playerDamage} урона!\n`;

        if (monster.currentHp <= 0) {
            battleText += `🎉 Ты победил ${monster.name}!\n\n`;
            await this.winBattle(context);
            return;
        }

        // Атака монстра
        const monsterDamage = Math.max(1, monster.attack - player.defense + Math.floor(Math.random() * 3));
        player.hp -= monsterDamage;
        battleText += `🐲 ${monster.name} контратаковал и нанес ${monsterDamage} урона!\n\n`;

        if (player.hp <= 0) {
            await this.loseBattle(context);
            return;
        }

        battleText += `❤️ Твое HP: ${player.hp}/${player.maxHp}\n` +
                     `🐲 HP ${monster.name}: ${monster.currentHp}/${monster.hp}`;

        await context.reply({
            text: battleText,
            buttons: [
                [
                    { type: "text", label: "🗡️ Атаковать", payload: "battle_attack" },
                    { type: "text", label: "⚗️ Выпить зелье", payload: "battle_potion" }
                ],
                [
                    { type: "text", label: "🏃 Сбежать", payload: "battle_flee" }
                ]
            ]
        });
    }

    async winBattle(context) {
        const userId = context.userId;
        const player = this.players[userId];
        const monster = player.currentMonster;

        const goldReward = monster.gold + Math.floor(Math.random() * 10);
        const expReward = monster.exp;

        player.gold += goldReward;
        player.exp += expReward;

        let levelUpText = "";
        if (player.exp >= player.maxExp) {
            await this.levelUp(player);
            levelUpText = `🎊 **ПОВЫШЕНИЕ УРОВНЯ!** Теперь ты Ур.${player.level}!\n`;
        }

        player.inBattle = false;
        player.currentMonster = null;

        await context.reply({
            text: `${levelUpText}` +
                  `💰 Получено: ${goldReward} золота\n` +
                  `⭐ Опыт: +${expReward}\n\n` +
                  `Поздравляю с победой!`,
            buttons: [
                [
                    { type: "text", label: "⚔️ Сражаться еще", payload: "battle" },
                    { type: "text", label: "🎮 Главное меню", payload: "main" }
                ]
            ]
        });
    }

    async loseBattle(context) {
        const userId = context.userId;
        const player = this.players[userId];

        // Штраф за смерть
        player.gold = Math.max(0, player.gold - 10);
        player.hp = player.maxHp; // Воскрешение с полным HP
        player.inBattle = false;
        player.currentMonster = null;

        await context.reply({
            text: `💀 Ты пал в бою... Но магия воскресила тебя!\n` +
                  `💰 Потеряно 10 золота\n\n` +
                  `Не сдавайся! Стань сильнее и попробуй снова!`,
            buttons: [
                [
                    { type: "text", label: "⚔️ Попробовать снова", payload: "battle" },
                    { type: "text", label: "🎮 Главное меню", payload: "main" }
                ]
            ]
        });
    }

    async usePotionInBattle(context) {
        const userId = context.userId;
        const player = this.players[userId];

        if (player.potions > 0) {
            const healAmount = 30;
            player.hp = Math.min(player.maxHp, player.hp + healAmount);
            player.potions--;

            await context.reply({
                text: `⚗️ Ты выпил зелье лечения!\n` +
                      `❤️ Восстановлено ${healAmount} HP\n` +
                      `❤️ Теперь у тебя ${player.hp}/${player.maxHp} HP\n` +
                      `⚗️ Осталось зелий: ${player.potions}\n\n` +
                      `Теперь ход монстра...`,
                buttons: [
                    [
                        { type: "text", label: "🗡️ Продолжить бой", payload: "battle_attack" }
                    ]
                ]
            });
        } else {
            await context.reply({
                text: "❌ У тебя нет зелий лечения!",
                buttons: [
                    [
                        { type: "text", label: "🗡️ Атаковать", payload: "battle_attack" },
                        { type: "text", label: "🏃 Сбежать", payload: "battle_flee" }
                    ]
                ]
            });
        }
    }

    async fleeBattle(context) {
        const userId = context.userId;
        const player = this.players[userId];

        const fleeChance = Math.random();
        if (fleeChance > 0.3) { // 70% шанс успешного побега
            player.inBattle = false;
            player.currentMonster = null;

            await context.reply({
                text: "🏃 Ты успешно сбежал из боя!",
                buttons: [
                    [
                        { type: "text", label: "⚔️ Новый бой", payload: "battle" },
                        { type: "text", label: "🎮 Главное меню", payload: "main" }
                    ]
                ]
            });
        } else {
            // Неудачный побег - монстр атакует
            const monster = player.currentMonster;
            const monsterDamage = Math.max(1, monster.attack - player.defense);
            player.hp -= monsterDamage;

            await context.reply({
                text: `❌ Не удалось сбежать!\n` +
                      `🐲 ${monster.name} атаковал и нанес ${monsterDamage} урона!\n` +
                      `❤️ Твое HP: ${player.hp}/${player.maxHp}`,
                buttons: [
                    [
                        { type: "text", label: "🗡️ Атаковать", payload: "battle_attack" },
                        { type: "text", label: "⚗️ Выпить зелье", payload: "battle_potion" }
                    ],
                    [
                        { type: "text", label: "🏃 Попробовать сбежать", payload: "battle_flee" }
                    ]
                ]
            });
        }
    }

    async healPlayer(context) {
        const userId = context.userId;
        const player = this.players[userId];

        if (player.hp >= player.maxHp) {
            await context.reply({
                text: "❤️ У тебя и так полное здоровье!",
                buttons: [
                    [
                        { type: "text", label: "🎮 Главное меню", payload: "main" }
                    ]
                ]
            });
            return;
        }

        const healCost = 10;
        if (player.gold >= healCost) {
            player.hp = player.maxHp;
            player.gold -= healCost;

            await context.reply({
                text: `🏥 Ты полностью исцелен!\n` +
                      `💰 Потрачено: ${healCost} золота\n` +
                      `❤️ HP: ${player.hp}/${player.maxHp}`,
                buttons: [
                    [
                        { type: "text", label: "🎮 Главное меню", payload: "main" }
                    ]
                ]
            });
        } else {
            await context.reply({
                text: `❌ Недостаточно золота для лечения!\n` +
                      `Нужно: ${healCost} золота, у тебя: ${player.gold}`,
                buttons: [
                    [
                        { type: "text", label: "⚔️ Заработать в бою", payload: "battle" },
                        { type: "text", label: "🎮 Главное меню", payload: "main" }
                    ]
                ]
            });
        }
    }

    async showShop(context) {
        const userId = context.userId;
        const player = this.players[userId];

        await context.reply({
            text: `🛒 **МАГАЗИН**\n\n` +
                  `💰 Твое золото: ${player.gold}\n\n` +
                  `**Товары:**\n` +
                  `⚗️ Зелье лечения - 15 золота\n` +
                  `🗡️ Стальной меч (+5 атаки) - 50 золота\n` +
                  `👕 Кольчуга (+4 защиты) - 40 золота`,
            buttons: [
                [
                    { type: "text", label: "⚗️ Купить зелье", payload: "buy_potion" },
                    { type: "text", label: "🗡️ Купить меч", payload: "buy_sword" }
                ],
                [
                    { type: "text", label: "👕 Купить броню", payload: "buy_armor" },
                    { type: "text", label: "🎮 Главное меню", payload: "main" }
                ]
            ]
        });
    }

    async buyPotion(context) {
        const userId = context.userId;
        const player = this.players[userId];

        const cost = 15;
        if (player.gold >= cost) {
            player.potions++;
            player.gold -= cost;

            await context.reply({
                text: `⚗️ Ты купил зелье лечения!\n` +
                      `💰 Потрачено: ${cost} золота\n` +
                      `⚗️ Теперь у тебя ${player.potions} зелий`,
                buttons: [
                    [
                        { type: "text", label: "🛒 Еще покупки", payload: "shop" },
                        { type: "text", label: "🎮 Главное меню", payload: "main" }
                    ]
                ]
            });
        } else {
            await context.reply({
                text: `❌ Недостаточно золота!\n` +
                      `Нужно: ${cost} золота, у тебя: ${player.gold}`,
                buttons: [
                    [
                        { type: "text", label: "⚔️ Заработать в бою", payload: "battle" },
                        { type: "text", label: "🛒 Назад в магазин", payload: "shop" }
                    ]
                ]
            });
        }
    }

    async buyWeapon(weaponName, cost, attackBonus, context) {
        const userId = context.userId;
        const player = this.players[userId];

        if (player.gold >= cost) {
            player.weapon = weaponName;
            player.attack += attackBonus;
            player.gold -= cost;

            await context.reply({
                text: `🗡️ Ты купил ${weaponName}!\n` +
                      `⚔️ Атака увеличена на +${attackBonus}\n` +
                      `💰 Потрачено: ${cost} золота\n` +
                      `⚔️ Теперь твоя атака: ${player.attack}`,
                buttons: [
                    [
                        { type: "text", label: "🛒 Еще покупки", payload: "shop" },
                        { type: "text", label: "🎮 Главное меню", payload: "main" }
                    ]
                ]
            });
        } else {
            await context.reply({
                text: `❌ Недостаточно золота!\n` +
                      `Нужно: ${cost} золота, у тебя: ${player.gold}`,
                buttons: [
                    [
                        { type: "text", label: "⚔️ Заработать в бою", payload: "battle" },
                        { type: "text", label: "🛒 Назад в магазин", payload: "shop" }
                    ]
                ]
            });
        }
    }

    async buyArmor(armorName, cost, defenseBonus, context) {
        const userId = context.userId;
        const player = this.players[userId];

        if (player.gold >= cost) {
            player.armor = armorName;
            player.defense += defenseBonus;
            player.gold -= cost;

            await context.reply({
                text: `👕 Ты купил ${armorName}!\n` +
                      `🛡️ Защита увеличена на +${defenseBonus}\n` +
                      `💰 Потрачено: ${cost} золота\n` +
                      `🛡️ Теперь твоя защита: ${player.defense}`,
                buttons: [
                    [
                        { type: "text", label: "🛒 Еще покупки", payload: "shop" },
                        { type: "text", label: "🎮 Главное меню", payload: "main" }
                    ]
                ]
            });
        } else {
            await context.reply({
                text: `❌ Недостаточно золота!\n` +
                      `Нужно: ${cost} золота, у тебя: ${player.gold}`,
                buttons: [
                    [
                        { type: "text", label: "⚔️ Заработать в бою", payload: "battle" },
                        { type: "text", label: "🛒 Назад в магазин", payload: "shop" }
                    ]
                ]
            });
        }
    }

    async showStats(context) {
        const userId = context.userId;
        const player = this.players[userId];

        await context.reply({
            text: `📊 **СТАТИСТИКА**\n\n` +
                  `👤 Имя: ${player.name}\n` +
                  `⭐ Уровень: ${player.level}\n` +
                  `❤️ HP: ${player.hp}/${player.maxHp}\n` +
                  `⚔️ Атака: ${player.attack}\n` +
                  `🛡️ Защита: ${player.defense}\n` +
                  `💰 Золото: ${player.gold}\n` +
                  `⚗️ Зелья: ${player.potions}\n` +
                  `📈 Опыт: ${player.exp}/${player.maxExp}\n` +
                  `🎒 Оружие: ${player.weapon}\n` +
                  `👕 Броня: ${player.armor}`,
            buttons: [
                [
                    { type: "text", label: "🎮 Главное меню", payload: "main" }
                ]
            ]
        });
    }

    async showInventory(context) {
        const userId = context.userId;
        const player = this.players[userId];

        await context.reply({
            text: `🎒 **ИНВЕНТАРЬ**\n\n` +
                  `🗡️ Оружие: ${player.weapon}\n` +
                  `👕 Броня: ${player.armor}\n` +
                  `⚗️ Зелья лечения: ${player.potions}\n` +
                  `💰 Золото: ${player.gold}`,
            buttons: [
                [
                    { type: "text", label: "🛒 Магазин", payload: "shop" },
                    { type: "text", label: "🎮 Главное меню", payload: "main" }
                ]
            ]
        });
    }

    async showUpgradeMenu(context) {
        const userId = context.userId;
        const player = this.players[userId];

        await context.reply({
            text: `🔄 **ПРОКАЧКА ХАРАКТЕРИСТИК**\n\n` +
                  `💰 Твое золото: ${player.gold}\n\n` +
                  `**Доступные улучшения:**\n` +
                  `⚔️ +2 к атаке - 20 золота\n` +
                  `🛡️ +2 к защите - 20 золота\n` +
                  `❤️ +10 к максимальному HP - 15 золота`,
            buttons: [
                [
                    { type: "text", label: "⚔️ Улучшить атаку", payload: "upgrade_attack" },
                    { type: "text", label: "🛡️ Улучшить защиту", payload: "upgrade_defense" }
                ],
                [
                    { type: "text", label: "❤️ Улучшить HP", payload: "upgrade_hp" },
                    { type: "text", label: "🎮 Главное меню", payload: "main" }
                ]
            ]
        });
    }

    async upgradeStat(stat, cost, context) {
        const userId = context.userId;
        const player = this.players[userId];

        if (player.gold >= cost) {
            let statName = "";
            let bonus = 0;

            switch(stat) {
                case 'attack':
                    player.attack += 2;
                    statName = "атаку";
                    bonus = 2;
                    break;
                case 'defense':
                    player.defense += 2;
                    statName = "защиту";
                    bonus = 2;
                    break;
                case 'maxHp':
                    player.maxHp += 10;
                    player.hp += 10;
                    statName = "максимальное HP";
                    bonus = 10;
                    break;
            }

            player.gold -= cost;

            await context.reply({
                text: `🆙 Ты улучшил ${statName} на +${bonus}!\n` +
                      `💰 Потрачено: ${cost} золота\n` +
                      `💰 Осталось золота: ${player.gold}`,
                buttons: [
                    [
                        { type: "text", label: "🔄 Еще улучшения", payload: "upgrade" },
                        { type: "text", label: "🎮 Главное меню", payload: "main" }
                    ]
                ]
            });
        } else {
            await context.reply({
                text: `❌ Недостаточно золота!\n` +
                      `Нужно: ${cost} золота, у тебя: ${player.gold}`,
                buttons: [
                    [
                        { type: "text", label: "⚔️ Заработать в бою", payload: "battle" },
                        { type: "text", label: "🔄 Назад к улучшениям", payload: "upgrade" }
                    ]
                ]
            });
        }
    }

    levelUp(player) {
        player.level++;
        player.exp = 0;
        player.maxExp = Math.floor(player.maxExp * 1.5);
        player.maxHp += 20;
        player.hp = player.maxHp;
        player.attack += 3;
        player.defense += 2;
    }

    async showHelp(context) {
        await context.reply({
            text: "🎮 **ПОМОЩЬ ПО РПГ БОТУ**\n\n" +
                  "**Основные функции:**\n" +
                  "⚔️ Бой - сражение с монстрами\n" +
                  "🏥 Лечение - восстановление HP\n" +
                  "🛒 Магазин - покупка снаряжения\n" +
                  "🔄 Прокачка - улучшение характеристик\n\n" +
                  "**В бою:**\n" +
                  "🗡️ Атака - нанести урон монстру\n" +
                  "⚗️ Зелье - восстановить HP\n" +
                  "🏃 Побег - попытаться сбежать\n\n" +
                  "**Команды:**\n" +
                  "сброс - создать нового персонажа\n" +
                  "помощь - показать эту справку",
            buttons: [
                [
                    { type: "text", label: "🎮 Начать игру", payload: "main" }
                ]
            ]
        });
    }
}
