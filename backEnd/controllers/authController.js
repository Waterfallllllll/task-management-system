// const authService = require("../services/authService"); // Импортируй authService
// const { getUsers } = require("../services/authService"); // Импортируй getUsers

// async function loginUser(req, res) {
// 	try {
// 		const userData = req.body; // Получи данные пользователя из тела запроса
// 		const token = await authService.loginUser(userData); // Выполни логин и получи токен
// 		const users = await getUsers(token); // Получи пользователей
// 		res.status(200).json({ token, users }); // Верни токен и список пользователей
// 	} catch (error) {
// 		console.error("Ошибка при логине:", error);
// 		res.status(500).json({ message: "Ошибка при логине" });
// 	}
// }

// module.exports = { loginUser };

