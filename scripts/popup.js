const ext = chrome.extension.getBackgroundPage();
var todos = {
    Today: {},
    Coming: {},
    School: {},
    Work: {},
    Other: {}
};
var activeProject = 'Today';
var oldTodos = {};
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

projectsBtn.on('click', ()=>{
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
newProjectBtn.on('click', ()=>{
    prompt('Хотите создать новый проект?');
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
function doSearch(){
    for (var i of Object.keys(todos[activeProject])) {
        if (todos[activeProject][i].text.toLowerCase().includes(search.val().toLowerCase())) {
            console.log(activeProject, i)
            todos[activeProject][i].show();
        } else {
            todos[activeProject][i].hide();
        }
    }
}
function createTodo() {
    if (!!!newTodoInput.val()) return;
    if (newTodoInput.val().length > 999){
        newTodoInput.addClass('todo-error');
        setTimeout(()=>{
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
    var todo = new Todo(getUniqId(), activeProject, newTodoInput.val(), importantStatus, urgentlyStatus);
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
    try{
        todos[todo.project][todo.id] = todo;
        ext.set({ 'todos': todos });
    } catch (err){
        console.log(`Не смогли сохранить туду! ` + err);
    }
}
function deleteTodo(todo) {
    oldTodos[todo.id] = todo;
    delete todos[todo.project][todo.id];
    ext.set({ 'todos': todos });
    ext.set({ 'oldTodos': oldTodos });
}
function openProject(projectName) {
    activeProject = projectName;
    for (var i of Object.keys(todos)){
        $(`#${i}ProjectBtn`).removeClass('type_btn_selected');
        for (var id of Object.keys(todos[i])) {
            todos[i][id].delete();
        }
    }
    $(`#${projectName}ProjectBtn`).addClass('type_btn_selected');
    for (var id of Object.keys(todos[projectName])) {
        todos[projectName][id].draw();
    }
    $('#category_span').html(projectName);
    doSearch();
}
loadData();
function loadData(){
    ext.get('todos', (data) => {
        if (!data.todos || !data.todos.Today || !data.todos.Coming){
            ext.set({todos:{Today:{}, Coming:{}}, activeProject:'Today'}, loadData);
            return;
        }
        for (var i of Object.keys(data.todos)) {
            var projectTodos = data.todos[i];
            if (!!!todos[i]) todos[i] = {};
            for (var id of Object.keys(projectTodos)) {
                console.log(id);
                var todo = new Todo(id, i, projectTodos[id].text, projectTodos[id].important, projectTodos[id].urgently, projectTodos[id].time);
                //todo.draw();
                todos[i][id] = todo;
            }
        }
        for (let i of Object.keys(todos)){
            $(`#${i}ProjectBtn`).on('click', ()=>{
                openProject(i);
            });
        }
        ext.get('activeProject', (data) => {
            openProject(data.activeProject);
            console.log(data);
        });
        console.log(todos);
    });
    
}
