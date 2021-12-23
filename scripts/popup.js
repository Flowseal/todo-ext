const ext = chrome.extension.getBackgroundPage();
var todos = {
    today: {},
    coming: {},
    unsorted: {},
    archived: {}
};
var activeProject = 'Today';
var newTodoInput = $('#newTodoInput');
newTodoInput.focus();
var newTodoBtn = $('#newTodoBtn');
var newTodoImportant = $('#newTodoImportant');
var newTodoUrgently = $('#newTodoUrgently');
var importantStatus = false, urgentlyStatus = false;
var search = $('#search');
var newProjectBtn = $('#newProjectBtn');
var projectsBtn = $('#projectsBtn');
var projectsArrow = projectsBtn.find('img')
var selected = $('#sortBy');

selected.on('change', ()=>{
    var value = selected.val();
    openProject(activeProject, value);
});
projectsBtn.on('click', () => {
    var projects = $('.projects-block');
    if (projects.is(':visible')){
        projectsArrow.removeClass('rotate')
        projects.fadeTo( 200, 0 )
        projects.hide()   
    } else {
        projectsArrow.addClass('rotate')
        projects.fadeTo(200, 1)
        projects.show();
    }
});
newProjectBtn.on('click', () => {
    var projectName = prompt('Имя проекта: ');
    if (!!todos[projectName]){
        alert('Такой проект уже существует!');
        return;
    }
    if (!projectName){
        return;
    }
    if (!/^[a-zа-яA-ZА-Я0-9_ -№$@!]{3,16}$/.test(projectName) || projectName.includes('.') || projectName.includes(',')){
        alert('Название проекта содержит некорректные символы!');
        return;
    }
    if (projectName)
    if (!!projectName && projectName.length < 999) {
        todos[projectName] = {};
        ext.set({ 'todos': todos });
        $(`#projects`).prepend(`<li class="cursor menu-el project" id="${projectName.split(' ').join('')}ProjectBtn"><div><img src="./svgs/AlertCircle.svg"><span class="menu-txt">${projectName}</span></div><img id="${projectName.split(' ').join('')}ProjectDelete" class="menu-delete" src="./svgs/Bin.svg"></li>`);
        $(`#${projectName.split(' ').join('')}ProjectDelete`).hide();
        $(`#${projectName.split(' ').join('')}ProjectBtn`).hover(()=>{
            $(`#${projectName.split(' ').join('')}ProjectDelete`).show();
        }, ()=>{
            $(`#${projectName.split(' ').join('')}ProjectDelete`).hide();
        });
        $(`#${projectName.split(' ').join('')}ProjectDelete`).on('click', () => {
            if (confirm(`Вы действительно хотите удалить проект: ${projectName}`)){
                $(`#${projectName.split(' ').join('')}ProjectBtn`).remove();
                openProject('today', selected.val());
                delete todos[projectName];
                updateTodos();
            }
        });
        $(`#${projectName.split(' ').join('')}ProjectBtn`).on('click', ()=>{
            openProject(projectName, selected.val());
        });
    }
});
newTodoImportant.on('click', () => {
    importantStatus = !importantStatus;
    if (importantStatus) {
        newTodoImportant.addClass('important-active');
    } else {
        newTodoImportant.removeClass('important-active');
    }
});
newTodoUrgently.on('click', () => {
    urgentlyStatus = !urgentlyStatus;
    if (urgentlyStatus) {
        newTodoUrgently.addClass('urgently-active');
    } else {
        newTodoUrgently.removeClass('urgently-active');
    }
});
newTodoBtn.on('click', createTodo);
newTodoInput.on('keydown', (e) => {
    if (e.which == 13) {
        createTodo();
    }
});
search.on('input', doSearch);
function doSearch() {
    console.log(activeProject);
    if (activeProject == 'unsorted'){
        console.log('!');
        for (var i of Object.keys(todos)) {
            for (var j of Object.keys(todos[i])){
                if (todos[i][j].text.toLowerCase().includes(search.val().toLowerCase())) {
                    todos[i][j].show();
                } else {
                    todos[i][j].hide();
                }
            }
        }
        return;
    }
    for (var i of Object.keys(todos[activeProject])) {
        if (todos[activeProject][i].text.toLowerCase().includes(search.val().toLowerCase())) {
            //console.log(activeProject, i)
            todos[activeProject][i].show();
        } else {
            todos[activeProject][i].hide();
        }
    }
}
function createTodo() {
    if (!!!newTodoInput.val()) return;
    if (newTodoInput.val().length > 999) {
        newTodoInput.addClass('todo-error');
        setTimeout(() => {
            newTodoInput.removeClass('todo-error');
        }, 1000);
        newTodoInput.val('');
        return;
    }
    if (importantStatus) {
        newTodoImportant.removeClass('important-active');
    }
    if (urgentlyStatus) {
        newTodoUrgently.removeClass('urgently-active');
    }
    var date = new Date($('body > div.main > div.content > div.todos-block > div.todo-new > input.calendar').val()) / 1;
    if (!!!date){
        date = new Date() / 1;
    }
    console.log(date);
    var todo = new Todo(getUniqId(), activeProject, newTodoInput.val(), importantStatus, urgentlyStatus, date);
    todo.draw();
    saveTodo(todo);
    newTodoInput.val('');
    importantStatus = false;
    urgentlyStatus = false;
}
function getUniqId() {
    return Math.round(new Date().getTime() + (Math.random() * 100));
}
function saveTodo(todo) {
    try {
        todos[todo.project][todo.id] = todo;
        var todosToSave = {};
        updateTodos();
    } catch (err) {
        console.log(`Не смогли сохранить туду! ` + err);
    }
}
function deleteTodo(todo) {
    todos.archived[todo.id] = todo;
    delete todos[todo.project][todo.id];
    updateTodos();
}
function updateTodos(){
    var todosToSave = {};
    for (var i of Object.keys(todos)){
        if (!todosToSave[i]){
            todosToSave[i] = {};
        }
        for (var id of Object.keys(todos[i])){
            var todo = todos[i][id];
            todosToSave[i][id] = {id:todo.id, prject: todo.project, text: todo.text, important: todo.important, urgently: todo.urgently, time: todo.time};
        }
    }
    ext.set({ 'todos': todosToSave });
}
function openProject(projectName, sortBy) {
    if (projectName == 'archived' || projectName == 'unsorted'){
        $('.todo-new').hide();
    } else {
        $('.todo-new').show();
    }
    activeProject = projectName;
    ext.set({'activeProject':activeProject});
    //console.log(`Открываю проект ${projectName}`);
    for (let i of Object.keys(todos)){
        $(`#${i.split(' ').join('')}ProjectBtn`).removeClass('menu-el_selected');
    }
    $(`#${projectName.split(' ').join('')}ProjectBtn`).addClass('menu-el_selected');
    for (var i of Object.keys(todos)) {
        for (var id of Object.keys(todos[i])) {
            todos[i][id].delete();
        }
    }
    var todosToDraw = [];
    if (projectName == 'unsorted'){
        for (var i of Object.keys(todos)) {
            if (i == 'archived') continue;
            for (var j of Object.keys(todos[i])){
                todosToDraw.push(todos[i][j]);
                //todos[i][j].draw();
            }
        }
    } else if (projectName == 'today') {
        var now = new Date();
        for (var i of Object.keys(todos)) {
            if (i == 'archived') continue;
            for (var j of Object.keys(todos[i])){
                var time = new Date(todos[i][j].time);
                if (time.toDateString() == now.toDateString()){
                    todosToDraw.push(todos[i][j]);
                    //todos[i][j].draw();
                }
            }
        }
    } else if (projectName == 'coming') {
        var now = new Date();
        for (var i of Object.keys(todos)) {
            if (i == 'archived') continue;
            for (var j of Object.keys(todos[i])){
                var time = new Date(todos[i][j].time);
                if (time >= new Date(now.toDateString()) / 1 + 86400000){
                    todosToDraw.push(todos[i][j]);
                    //todos[i][j].draw();
                }
            }
        }
    } else {
        for (var id of Object.keys(todos[projectName])) {
            todosToDraw.push(todos[projectName][id]);
            //todos[projectName][id].draw();
        }
    }
    todosToDraw = todosToDraw.sort((a, b)=>{
        return a.time > b.time ? 1 : -1;
    });
    if (sortBy == 'important' || sortBy == 'urgently'){
        todosToDraw = todosToDraw.sort((a, b)=>{
            return a[sortBy] > b[sortBy] ? -1 : 1;
        });
        var buf = [];
        for (var i of todosToDraw){
            if (i[sortBy]){
                buf.push(i);
            }
        }
        todosToDraw = buf;
    } else {
        todosToDraw = todosToDraw.sort((a, b)=>{
            if (sortBy == 'time'){
                return a[sortBy] > b[sortBy] ? 1 : -1;
            }
            return a[sortBy] > b[sortBy] ? -1 : 1;
        });
    }
    for (var i of todosToDraw){
        i.draw();
    }
    $('#category_span').html(projectName[0].toUpperCase() + projectName.slice(1));
    doSearch();
}

