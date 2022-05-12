window.onload = function () {
    tabButtons = document.getElementsByClassName("tablinks");
    for(let i=0; i < tabButtons.length; i++){
        tabButtons[i].addEventListener("click",function(event){
            openTab(event, tabButtons[i].dataset.tab);
        });
    }
    document.getElementById("defaultTab").click();
}

function openTab(event,tabName){
    console.log(tabName);
    let tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for(let i = 0; i < tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for(let i = 0; i < tablinks.length; i++){
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}