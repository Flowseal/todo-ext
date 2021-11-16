class Todo{
    constructor(id, text, time = new Date() / 1){
        this.id = id;
        this.text = text;
        this.time = time;
        this.important = false;
        this.urgently = false;
    }
    draw(){
        var html = document.getElementById('todoTemplate').innerHTML;
        var template = Handlebars.compile(html);

        var data = template({ id: this.id, text:this.text, time:date.format(new Date(this.time), 'MM dd hh:mm') });
        document.getElementById(`todos`).insertAdjacentHTML("beforeend", data);
        $(`#completeBtn_${this.id}`).on('click', ()=>{
            deleteTodo(this);
            this.delete();
        });
    }
    delete(){
        $(`#todo_${this.id}`).remove();
    }
}