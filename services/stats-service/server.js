const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Пример для stats-service и task-service
const cors = require("cors");
app.use(cors({
	origin: "https://tasklist.local",
	methods: "GET,POST,PUT,PATCH,DELETE",
	allowedHeaders: "Content-Type,Authorization"
}));



app.use(bodyParser.json());

const tasks = []; // Этот массив должен получать данные из task-service

// Получение статистики задач
app.get("/stats", (req, res) => {
	const totalTasks = tasks.length;
	const completedTasks = tasks.filter(t => t.completed).length;
	res.status(200).send({ totalTasks, completedTasks });
});

app.listen(3003, () => {
	console.log("Stats Service is running on port 3003");
});
