// Знаходимо елементи на сторінці з нашого документу
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

/* 1) addEventListener приймає 2 аргументи, перший це submit, подія яку ми відстежуємо і submit - спрацбовує при
відправці форми і другий аргумент може бути функція яка спрацьовує після того як ми відправимо форму тобто після submit,
Але важливо, що якщо при натискані на кнопку нам в консолі після нашого запису - console.log('SUBMIT') буде виведено
на долі секунди, а пов'язано це з тим що наша форма автоматично оновлюється, і щоб уникнути цього і все працювало ми
маємо дописати код: щоб відміти стандартну дію, ми дописуємо в функцію аргумент (event) і в тілі функції пишемо 
event.preventDefault() - у event є метод який відміняє стандратну поведінку при відправці форми щоб вона не перезавантажувала 
всю сторінку. 
2) За допомогою taskInput.value властивість value є вбудованою і вона нам якраз дістає наш текст який ми вводимо в 
інпут полі 
3) Тобто наш текст який ми забираємо необхідно відобразити на сторінці у списку задач, для цього нам з html необхідно
скопіювати тег <li>....</li> з нашим фактичним значенням коли ми пропишемо це в інпуті і відобразити як html елемент.
Пишемо наш код в `` зворотніх лапках, щоб ми могли замінити нашу назву задачі з дефолту у нас стоїть 'купити молоко' на 
те що ми будемо писати в інпуті за допомогою змінної taskText і синтаксису ${}
4) Тепер нам треба коли ми введемо в інпуті текст відобразити на сторінці, тобто треба зпихнути в наш тег <ul>...</ul>
- тому спочатку ми створюємо змінну та знаходимо по айді наш елемент ul 
- за допомогою методу insertAdjacentHTML() для tasksList ми робимо додавання html коду, цей метод insertAdjacentHTML()
приймає 2 аргументи: перший - куди ми додаємо наш код(початок, середина, кінець), нам необхідно його додавати в кінець
списку після створення кожного нового тому обираємо (beforeend), другий аргумент це наш фактично код, так як він записанний 
у змінну taskHTML, то ми пишемо його. Або можна використати код таким чином і буде працювати однаково ( tasksList.innerHTML += taskHTML;)
5) Тепер нам необхідно щоб після написання тексту в інпуті автоматично значення переставало відображатися і фокус 
повертався на наше поле: для цього достукуємось до змінної з інпутом taskInput та за допомогою методу value = '', 
ми передаємо в нього пусте поле після наших дій вище, тим самим його очищаємо. Для того щоб встановити фокус на інпут
поле пишемо taskInput.focus() - це метод повертає фокус на наш інпут. 
6) Тепер наша задача, щоб після додавання задач у нас пропадав текст "список задач пустий". Спочатку нам необхідно 
достукатися до всього ul тегу в який ми додаємо наші нові задачі в тезі li, (tasksList.children.length), за допомогою 
children ми достукуємось до дочірніх елементів які входять в цей тег, та через length рахуємо їх кількість, і тоді 
якщо кількість більше одного то ми додаємо до нашого li елементу клас (none, який прописаний зарані в css), і він буде
приховувати наш li з текстом "список задач пустий"
7) Також ми можемо зробити більш читабельний код, створивши окремо функцію під описану дію, а саме додавання задач, і 
в нашу form.addEventListener("submit", дургим аргументом передати саме функцію), для цього створюємо нову 
function addTask (event) { і поміщаємо сюди її тіло, і потім в form.addEventListener("submit", addTask) передаємо як 
другий аргумент 
*/
// Створення масиву для додаваня в нього списку задач і потім відправки/отримання в/з local storage
let tasks = [];
// Перевірка чи є в localStorage записана інфа, якщо там то ми її отрмуємо у форматі JSON, та це не js масив, тому
//нам необхідно за допомогою методу .parse розпарсити в валідний js код і записати це в наш масив
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach(function (task) {
    renderTask(task);
  });
}
// Для того щоб відробразити збережений нам масив з localStorage, необхідно: скопійювати код з функції addTask вставити сюди і зробити деякі зміни зі змінними

