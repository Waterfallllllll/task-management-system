const Router = require("express");
const router = new Router();
const { loginUser, registerUser, getUsers } = require("./authController");
const { check } = require("express-validator");

router.post("/registration", [
	check("username", "Имя пользователя не может быть пустым").notEmpty(),
	check("password", "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, max:10})
], registerUser);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/users", getUsers);

module.exports = router;

// const express = require("express");
// const { loginUser, registerUser, getUsers } = require("./authController");
// const router = express.Router();

// router.post("/login", loginUser);
// router.post("/register", registerUser);
// router.get("/users", getUsers);

// module.exports = router;
