var ext = chrome.extension.getBackgroundPage();
var todos = [];
var newTodoInput = $('#newTodoInput');
var newTodoBtn = $('#newTodoBtn');

newTodoBtn.on('click', ()=>{
    if (!!!newTodoInput.val()) return;
    var todo = new Todo(newTodoInput.val());
    todo.draw();
    saveTodo(todo);
});

function getTodos(callback){
    ext.get('todos', callback);
}
function saveTodo(todo){
    todos.push(todo);
    ext.set({'todos':todos});
}
function deleteTodo(todo){
    todos
}

getTodos((data)=>{
    for (var i of data.todos){
        var todo = new Todo(i.text);
        todo.draw();
        todos.push(todo);
    }
});
//var todo = new Todo('абобик');
//saveTodo(todo);