var doTask = document.getElementById('do-list');
var doneTask = document.getElementById('done-list');
var newtodo = document.getElementById('newtodo');
var deletetodo = document.getElementById('deletetodo');
var todoscale = document.getElementById('todoscale');
var donescale = document.getElementById('donescale');
var trash = document.getElementById('trash');
var allLi = document.querySelectorAll('li'); 
var globalArr =[];

function createNewElement(id,task,finished){
    var listItem = document.createElement('li');
    listItem.className = "item-list";
    listItem.id=id;
    var checkbox = document.createElement('button');
    checkbox.className = "checkbox";
    var label = document.createElement('label');
    label.innerText = task;
    label.className = "label-text";
    var input = document.createElement('input');
    input.type = "text";
    input.maxLength =40;
    if(finished){
        checkbox.classList.add('checked');
        listItem.classList.add('checkeditem');
    }
    var editButton = document.createElement('button');
    editButton.className = "edit";
    var cancelButton = document.createElement('button');
    cancelButton.className = "cancel";
    var deleteButton = document.createElement('button');
    deleteButton.className = "delete";

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(editButton);
    listItem.appendChild(cancelButton);
    listItem.appendChild(deleteButton);
     
    return listItem;
}

function addTask(){
    if(newtodo.value){
        var listItem=createNewElement(Date.now(),newtodo.value,false);
        doTask.appendChild(listItem);
        taskEvents(listItem,finishTask);
        newtodo.value='';
    }
    scaledraw();
    save();
}

newtodo.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        addTask();
    }
}); 
trash.onclick =  function (){ 
    while(doTask.firstChild){
        doTask.removeChild(doTask.firstChild)
    }while(doneTask.firstChild){
        doneTask.removeChild(doneTask.firstChild)
    }
    scaledraw();
    save();
};

function deleteTask(){
   var listItem = this.parentNode;
   var ul = listItem.parentNode;
   ul.removeChild(listItem);
   scaledraw();
   save();
}
function editTask(){ 
    var listItem =  this.parentNode;
    var label = listItem.querySelector('label');
    var labeltext = listItem.querySelector('label').innerText;
    var input = listItem.querySelector('input');
    input.classList.add('edit-mode-input');
    input.focus();
    var buttons = listItem.querySelectorAll('button');
    var editbut= buttons[1];
    var cancelbut = buttons[2];
    var data = labeltext;
    for(var i=1;i<buttons.length-1;i++){
        buttons[i].classList.add('edit-mode');
    }
    input.value=labeltext;
    label.innerText='';

    editbut.onclick = function(){
        label.innerText = input.value;
        input.value='';
        for(var i=1;i<buttons.length-1;i++){
            buttons[i].classList.remove('edit-mode');
        }
        input.classList.remove('edit-mode-input');
        save();
        
    };

    cancelbut.onclick = function(){
        labeltext = input.value;
        for(var i=1;i<buttons.length-1;i++){
            buttons[i].classList.remove('edit-mode');
        }
        input.classList.remove('edit-mode-input');
        label.innerText = data;
        save();
    };
    save();
}

function finishTask(){
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    if(!(checkbox.classList.contains('checked'))){
        checkbox.classList.add('checked');
        listItem.classList.add('checkeditem'); 
    }
    doneTask.appendChild(listItem);
    taskEvents(listItem,unfinishTask);
    scaledraw();
    save();     
}
function unfinishTask(){
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    if(checkbox.classList.contains('checked')){
        checkbox.classList.remove('checked');
        listItem.classList.remove('checkeditem'); 
    }
    doTask.appendChild(listItem);
    taskEvents(listItem,finishTask);
    scaledraw();
    save();
        
}
function taskEvents(listItem, checkboxEvent){
    var checkbox = listItem.querySelector('button.checkbox');
    var deleteButton = listItem.querySelector('button.delete');
    var labeltext= listItem.querySelector('label');

    checkbox.onclick = checkboxEvent;
    deleteButton.onclick = deleteTask;
    labeltext.ondblclick= editTask;

}
function scaledraw(){
    var doli = doTask.getElementsByClassName('item-list').length;
    var doneli = doneTask.getElementsByClassName('item-list').length; 

    todoscale.style.width = (doli*80)/(doli+doneli) + '%'; 
    donescale.style.width = (doneli*80)/(doli+doneli) + '%';  

    if(doli==0 && doneli==0){
        todoscale.style.width=0;
        donescale.style.width=0;
    }

}
function save(){
    globalArr=[];
    localStorage.removeItem('todo'); 
    for(var i =0; i<doTask.children.length;i++){
        globalArr.push({'id':doTask.children[i].id,'label':doTask.children[i].getElementsByTagName('label')[0].innerText,'list':false});
    }
    for(var i =0; i<doneTask.children.length;i++){
        globalArr.push({'id':doneTask.children[i].id,'label':doneTask.children[i].getElementsByTagName('label')[0].innerText,'list':true});
    }

    localStorage.setItem('todo',JSON.stringify(globalArr)); 
}
function load(){
    return  JSON.parse(localStorage.getItem('todo'));
}
var data = load();

for(var i =0; i<data.length;i++){
    if(data[i].list==false){
        var listItem = createNewElement(data[i].id,data[i].label,data[i].list);
        doTask.appendChild(listItem);
        taskEvents(listItem,finishTask); 
    }else{
        var listItem = createNewElement(data[i].id,data[i].label,data[i].list);
        doneTask.appendChild(listItem);
        taskEvents(listItem,unfinishTask); 
    }
    scaledraw();
} 


// function save(){
//     localStorage.removeItem('todo');
//     var unfinishArr =[];
//     for(var i =0; i<doTask.children.length;i++){
//         unfinishArr.push(doTask.children[i].getElementsByTagName('label')[0].innerText)
//     }

//     var finishArr=[];
//     for(var i =0; i<doneTask.children.length;i++){
//         finishArr.push(doneTask.children[i].getElementsByTagName('label')[0].innerText)
//     }

//     localStorage.setItem('todo',JSON.stringify({
//         doTask:unfinishArr,
//         doneTask:finishArr      
//     }));
// }

// function load(){
//     return  JSON.parse(localStorage.getItem('todo'));
// }
// var data = load();

// for(var i =0; i<data.doTask.length;i++){
//     var listItem = createNewElement(data.doTask[i],false);
//     doTask.appendChild(listItem);
//     taskEvents(listItem,finishTask); 
//     scaledraw();
// }
// for(var i =0; i<data.doneTask.length;i++){
//     var listItem = createNewElement(data.doneTask[i],true);
//     doneTask.appendChild(listItem);
    
//     taskEvents(listItem,unfinishTask); 
//     scaledraw();
// }