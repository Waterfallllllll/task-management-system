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
	const cont = document.querySelector(".mega-block");

	const tasks = [];
	window.addEventListener("beforeunload", function () {
		localStorage.clear();
	});

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

	if (localStorage.getItem("token")) {
		cont.style.display = "block";
	} else {
		cont.style.display = "none";
	}


	document.getElementById("loginForm").addEventListener("submit", async (event) => {
		event.preventDefault();  // Останавливает перезагрузку страницы

		const username = document.getElementById("loginUsername").value;
		const password = document.getElementById("loginPassword").value;

		const block = document.getElementById("loginForm");
		const form = document.querySelectorAll(".form");
		const megaBlock = document.querySelector(".mega-block");

		const statusImg = document.createElement("img");
		statusImg.classList.add("animated", "fadeInUp");
		statusImg.style.display = "block";
		statusImg.style.margin = "0 auto";
		statusImg.style.marginTop = "20%";

		form.forEach(item => {
			item.classList.add("animated", "fadeInUp");
			
			item.style.display = "none";
		});
		block.parentElement.append(statusImg);


		getResources("http://localhost:5001/login", username, password)
			.then((data) => {

				localStorage.setItem("token", JSON.stringify(data.token.token));
				block.parentElement.append(statusImg);
				statusImg.setAttribute("src", "assets/img/ok.png");
			})
			.catch((err) => {
				console.error(err);
				block.parentElement.append(statusImg);
				statusImg.setAttribute("src", "assets/img/fail.png");
					 })
			.finally(() => {
				setTimeout(() => {
				
					megaBlock.classList.add("animated", "fadeInUp");
					statusImg.remove();

						
					if (localStorage.getItem("token")) {
						cont.style.display = "block";
					} else {
						cont.style.display = "none";
					}
				}, 2000);
			});
	});

	document.getElementById("registerForm").addEventListener("submit", async function (event) {
		event.preventDefault();  // Останавливает перезагрузку страницы

		const username = document.getElementById("registerUsername").value;
		const password = document.getElementById("registerPassword").value;
		const block = document.getElementById("registerForm");
		const form = document.querySelectorAll(".form");
		const megaBlock = document.querySelector(".mega-block");

		const statusImg = document.createElement("img");
		statusImg.classList.add("animated", "fadeInUp");
		statusImg.style.display = "block";
		statusImg.style.margin = "0 auto";
		statusImg.style.marginTop = "20%";

		form.forEach(item => {
			item.classList.add("animated", "fadeInUp");

			item.style.display = "none";
		});
		block.parentElement.append(statusImg);


		getResources("http://localhost:5001/register", username, password)
			.then((data) => {

				localStorage.setItem("token", JSON.stringify(data.newUser.token));
				block.parentElement.append(statusImg);
				statusImg.setAttribute("src", "assets/img/ok.png");
			})
			.catch((err) => {
				console.error(err);
				block.parentElement.append(statusImg);
				statusImg.setAttribute("src", "assets/img/fail.png");
					 })
			.finally(() => {
				setTimeout(() => {
				
					megaBlock.classList.add("animated", "fadeInUp");
					statusImg.remove();

						
					if (localStorage.getItem("token")) {
						cont.style.display = "block";
					} else {
						cont.style.display = "none";
					}
				}, 2000);
			});
	});


	async function getResources(path, username, password) {
		const res = await fetch(path, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, password })
		});

		if (!res.ok) { 

			throw new Error(`Could not fetch ${url}, status: ${res.status}`); 
		}

		return await res.json(); 
	}

});
