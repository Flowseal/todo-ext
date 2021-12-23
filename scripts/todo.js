class Todo {
    constructor(id, project, text, important, urgently, time = new Date() / 1) {
        this.project = project;
        this.id = id;
        this.text = text;
        this.time = time;
        this.important = important;
        this.urgently = urgently;
        this.priority = 0;
        if (this.important){
            this.priority +=1;
        }
        if (this.urgently){
            this.priority +=1;
        }
    }
    draw() {
        var html = document.getElementById('todoTemplate').innerHTML;
        var template = Handlebars.compile(html);
        var data = template({ id: this.id, text: this.text, time: date.format(new Date(this.time), 'DD MMM YYYY') });
        document.querySelector('.todos').insertAdjacentHTML("beforeend", data);
        let todo = $(`#todo_${this.id}`);
        let importantEl = $(`#important_${this.id}`);
        let urgentlyEl = $(`#urgently_${this.id}`);
        let todoTextEl = $(`#text_${this.id}`);

        if (this.important) {
            importantEl.addClass('important-active');
        }
        if (this.urgently) {
            urgentlyEl.addClass('urgently-active');
        }
        importantEl.on('click', () => {
            this.important = !this.important;
            if (this.important) {
                importantEl.addClass('important-active');
            } else {
                importantEl.removeClass('important-active');
            }
            this.priority = 0;
            if (this.important){
                this.priority +=1;
            }
            if (this.urgently){
                this.priority +=1;
            }
            saveTodo(this);
        });
        urgentlyEl.on('click', () => {
            this.urgently = !this.urgently;
            if (this.urgently) {
                urgentlyEl.addClass('urgently-active');
            } else {
                urgentlyEl.removeClass('urgently-active');
            }
            this.priority = 0;
            if (this.important){
                this.priority +=1;
            }
            if (this.urgently){
                this.priority +=1;
            }
            saveTodo(this);
        });
        $(`#completeBtn_${this.id}`).on('click', () => {
            deleteTodo(this);
            this.delete();
        });
        this.autoheight();
        todoTextEl.on('input', ()=>{
            this.autoheight();
        }); 
        todoTextEl.on('change', ()=>{   
            if (!!!todoTextEl.val() || todoTextEl.val().length > 999){
                todo.addClass('todo-error');
                setTimeout(()=>{
                    todo.removeClass('todo-error');
                }, 1000);
                todoTextEl.val(this.text);
                this.autoheight();
                return;
            }
            this.text = todoTextEl.val();
            saveTodo(this);
        });
    }
    delete() {
        $(`#todo_${this.id}`).remove();
    }
    autoheight() {
        let todoText = $(`#text_${this.id}`);
        if (!todoText.prop('scrollTop')) {
            do {
                var b = todoText.prop('scrollHeight');
                var h = todoText.height();
                todoText.height(h - 5);
            }
            while (b && (b != todoText.prop('scrollHeight')));
        };
        todoText.height(todoText.prop('scrollHeight'));
    }
    hide(){
        let todo = $(`#todo_${this.id}`);
        todo.hide();
    }
    show(){
        let todo = $(`#todo_${this.id}`);
        todo.show();
    }
}