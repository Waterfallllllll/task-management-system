/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
// script.js

// Пример простой логики для управления задачами и аутентификацией
document.addEventListener("DOMContentLoaded", function () {
  const authForm = document.getElementById("authForm");
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const totalTasks = document.getElementById("totalTasks");
  const completedTasks = document.getElementById("completedTasks");
  const tasks = [];

  // Обработка формы авторизации
  authForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Простая логика для демонстрации (без реальной аутентификации)
    alert("Вы успешно вошли в систему!");
  });

  // Обработка формы создания задач
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskTitle = document.getElementById("taskTitle").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const task = {
      title: taskTitle,
      description: taskDescription,
      completed: false
    };
    tasks.push(task);
    renderTasks();
    updateStats();
  });

  // Функция для отображения задач
  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = `${task.title}: ${task.description}`;
      li.addEventListener("click", () => {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
      });
      if (task.completed) {
        li.style.textDecoration = "line-through";
      }
      taskList.appendChild(li);
    });
  }

  // Функция для обновления статистики задач
  function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
  }
});
/******/ })()
;
//# sourceMappingURL=script.js.map