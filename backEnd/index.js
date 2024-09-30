// const express = require("express");
// const cors = require("cors");
// const authRoutes = require("../backEnd/routes/authRoutes"); // Импортируй маршруты

// const app = express();
// const PORT = process.env.PORT || 5001;

// app.use(cors());
// app.use(express.json());

// // Подключаем маршруты
// app.use("/auth", authRoutes);

// app.listen(PORT, () => {
// 	console.log(`Backend server is running on port ${PORT}`);
// });


const express = require("express");
const authService = require("./services/authService"); // Взаимодействие с микросервисом
const app = express();
app.use(express.json());

app.post("/login", async (req, res) => {
	try {
		const token = await authService.loginUser(req.body);
		res.json({ token });
	} catch (error) {
		res.status(500).json({ error: "Login failed" });
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

