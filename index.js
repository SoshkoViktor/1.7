const storage = localStorage;
const list = document.getElementById("list");
const form = document.getElementById("form");
const formInp = document.getElementById("form-inp");
const clear = document.getElementById("clear");

const getList = () => JSON.parse(storage.getItem("taskList"));
const setList = (taskList) => storage.setItem("taskList", JSON.stringify(taskList));
const getTaskById = (id) => getList().filter((task) => task.id === id)[0];
const updateTaskList = (newTask) => {
  const newTaskList = getList().map((task) => (task.id === newTask.id ? newTask : task));
  setList(newTaskList);
};

const deleteTask = (id) => {
  const newTaskList = getList().filter((task) => task.id !== id);
  setList(newTaskList);
};

const clearAll = () => {
  setList([]);
  list.innerHTML = "";
};

const generateId = () => {
  return Math.random()
    .toString(36)
    .substring(2, 10 + 2);
};

const addTask = (todo) => {
  const tasks = getList();
  tasks.push(todo);
  setList(tasks);
  const task = newTask(todo);
  list.innerHTML += task;
};

const doneTask = (id) => {};

const renderTasks = (taskList) => {
  taskList.forEach((todo) => {
    let task = newTask(todo);
    list.innerHTML += task;
  });
};

const renderUpdatedTask = (oldItem, task) => {
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = newTask(task);
  oldItem.style.display = "none";
  list.insertBefore(tempContainer.firstElementChild, oldItem);
  oldItem.remove();
};

const init = () => {
  const list = getList();
  list ? renderTasks(list) : setList([]);
};

const newTask = (task) => {
  const { text, done, editable, id } = task;
  const edit = '<button type="button" class="edit"></button>';
  const save = '<button type="button" class="save"></button>';
  const del = '<button type="button" class="delete"></button>';
  let options = "";

  if (editable) {
    options = save;
  } else {
    options = done ? del : edit + del;
  }

  const listItemTemplate = `
    <li class="list-item ${editable ? 'editable' : ''} ${done ? "done" : ''}" data-id=${id}>
        <label class="${done ? "checked" : "check"}" >
          <input type="checkbox" name="${id}" class="check-inp" checked="${done ? true : false}"/>
        </label>
        <div class="text" ${editable ? "contentEditable=true" : ''} >
        ${text}
        </div>
        <div class="options">
            ${options}
        </div>
    </li>
    `;

  return listItemTemplate;
};

const getPairIdItem  = (target) => {
    const listItem = target.closest(".list-item");
    const id = listItem.dataset.id;
    return {id,listItem};
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = formInp.value.trim();
  if(!text) {
    return
  }
  const id = generateId();
  const taskObj = { text, done: false, editable: false, id };
  addTask(taskObj);
  formInp.value = "";
});

clear.addEventListener("click", clearAll);

list.addEventListener("click", (e) => {
  const target = e.target;

  if (
    target.classList.contains("check") ||
    target.classList.contains("checked")
  ) {
    const {id,listItem} = getPairIdItem(target);
    const task = getTaskById(id);
    task.done = !task.done;
    task.editable = false;
    updateTaskList(task);
    renderUpdatedTask(listItem, task);
    return;
  }

  if (target.classList.contains("delete")) {
    const {id, listItem} = getPairIdItem(target);
    deleteTask(id);
    listItem.remove();
    return;
  }

  if (target.classList.contains("edit")) {
    
    const {id,listItem} = getPairIdItem(target);
    const task = getTaskById(id);
    task.editable = !task.editable;
    updateTaskList(task);
    renderUpdatedTask(listItem, task);

    return;
  }

  if (target.classList.contains("save")) {
    const {id,listItem} = getPairIdItem(target);
    const text = listItem.querySelector(".text").innerText.trim();
    const task = getTaskById(id);
    task.editable = !task.editable;

    if(text) {
       task.text = text;
    }

    updateTaskList(task);
    renderUpdatedTask(listItem, task);

    return;
  }
});

init();