loadData();
function loadData() {
    ext.get('todos', (data) => {
        if (!data.todos) {
            ext.set({ todos: todos, activeProject: 'today' }, loadData);
            return;
        }
        console.log(data);
        console.log(todos);
        for (let i of Object.keys(data.todos)) {
            console.log(i);
            if (!!!todos[i]) {
                console.log(`Отрисовываю ${i}`)
                todos[i] = {};
                $(`#projects`).prepend(`<li class="cursor menu-el project" id="${i.split(' ').join('')}ProjectBtn"><div><img src="./svgs/AlertCircle.svg"><span class="menu-txt">${i}</span></div><img id="${i.split(' ').join('')}ProjectDelete" class="menu-delete" src="./svgs/Bin.svg"></li>`);
            }
            $(`#${i.split(' ').join('')}ProjectBtn`).on('click', () => {
                openProject(i, selected.val());
            });
            $(`#${i.split(' ').join('')}ProjectDelete`).hide();
            $(`#${i.split(' ').join('')}ProjectBtn`).hover(()=>{
                $(`#${i.split(' ').join('')}ProjectDelete`).show();
            }, ()=>{
                $(`#${i.split(' ').join('')}ProjectDelete`).hide();
            });
            $(`#${i.split(' ').join('')}ProjectDelete`).on('click', () => {
                if (confirm(`Вы действительно хотите удалить проект: ${i}`)){
                    $(`#${i.split(' ').join('')}ProjectBtn`).remove();
                    openProject('today');
                    delete todos[i];
                    ext.set({todos:todos});
                }
            });
            for (var id of Object.keys(data.todos[i])) {
                console.log(id);
                var todo = new Todo(id, i, data.todos[i][id].text, data.todos[i][id].important, data.todos[i][id].urgently, data.todos[i][id].time);
                //todo.draw();
                todos[i][id] = todo;
            }
        }
        console.log(todos);
        ext.get('activeProject', (data) => {
            openProject(data.activeProject, selected.val());
        });
    });

}
