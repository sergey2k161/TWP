const fs = require("fs");
const tasksFilePath = __dirname + "/client/tasks.json";
var express = require("express"),
    http = require("http"),
    app = express()

// Раздаём статику (HTML, CSS, JS)
app.use(express.static(__dirname + "/client"));

// Поддержка form-urlencoded POST-запросов
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/tasks", (req, res) => {
    fs.readFile(tasksFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            return res.status(500).send("Ошибка сервера");
        }

        res.header("Content-Type", "application/json");
        res.send(data);
    });
});


app.post("/tasks", (req, res) => {
    const newTask = req.body;

    fs.readFile(tasksFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            return res.status(500).send("Ошибка сервера");
        }

        let jsonStr = data.trim();

        // Удаляем BOM если есть
        if (jsonStr.charCodeAt(0) === 0xFEFF) {
            jsonStr = jsonStr.slice(1);
        }

        let tasks = [];
        try {
            tasks = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Ошибка парсинга JSON:", e);
        }

        tasks.push(newTask);

        fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 4), (err) => {
            if (err) {
                console.error("Ошибка записи файла:", err);
                return res.status(500).send("Не удалось сохранить задачу");
            }
            res.status(200).send({ message: "Задача добавлена" });
        });
    });
});


http.createServer(app).listen(3000);