checkEmptyList();
// Додавання задачі
form.addEventListener("submit", addTask);
//Видалення задачі
tasksList.addEventListener("click", deleteTask);
// Відмічаємо задачу завершенною
tasksList.addEventListener("click", doneTask);
// Функція додавання задачі
function addTask(event) {
  // відміняємо відправку форми
  event.preventDefault();
  // тепер необхідно дістати текст з нашого інпуту
  const taskText = taskInput.value;
  // створення функціоналу для додавання в local storage
  // 1) створюємо об'єкт з унікальним індетифікатором, написаним текстом та перевіркою чи виконана задача
  // id: Date.now(), - це означає, що наш айді буде підв'язаний під час створення нашої задачі
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  // 2) Створюємо масив, та виконуємо додавання задачі в масив за допомогою методу push(додає новий елемент в кінець масиву)
  // на 41 рядку ми створили масив, а тепер додаватимемо в нього нові значення
  tasks.push(newTask);
  // Зберігаємо список задач(зміну в масиві) в сховище браузера localStorage
  saveToLocalStorage();
  renderTask(newTask);
  //   // 3) Формуємо css Class для відображення виконаної/не виконаної задачі і запису її через ${} в клас нашого спану
  //   const cssClass = newTask.done ? "task-title task-title--done" : "task-title";

  //   // формування розмітки для нової задачі
  //   const taskHTML = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
  //   <span class="${cssClass}">${newTask.text}</span>
  //   <div class="task-item__buttons">
  //       <button type="button" data-action="done" class="btn-action">
  //           <img src="./img/tick.svg" alt="Done" width="18" height="18">
  //       <button type="button" data-action="delete" class="btn-action">
  //						<img src="./img/cross.svg" alt="Done" width="18" height="18">
  //            </button>
  //           <img src="./img/cross.svg" alt="Done" width="18" h
  //   </div>
  // </li>`;

  //   // Додавання задачі на сторінку
  //   tasksList.insertAdjacentHTML("beforeend", taskHTML);

  // Очищення поля вводу інпуту та повернення фокусу на нього
  taskInput.value = "";
  taskInput.focus();
  // Перевірка. Якщо в списку задач більше 1 елементу приховуємо блок з "список задач пустий"
  // Ми закоментуємо цей код для роботи з local storage так само і в index.html частку тегу li
  // if (tasksList.children.length > 1) {
  //   emptyList.classList.add("none");
  // }
  checkEmptyList();
}
// Функція видалення задачі
function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;
  const parentNode = event.target.closest(".list-group-item");

  // Шукаємо айді нашої задачі для видалення, Number було поставлено, так як наш айді є значенням String, для правильної
  // роботи функції нижче ми маємо отримати число для порівняня
  const id = Number(parentNode.id);
  // Знаходиом індекс задачі в масиві за допомогою методу .findIndex() він приймає як аргумент в себе функцію
  // findIndex проходиться по кожному елементу масива окремо, параметр task необхідний для звернення до кожного елемента масивув
  // тоді під параметром у нас буде з'являтися елемент масива
  // const index = tasks.findIndex(function (task) {
  //   if (task.id === id) {
  //     return true;
  //   }
  // });
  // Видаляємо задачу із масива: метод splice видаляє елемент масива з 2 аргументами індекс та кількість яку необхідно видалити
  // tasks.splice(index, 1);
  //видалення задачі через метод filter
  tasks = tasks.filter((task) => task.id !== id);
  // Зберігаємо список задач(зміну в масиві) в сховище браузера localStorage
  saveToLocalStorage();
  parentNode.remove();

  // Перевірка того, якщо задач в нас немає повернути блок з "список задач пустий"
  // if (tasksList.children.length <= 1) {
  //   emptyList.classList.remove("none");
  // }
  checkEmptyList();
}
/* 1) задаємо на елемент ul по айді tasksList слухач подій(addEventListener), даємо 2 аргументи, де перший click - означає
що будемо клікати, другий (deleteTask) це наша описана функція нижче 
2) створюємо функцію якій ми вже надали наше ім'я deleteTask і параметром вказуємо event.
3) в тілі функції на event додаємо метод .target - він оначає що ми достукаємось до елементу на нашій сторінці в залежності
того де ми натиснемо клавішу, тобто якщо на конкретну кнопку ми в консолі отримаємо кнопку, якщо на цифру ми отримаємо 
елемент з html саме де знаходиться та цифра, тобто це буде конкретний елемент в залежності де ми натиснемо мишкою на сторінці.
4) Далі нам необхідно зрозуміти, що ми достукуємось саме до тієї кнопки яка нам необхідна, в html розміткі де наша кнопка
ми маємо data атрибут - це атрибути які дозволяють зберігати додаткову інформацію у стандартних елементах HTML, але 
без візуального відображення на сторінці. Наш data-action="done" і data-action="delete" має атрибут (action) тому ми до
робимо перевірку через event.target і щоб достукатися до атрибута (action) ми викристовуємо dataset.action === 'delete'.
5) Далі ми коли знайшли нашу кнопку, ми маємо видали за допомогою кнопки вміст тега li, так само використовуючи event.target
і за допомогою методу closest('li'), ми від нашого button знаходимо його батьківський елемент, так як button знаходиться 
в тезі li, то нам необхідно до нього достукатися і дамо назву для константи і потім від назви ми видалимо цей тег за 
допомогою методу .remove()
6) Тепер нам необхідно повернути "список задач пустий" коли в нас немає жодної задачі після всіх видалень, для цього 
ми повертаємось в функцію addTask копіюємо нашу перевірку if (tasksList.children.length > 1) {
    emptyList.classList.add("none");
  } і вставляємо в нашу функцію і змінюємо значення > на < або === 1, і замість .add міняємо на .remove 
*/
// Функція яка описує відмічену задачу
function doneTask(event) {
  // перевіряємо що ми клікнули на елемент яка виконує задачу завершеною
  if (event.target.dataset.action !== "done") return;
  const parentNode = event.target.closest(".list-group-item");
  // Визначення айді нашої задачі
  const id = Number(parentNode.id);
  // Шукаємо елемент масива через метод find, його основна відмінність від findIndex полягає у тому що find шукає
  // саме елемент з масиву, а findIndex шукає індекс елемента в масиві
  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });
  task.done = !task.done;
  // Зберігаємо список задач(зміну в масиві) в сховище браузера localStorage
  saveToLocalStorage();
  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}
