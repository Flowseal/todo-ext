var ext = chrome.extension.getBackgroundPage();
var todos = {};
var newTodoInput = $('#newTodoInput');
newTodoInput.focus();
var newTodoBtn = $('#newTodoBtn');
var newTodoImportant = document.querySelector('#newTodoImportant');
var newTodoUrgently = document.querySelector('#newTodoUrgently');
var importantStatus = false, urgentlyStatus = false;
newTodoImportant.addEventListener('click', ()=>{
    console.log(importantStatus);
    if (importantStatus){
        newTodoImportant.style.filter = 'invert(88%) sepia(11%) saturate(1248%) hue-rotate(315deg) brightness(102%) contrast(95%);';
    } else {
        newTodoImportant.style.filter =  'invert(70%) sepia(80%) saturate(675%) hue-rotate(310deg) brightness(116%) contrast(103%);';
    }
    importantStatus = !importantStatus;
});
newTodoBtn.on('click', createTodo);
newTodoInput.on('keydown', (e) => {
    if (e.which == 13) {
        createTodo();
    }
})
function clickPress(event) {
    if (event.keyCode == 13) {
        createTodo();
    }
}
function createTodo() {
    if (!!!newTodoInput.val()) return;
    var todo = new Todo(Object.keys(todos).length, newTodoInput.val());
    todo.draw();
    saveTodo(todo);
    newTodoInput.val('');
}
function getTodos(callback) {
    ext.get('todos', callback);
}
function saveTodo(todo) {
    todos[todo.id] = todo;
    ext.set({ 'todos': todos });
}
function deleteTodo(todo) {
    delete todos[todo.id];
    console.log(todos);
    ext.set({ 'todos': todos });
}

getTodos((data) => {
    console.log(data);
    Object.keys(data.todos).forEach((id) => {
        console.log(data.todos[id]);
        var todo = new Todo(id, data.todos[id].text, data.todos[id].time);
        todo.draw();
        todos[id] = { id: todo.id, text: todo.text, time: todo.time};
    });
});
