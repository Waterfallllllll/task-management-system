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

const tasks = []; // Простой массив для хранения задач (вместо базы данных)

// Создание задачи
app.post("/tasks", (req, res) => {
	const { title, startDate, endDate } = req.body;
	const newTask = { id: Date.now(), title, startDate, endDate, completed: false };
	tasks.push(newTask);
	res.status(201).send(newTask);
});

// Получение всех задач
app.get("/tasks", (req, res) => {
	res.status(200).send(tasks);
});

// Завершение задачи
app.patch("/tasks/:id/complete", (req, res) => {
	const taskId = parseInt(req.params.id);
	const task = tasks.find(t => t.id === taskId);
	if (!task) return res.status(404).send({ message: "Task not found" });

	task.completed = true;
	res.status(200).send(task);
});

app.listen(3002, () => {
	console.log("Task Service is running on port 3002");
});
