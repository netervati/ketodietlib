let numprop = document.getElementById('numProp');
let titleflip = document.getElementsByClassName('title-flip');
let texttrigger = document.getElementById('text-trigger');
let initialsplash = document.getElementById('initial-splash');
let titlesecond = document.getElementById('title-second');
let curVal = 0;
let lapse = 0;
let speed = 100;
let start;

function numTransition(timeinterval){
    if (start == null){
        start = timeinterval
    }
    let elapsed = timeinterval - start;
    
    if (lapse > 20){
        curVal += 0.25;
        start = timeinterval;
        numprop.innerHTML = parseFloat(curVal).toFixed(2) +" g";
        console.log(true);
    }
    else if (elapsed >= speed){
        curVal += 0.05;
        start = timeinterval;
        numprop.innerHTML = parseFloat(curVal).toFixed(2) +" g";
        if(lapse >= 20){
            if (speed > 6)
                speed = 1;
        }
        else if(lapse >= 3){
            if (speed > 57)
                speed = 35;
        }
        lapse++;
    }
    if (curVal < 26.55){
        requestAnimationFrame(numTransition);
    }
    else{
        titlesecond.classList.add('show');
    }
}

texttrigger.addEventListener('click',function(){
    for (let x = 0, total = titleflip.length; x < total; x++){
        titleflip[x].classList.remove('show');
    }
    setTimeout(function(){
        initialsplash.innerHTML = "";
        numprop.classList.add('show');
        requestAnimationFrame(numTransition);
    },1000);
});