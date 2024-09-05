document.addEventListener("DOMContentLoaded", async function () {
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

	const tasks = []; // Определение переменной tasks

	const yourAuthToken = localStorage.getItem("authToken"); // Получение токена

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
			id: task.id,
			classNames: task.completed ? ["completed"] : []
		})),
		select: function(info) {
			taskModal.style.display = "block";
			taskStartTimeInput.value = info.startStr.split("T")[1];
			taskEndTimeInput.value = info.endStr.split("T")[1];
			taskForm.onsubmit = async function (e) {
				e.preventDefault();
				const task = {
					title: taskTitleInput.value,
					startDate: info.startStr.split("T")[0] + "T" + taskStartTimeInput.value,
					endDate: info.endStr.split("T")[0] + "T" + taskEndTimeInput.value
				};
				const newTask = await createTask(task.title, task.startDate, task.endDate);
				tasks.push(newTask);
				calendar.addEvent({
					title: newTask.title,
					start: newTask.startDate,
					end: newTask.endDate,
					id: newTask.id,
					classNames: newTask.completed ? ["completed"] : []
				});
				taskModal.style.display = "none";
				updateStats();
			};
		},
		eventClick: function(info) {
			modalTaskTitle.textContent = info.event.title;
			completeModal.style.display = "block";
			completeTaskButton.onclick = async function() {
				const event = info.event;
				const task = tasks.find(task => task.id === event.id);
				if (task) {
					await completeTask(task.id);
					task.completed = true;
					event.setProp("classNames", ["completed"]);
					completeModal.style.display = "none";
					updateStats();
				}
			};
		}
	});
	calendar.render();

	// Загрузка задач и статистики
	const initialTasks = await getTasks();
	initialTasks.forEach(task => {
		tasks.push(task);
		calendar.addEvent({
			title: task.title,
			start: task.startDate,
			end: task.endDate,
			id: task.id,
			classNames: task.completed ? ["completed"] : []
		});
	});

	const stats = await getStats();
	totalTasks.textContent = stats.totalTasks;
	completedTasks.textContent = stats.completedTasks;

	// Обработка отмены создания задачи
	cancelTaskButton.addEventListener("click", function() {
		taskModal.style.display = "none";
	});

	// Обработка закрытия модального окна завершения задачи
	closeCompleteModalButton.addEventListener("click", function() {
		completeModal.style.display = "none";
	});

	// Функция для обновления статистики задач
	async function updateStats() {
		const stats = await getStats();
		totalTasks.textContent = stats.totalTasks;
		completedTasks.textContent = stats.completedTasks;
	}

	// Функция для создания задачи
	async function createTask(title, startDate, endDate) {
		const response = await fetch("http://localhost:3002/tasks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${yourAuthToken}`  // Используем полученный токен
			},
			body: JSON.stringify({ title, startDate, endDate })
		});
		const data = await response.json();
		return data;
	}

	// Функция для получения задач
	async function getTasks() {
		const response = await fetch("http://localhost:3002/tasks", {
			method: "GET",
			headers: { "Authorization": `Bearer ${yourAuthToken}` }  // Используем полученный токен
		});
		const data = await response.json();
		return data;
	}

	// Функция для завершения задачи
	async function completeTask(taskId) {
		const response = await fetch(`http://localhost:3002/tasks/${taskId}/complete`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${yourAuthToken}`  // Используем полученный токен
			}
		});
		const data = await response.json();
		return data;
	}

	// Функция для получения статистики
	async function getStats() {
		const response = await fetch("http://localhost:3003/stats", {
			method: "GET",
			headers: { "Authorization": `Bearer ${yourAuthToken}` }  // Используем полученный токен
		});
		const data = await response.json();
		return data;
	}
});
