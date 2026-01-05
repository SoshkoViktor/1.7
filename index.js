const storage = localStorage;
const list = document.getElementById("list");
const form = document.getElementById("form");
const formInp = document.getElementById("form-inp");
const clear = document.getElementById("clear");

const getList = () => JSON.parse(storage.getItem("taskList"));
const setList = (arr) => storage.setItem("taskList", JSON.stringify(arr));
const getTaskById = (id) => getList().filter((obj) => obj.id === id)[0];
const updateTaskList = (newObj) => {
  const newArr = getList().map((obj) => (obj.id === newObj.id ? newObj : obj));
  setList(newArr);
};

const deleteTask = (id) => {
  const newArr = getList().filter((obj) => obj.id !== id);
  setList(newArr);
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

const addTask = (obj) => {
  const tasks = getList();
  tasks.push(obj);
  setList(tasks);
  const task = newTask(obj);
  list.innerHTML += task;
};

const doneTask = (id) => {};

const renderTasks = (arr) => {
  arr.forEach((obj) => {
    let task = newTask(obj);
    list.innerHTML += task;
  });
};

const renderUpdatedTask = (oldItem, obj) => {
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = newTask(obj);
  oldItem.style.display = "none";
  list.insertBefore(tempContainer.firstElementChild, oldItem);
  oldItem.remove();
};

const init = () => {
  const list = getList();
  list ? renderTasks(list) : setList([]);
};

const newTask = (obj) => {
  const { text, done, editable, id } = obj;
  const edit = '<div class="edit"></div>';
  const save = '<div class="save"></div>';
  const del = '<div class="delete"></div>';
  let options = "";

  if (editable) {
    options = save;
  } else {
    options = done ? del : edit + del;
  }

  const listItemTemplate = `
    <li class="list-item ${editable && 'editable'} ${done && "done"}" data-id=${id}>
        <div class="${done ? "checked" : "check"}"></div>
        <div class="text" ${editable && "contentEditable=true"} >
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
    const taskObj = getTaskById(id);
    taskObj.done = !taskObj.done;
    taskObj.editable = false;
    updateTaskList(taskObj);
    renderUpdatedTask(listItem, taskObj);
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
    const taskObj = getTaskById(id);
    taskObj.editable = !taskObj.editable;
    updateTaskList(taskObj);
    renderUpdatedTask(listItem, taskObj);

    return;
  }

  if (target.classList.contains("save")) {
    const {id,listItem} = getPairIdItem(target);
    const text = listItem.querySelector(".text").innerText.trim();
    const taskObj = getTaskById(id);
    taskObj.editable = !taskObj.editable;

    if(text) {
       taskObj.text = text;
    }

    updateTaskList(taskObj);
    renderUpdatedTask(listItem, taskObj);

    return;
  }
});

init();
