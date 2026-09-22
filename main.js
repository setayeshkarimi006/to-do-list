const today = new Date();
const persianDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
}).format(today);
const DateElement = document.getElementById("current-date");
DateElement.textContent = persianDate;
// ===================================
// 1. انتخاب عناصر HTML
// ===================================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const categoryItems = document.querySelectorAll(".category-item");

const folderList = document.getElementById("folder-list");
const openFolderModalBtn = document.getElementById("open-folder-modal");

const folderModal = document.getElementById("folder-modal");
const folderForm = document.getElementById("folder-form");
const folderInput = document.getElementById("folder-input");
const cancelFolderBtn = document.getElementById("cancel-folder");

// ===================================
// 2. ساخت داده‌های اولیه
// ===================================

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const folders = JSON.parse(localStorage.getItem("folders")) || [];

let selectedCategory = "day";

let nextTaskId = tasks.length
  ? Math.max(...tasks.map((task) => task.id)) + 1
  : 1;

let nextFolderId = folders.length
  ? Math.max(...folders.map((folder) => folder.id)) + 1
  : 1;

//let nextTaskId = 1;
//let nextFolderId = 1;

// ===================================
// 2/5. ساخت تابع ذخیره سازی
// ===================================

function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));

  localStorage.setItem("folders", JSON.stringify(folders));
}

// ===================================
// 3. افزودن تسک جدید
// ===================================

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    return;
  }

  const newTask = {
    id: nextTaskId,
    text: taskText,
    category: selectedCategory,
    completed: false,
  };

  nextTaskId++;

  tasks.push(newTask);

  saveData();

  taskInput.value = "";

  renderTasks();
});

// ===================================
// 4. نمایش تسک‌های دسته انتخاب‌ شده
// ===================================

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(function (task) {
    return task.category === selectedCategory;
  });

  filteredTasks.forEach(function (task) {
    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "task-checkbox";

    checkbox.checked = task.completed;

    checkbox.dataset.taskId = task.id;

    const taskText = document.createElement("span");

    taskText.className = "task-text";

    taskText.textContent = task.text;

    taskItem.append(checkbox, taskText);

    taskList.appendChild(taskItem);
  });
}

// ===================================
// 5. انتخاب روز، هفته یا ماه
// ===================================

categoryItems.forEach(function (item) {
  item.addEventListener("click", function () {
    selectedCategory = item.dataset.category;

    categoryItems.forEach(function (category) {
      category.classList.remove("active");
    });

    item.classList.add("active");

    document.querySelectorAll(".folder-item").forEach(function (folder) {
      folder.classList.remove("active");
    });

    renderTasks();
  });
});

// ===================================
// 6. انجام‌شده کردن تسک
// ===================================

taskList.addEventListener("change", function (event) {
  if (!event.target.matches(".task-checkbox")) {
    return;
  }

  const taskId = Number(event.target.dataset.taskId);

  const selectedTask = tasks.find(function (task) {
    return task.id === taskId;
  });

  if (!selectedTask) {
    return;
  }

  selectedTask.completed = event.target.checked;

  saveData();

  renderTasks();
});

// ===================================
// 7. باز کردن پنجره ساخت پوشه
// ===================================

openFolderModalBtn.addEventListener("click", function () {
  folderModal.classList.remove("hidden");

  folderInput.value = "";

  folderInput.focus();
});

// ===================================
// 8. بستن پنجره ساخت پوشه
// ===================================

cancelFolderBtn.addEventListener("click", function () {
  folderModal.classList.add("hidden");
});

// ===================================
// 9. ساخت پوشه جدید
// ===================================

folderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const folderName = folderInput.value.trim();

  if (folderName === "") {
    return;
  }

  if (folderName.length > 15) {
    alert("نام پوشه نباید بیشتر از ۲۰ کاراکتر باشد.");

    return;
  }

  const newFolder = {
    id: nextFolderId,
    name: folderName,
  };

  nextFolderId++;

  folders.push(newFolder);

  saveData();

  renderFolders();

  folderModal.classList.add("hidden");

  folderInput.value = "";
});

// ===================================
// 10. نمایش پوشه‌ها
// ===================================

function renderFolders() {
  folderList.innerHTML = "";

  folders.forEach(function (folder) {
    const folderButton = document.createElement("button");

    folderButton.type = "button";

    folderButton.className = "folder-item";

    folderButton.dataset.folderId = folder.id;

    if (selectedCategory === `folder-${folder.id}`) {
      folderButton.classList.add("active");
    }

    const folderIcon = document.createElement("span");

    folderIcon.className = "folder-icon";

    folderIcon.textContent = "📁";

    const folderName = document.createElement("span");

    folderName.textContent = folder.name;

    folderButton.append(folderIcon, folderName);

    folderButton.addEventListener("click", function () {
      selectedCategory = `folder-${folder.id}`;

      categoryItems.forEach(function (category) {
        category.classList.remove("active");
      });

      document.querySelectorAll(".folder-item").forEach(function (item) {
        item.classList.remove("active");
      });

      folderButton.classList.add("active");

      renderTasks();
    });

    folderList.appendChild(folderButton);
  });
}

// ===================================
// 11. اجرای اولیه برنامه
// ===================================

renderTasks();

renderFolders();
