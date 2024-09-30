// script.js

document.addEventListener("DOMContentLoaded", function () {
	const taskForm = document.getElementById("taskForm");
	const taskTitleInput = document.getElementById("taskTitle");
	const taskStartTimeInput = document.getElementById("taskStartTime");
	const taskEndTimeInput = document.getElementById("taskEndTime");
	const cancelTaskButton = document.getElementById("cancelTask");
	const totalTasks = document.getElementById("totalTasks");
	const completedTasks = document.getElementById("completedTasks");
	const taskModal = document.getElementById("taskModal");
	const completeModal = document.getElementById("completeModal");
	const modalTaskTitle = document.getElementById("modalTaskTitle");
	const completeTaskButton = document.getElementById("completeTaskButton");
	const closeCompleteModalButton = document.getElementById("closeCompleteModalButton");

	const tasks = [];

	// Инициализация календаря
	const calendarEl = document.getElementById("calendar");
	const calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: "timeGridWeek",
		editable: true,
		selectable: true,
		events: tasks.map(task => ({
			title: task.title,
			start: task.startDate,
			end: task.endDate,
			description: task.description,
			id: task.id,
			classNames: task.completed ? ["completed"] : []
		})),
		select: function(info) {
			taskModal.style.display = "block";
			taskStartTimeInput.value = info.startStr.split("T")[1];
			taskEndTimeInput.value = info.endStr.split("T")[1];
			taskForm.onsubmit = function (e) {
				e.preventDefault();
				const task = {
					id: Date.now().toString(),
					title: taskTitleInput.value,
					startDate: info.startStr.split("T")[0] + "T" + taskStartTimeInput.value,
					endDate: info.endStr.split("T")[0] + "T" + taskEndTimeInput.value,
					description: "",
					completed: false
				};
				tasks.push(task);
				calendar.addEvent({
					title: task.title,
					start: task.startDate,
					end: task.endDate,
					description: task.description,
					id: task.id,
					classNames: task.completed ? ["completed"] : []
				});
				taskModal.style.display = "none";
				updateStats();
			};
		},
		eventClick: function(info) {
			modalTaskTitle.textContent = info.event.title;
			completeModal.style.display = "block";
			completeTaskButton.onclick = function() {
				const event = info.event;
				const task = tasks.find(task => task.id === event.id);
				if (task) {
					task.completed = true;
					event.setProp("classNames", ["completed"]);
					completeModal.style.display = "none";
					updateStats();
				}
			};
		}
	});
	calendar.render();

	// Обработка отмены создания задачи
	cancelTaskButton.addEventListener("click", function() {
		taskModal.style.display = "none";
	});

	// Обработка закрытия модального окна завершения задачи
	closeCompleteModalButton.addEventListener("click", function() {
		completeModal.style.display = "none";
	});

	// Функция для обновления статистики задач
	function updateStats() {
		totalTasks.textContent = tasks.length;
		completedTasks.textContent = tasks.filter(task => task.completed).length;
	}



	document.getElementById("loginForm").addEventListener("submit", async (event) => {
		event.preventDefault();  // Останавливает перезагрузку страницы

		const username = document.getElementById("loginUsername").value;
		const password = document.getElementById("loginPassword").value;

		const response = await fetch("http://localhost:5001/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (response.ok) {
			localStorage.setItem("token", data.token);
			alert("Login successful");
		} else {
			alert("Login failed");
		}
	});

	document.getElementById("registerForm").addEventListener("submit", async function (event) {
		event.preventDefault();  // Останавливает перезагрузку страницы

		const username = document.getElementById("registerUsername").value;
		const password = document.getElementById("registerPassword").value;
		// http://localhost:5001/auth/registration
		const response = await fetch("http://localhost:5001/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, password })
		});

		if (response.ok) {
			alert("Registration successful");
		} else {
			alert("Registration failed");
		}
	});

});
