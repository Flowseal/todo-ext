var ext = chrome.extension.getBackgroundPage();
var todos = {};
var newTodoInput = $('#newTodoInput');
var newTodoBtn = $('#newTodoBtn');
newTodoInput.focus();

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
