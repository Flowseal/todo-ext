class Todo{
    constructor(id, text, important, urgently, time = new Date() / 1){
        this.id = id;
        this.text = text;
        this.time = time;
        this.important = important;
        this.urgently = urgently;
    }
    draw(){
        var html = document.getElementById('todoTemplate').innerHTML;
        var template = Handlebars.compile(html);

        var data = template({ id: this.id, text:this.text, time:date.format(new Date(this.time), 'MM dd hh:mm') });
        document.getElementById(`todos`).insertAdjacentHTML("beforeend", data);

        if (this.important){
            document.querySelector(`#todo_${this.id}`).querySelector('.important').classList.add('important-active');
        }
        if (this.urgently){
            document.querySelector(`#todo_${this.id}`).querySelector('.urgently').classList.add('urgently-active');
        }

        $(`#completeBtn_${this.id}`).on('click', ()=>{
            deleteTodo(this);
            this.delete();
        });
    }
    delete(){
        $(`#todo_${this.id}`).remove();
    }
}