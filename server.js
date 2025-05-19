const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const app = express();

// Подключаем pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, 'client')));


// Поддержка form-urlencoded и json POST-запросов — должно идти до роутов
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Настройка подключения к MySQL
const sequelize = new Sequelize("weblaba", "sergey", "1618", {
    host: "localhost",
    dialect: "mysql",
});

// Модель задачи
const Task = sequelize.define("Task", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: DataTypes.DATEONLY,
    time: DataTypes.TIME,
    place: DataTypes.STRING,
    tags: {
        type: DataTypes.STRING, // теги через запятую
        allowNull: true,
        get() {
            const raw = this.getDataValue("tags");
            return raw ? raw.split(",") : [];
        },
        set(val) {
            this.setDataValue("tags", val.join(","));
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
}, {
    updatedAt: false,
});

// --- ROUTES ---

// Главная страница: вывод задач
app.get("/", async (req, res) => {
    try {
        const tasks = await Task.findAll({ order: [["createdAt", "DESC"]] });
        res.render("index", { tasks: tasks || [], title: "Главная страница" });
    } catch (err) {
        console.error(err);
        res.render("index", { tasks: [], title: "Главная страница" });
    }
});

// API: получить все задачи (JSON)
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.findAll({ order: [["createdAt", "DESC"]] });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: создать задачу
app.post("/api/tasks", async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// API: обновить задачу по id
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: "Задача не найдена" });
        await task.update(req.body);
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// API: удалить задачу по id
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: "Задача не найдена" });
        await task.destroy();
        res.json({ message: "Задача удалена" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Запуск сервера после подключения и синхронизации с базой
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Подключение к MySQL успешно");
        await sequelize.sync(); // Создаст таблицы, если их нет
        app.listen(3000, () => {
            console.log("Сервер запущен на http://localhost:3000");
        });
    } catch (err) {
        console.error("Ошибка подключения или синхронизации:", err);
    }
})();
