const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors"); // Импортируем cors

const app = express();

// Настройка CORS
app.use(cors({
	origin: "https://tasklist.local", // Разрешаем запросы с этого домена
	methods: "GET,POST,PUT,PATCH,DELETE",
	allowedHeaders: "Content-Type,Authorization"
}));

app.use(bodyParser.json());

const users = []; // Простой массив для хранения пользователей (вместо базы данных)

// Регистрация
app.post("/register", (req, res) => {
	const { username, password } = req.body;
	const hashedPassword = bcrypt.hashSync(password, 8);
	users.push({ username, password: hashedPassword });
	res.status(201).send({ message: "User registered successfully" });
});

// Вход
app.post("/login", (req, res) => {
	const { username, password } = req.body;
	const user = users.find(u => u.username === username);
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	const isPasswordValid = bcrypt.compareSync(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).send({ message: "Invalid password" });
	}
	const token = jwt.sign({ id: user.username }, "your-secret-key", { expiresIn: 86400 });
	res.status(200).send({ auth: true, token });
});

// Проверка токена (Middleware)
function verifyToken(req, res, next) {
	const token = req.headers["x-access-token"];
	if (!token) return res.status(403).send({ message: "No token provided" });

	jwt.verify(token, "your-secret-key", (err, decoded) => {
		if (err) return res.status(500).send({ message: "Failed to authenticate token" });
		req.userId = decoded.id;
		next();
	});
}

// Защищенный маршрут
app.get("/me", verifyToken, (req, res) => {
	res.status(200).send({ message: `Hello ${req.userId}` });
});

app.listen(3001, () => {
	console.log("Auth Service is running on port 3001");
});
