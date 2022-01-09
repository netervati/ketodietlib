let elements = document.getElementsByClassName("btn-nav");
let pagefield = document.getElementById('page');
let searchbar = document.getElementById('search-bar');
let returntotal = document.getElementById('returntotal');

var myFunction = function() {
    let pageVal = Number(pagefield.value);
    if (this.getAttribute('data-flip') == 0){
        if (pageVal > 1){
            pagefield.value = pageVal - 1;
            searchbar.submit()
        }
    }
    else if (this.getAttribute('data-flip') == 1){
        if (returntotal.value == 5){
            pagefield.value = pageVal + 1;
            searchbar.submit()
        }
    }
};

for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', myFunction, false);
}