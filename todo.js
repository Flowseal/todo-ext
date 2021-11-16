class Todo{
    constructor(text){
        this.text = text;
        this.time = new Date();
        this.important = false;
        this.urgently = false;
    }
    draw(){
        var html = document.getElementById('todoTemplate').innerHTML;
        var template = Handlebars.compile(html);
        var data = template({ text:this.text, time:this.time });
        document.getElementById(`todos`).insertAdjacentHTML("beforeend", data);
    }
    delete(){

    }
}