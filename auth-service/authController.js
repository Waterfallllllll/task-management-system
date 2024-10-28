const User = require("./models/User"); // Модель пользователя из базы данных
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Role = require("./models/Role");


// Логин пользователя
exports.loginUser = async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });

	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(400).json({ error: "Invalid password" });
	}

	const token = jwt.sign({ userId: user._id }, "secretKey", { expiresIn: "1h" });
	return res.json({ token });
};

exports.registerUser = async (req, res) => {
	try {

		const {username, password} = req.body;
		const candidate = await User.findOne({username});
		if (candidate) {
			return res.status(400).json({message: "Пользователь с таким именем уже существует"});
		}
		const hashPassword = bcrypt.hashSync(password, 7);
		const userRole = await Role.findOne({value: "USER"});
		const user = new User({username, password: hashPassword, roles: [userRole.value]});
		await user.save();

		// Генерация токена для нового пользователя
		const token = jwt.sign({ userId: user._id }, "secretKey", { expiresIn: "1h" });

		// Возвращение токена и сообщения
		return res.json({ message: "Пользователь успешно зарегистрирован", token });
		
	} catch (e) {
		console.log(e);
		res.status(400).json({message: "Registration error"});
	}
};

// Получение списка пользователей
exports.getUsers = async (req, res) => {
	const users = await User.find().select("-password"); // Исключаем пароли из вывода
	res.json(users);
};
