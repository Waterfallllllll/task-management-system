const express = require("express");
const cors = require("cors"); // Добавляем пакет cors
const authService = require("./services/authService"); 
const app = express();
app.use(express.json());


app.use(cors({
	origin: "https://tasklist.local", // Здесь указываешь тот домен, откуда будут запросы
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"]
}));

app.post("/login", async (req, res) => {
	try {
		const token = await authService.loginUser(req.body);
		res.json({ token });
	} catch (error) {
		res.status(500).json({ error: "Login failed" });
	}
});

app.post("/register", async (req, res) => {
	try {
		const newUser = await authService.registerUser(req.body);
		res.json({ message: "Registration successful", newUser });
	} catch (error) {
		res.status(500).json({ error: "Registration failed" });
	}
});

app.get("/users", async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	try {
		const users = await authService.getUsers(token);
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

app.listen(5001, () => {
	console.log("Backend server is running on port 5001");
});

