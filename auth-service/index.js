const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
	origin: "https://tasklist.local", // Здесь указываешь тот домен, откуда будут запросы
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
	try {
		await mongoose.connect("mongodb+srv://ilieturcan424:U1VlcFDeqjppHcQv@auth.pye2u.mongodb.net/?retryWrites=true&w=majority&appName=auth");
		app.listen(PORT, () => console.log(`server started on port ${PORT}`));
	} catch (e) {
		console.log(e);
	}
};

start();
