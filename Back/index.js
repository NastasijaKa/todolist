require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json()); // Чтобы сервер понимал JSON из запросов

// 1. Подключение к базе данных SQLite (файл создастся автоматически)
const db = new sqlite3.Database("./todo.db", (err) => {
  if (err) console.error("Ошибка подключения к БД:", err);
  else {
    console.log("Подключен к SQLite базе данных");
    // Создаём таблицу для задач, если её ещё нет
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            is_completed BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
  }
});

// 2. Получите токен вашего бота у @BotFather и вставьте сюда
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// 3. Обработчик команды /start. Отправляет пользователю его ID
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id; // Это и есть уникальный числовой ID пользователя
  bot.sendMessage(
    chatId,
    `Ваш ID в Telegram: ${userId}. Он будет использоваться для сохранения вашего списка дел.`
  );
});

// 4. Веб-сервер (API) для приёма запросов от вашего React-приложения
// Получить все задачи пользователя
app.get("/api/tasks/:userId", (req, res) => {
  const userId = req.params.userId;
  db.all(
    "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at",
    [userId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Добавить новую задачу
app.post("/api/tasks", (req, res) => {
  const { userId, text } = req.body;
  db.run(
    "INSERT INTO tasks (user_id, text) VALUES (?, ?)",
    [userId, text],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Отметить задачу как выполненную/невыполненную
app.patch("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { is_completed } = req.body;
  db.run(
    "UPDATE tasks SET is_completed = ? WHERE id = ?",
    [is_completed, taskId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updated: this.changes });
    }
  );
});

// Удалить задачу
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  db.run("DELETE FROM tasks WHERE id = ?", [taskId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// Запуск сервера на порту 3001 (чтобы не конфликтовать с React на 3000)
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