/* 1) Вішаємо подію на наш tasksList і даємо 2 аргумента клік і функцію яку описуємо нижче 
2) створюємо функцію doneTask і передаємо параметр event 
3) по схожій перевірці достукуємо до потрібної нам кнопки event.target.dataset.action === "done"
4) створюємо змінну parentNode і шукаємо в ній наш тег або клас li в якому знаходиться спан 
5) стврюємо наступну змінну taskTitle в якій ми вже достукуємось безпосередньо до нашого спан елементу з html через його клас 
6) додаємо до нашого спану (taskTitle) клас (task-title--done) який попередньо прописаний в стилях і відбувається 
зачеркування елемента після натискання на нього за допомогою методу toggle, який в свою чергу додає такий клас task-title--done
якщо його немає в елементі спан, або навпаки видаляє якщо такий вже існує 
*/
// Створення функції під "список задач пустий" для майбутньго відтворення в local storage
function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список задач пустий</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}
// Додавання нашого масиву (tasks) в local storage
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
/* 1) Створюємо функцію в якій ми викликаємо localStorage з методом setItem - який дозволяє нам поміщати інформацію 
в localStorage, за допомогою getItem - ми навпаки отрмиуємо нашу інфу з localStorage
2) setItem приймає 2 аргументи, де перший це наш ключ(у нашому випадку це назва масиву, а може бути типу name:)
другий аргумент це значення до ключа (Якби ключ був name, то значенння "Богдан" наприклад ), так як ми маємо масив, то 
значення з нього передаються у формі рядкового значення який конвертує метод JSON.stringify з масиву tasks
3) Нам необхідно нашу функцію saveToLocalStorage() додати в інші функції після змін в масиву для збереження в localStorage
*/
// Так як в нас є код який повторюється, то краще його від рефакторити та винести в окрему функцію та викликати за потреби
function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // формування розмітки для нової задачі
  const taskHTML = `
  <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
<span class="${cssClass}">${task.text}</span>
<div class="task-item__buttons">
<button type="button" data-action="done" class="btn-action">
<img src="./img/tick.svg" alt="Done" width="18" height="18">
</button>
<button type="button" data-action="delete" class="btn-action">
<img src="./img/cross.svg" alt="Done" width="18" height="18">
</button>
</div>
</li>`;

  // Додавання задачі на сторінку
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
