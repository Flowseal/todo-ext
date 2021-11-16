class Todo{
    constructor(text){
        this.text = text;
        this.time = new Date();
        this.important = false;
        this.urgently = false;
        this.el = $(``)
    }
    draw(){
        var html = document.getElementById('todoTemplate').innerHTML;
        var template = Handlebars.compile(html);
        console.log()
        var data = template({ text:this.text, time:date.format(this.time, 'MM dd hh:mm') });
        document.getElementById(`todos`).insertAdjacentHTML("beforeend", data);
    }
    delete(){
        
    }
}