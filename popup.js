var ext = chrome.extension.getBackgroundPage();
var todos = {};
var newTodoInput = $('#newTodoInput');
newTodoInput.focus();

var newTodoBtn = $('#newTodoBtn');
var newTodoImportant = document.querySelector('#newTodoImportant');
var newTodoUrgently = document.querySelector('#newTodoUrgently');
var importantStatus = false, urgentlyStatus = false;

newTodoImportant.addEventListener('click', ()=>{
    importantStatus = !importantStatus;

    if (importantStatus){
        newTodoImportant.classList.add('important-active')
    } else {
        newTodoImportant.classList.remove('important-active')
    } 
});

newTodoUrgently.addEventListener('click', ()=>{
    urgentlyStatus = !urgentlyStatus;
    
    if (urgentlyStatus){
        newTodoUrgently.classList.add('urgently-active')
    } else {
        newTodoUrgently.classList.remove('urgently-active')
    } 
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

function uniqId() {
    return Math.round(new Date().getTime() + (Math.random() * 100));
  }
function createTodo() {
    if (!!!newTodoInput.val()) return;

    if (importantStatus){
        newTodoImportant.classList.remove('important-active')
    }
    if (urgentlyStatus){
        newTodoUrgently.classList.remove('urgently-active')
    }

    var todo = new Todo(uniqId(), newTodoInput.val(), importantStatus, urgentlyStatus);
    todo.draw();
    saveTodo(todo);
    newTodoInput.val('');

    importantStatus = false;
    urgentlyStatus = false;
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
        var todo = new Todo(id, data.todos[id].text, data.todos[id].important, data.todos[id].urgently, data.todos[id].time);
        todo.draw();
        todos[id] = { id: todo.id, text: todo.text, important: todo.important, urgently: todo.urgently, time: todo.time};
    });
});

function autoheight(a) {
    if (!$(a).prop('scrollTop')) {
        do {
            var b = $(a).prop('scrollHeight');
            var h = $(a).height();
            $(a).height(h - 5);
        }
        while (b && (b != $(a).prop('scrollHeight')));
    };
    $(a).height($(a).prop('scrollHeight'));
}

$(document).on('input', '.todo-text', function (e) {
    var id = parseInt(this.closest('.todo').id.replace('todo_', ''));
    var todo = todos[id];
    todo.text = this.value;
    saveTodo(todo);
       
    autoheight($(this))
});
$(document).on('keypress', '.todo-text', function (e) {
    if(e.which == 13) e.preventDefault();
});


$(document).on('click', '.important:not(#newTodoImportant)', function (e) {
    var id = parseInt(this.closest('.todo').id.replace('todo_', ''));
    var todo = todos[id];

    todo.important = !todo.important;
    if (todo.important){
        this.classList.add('important-active');
    } else {
        this.classList.remove('important-active');
    }

    saveTodo(todo);
});

$(document).on('click', '.urgently:not(#newTodoUrgently)', function (e) {
    var id = parseInt(this.closest('.todo').id.replace('todo_', ''));
    var todo = todos[id];

    todo.urgently = !todo.urgently;
    if (todo.urgently){
        this.classList.add('urgently-active');
    } else {
        this.classList.remove('urgently-active');
    }

    saveTodo(todo);
});
