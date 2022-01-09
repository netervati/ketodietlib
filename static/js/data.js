const ctxDonut = document.getElementById('donut-area').getContext('2d');
let carbs_color = ["#4db063","#99ca4c","#fbad19","#f37321","#ee2524"];
let allow_color = "#babfc0";
let carbLimit = document.getElementById('serving-limit');
let colorDivider = {'20':5,'30':8,'40':10,'50':12}

let def_fat = document.getElementById('def-fat');
let def_protein = document.getElementById('def-protein');
let def_carbs = document.getElementById('def-carbs');
let def_cal = document.getElementById('def-cal');

let fat = document.getElementById('fat');
let protein = document.getElementById('protein');
let carbs = document.getElementById('carbs');
let cal = document.getElementById('cal');

let disp_fat = document.getElementById('disp-fat');
let disp_protein = document.getElementById('disp-protein');
let disp_carbs = document.getElementById('disp-carbs');
let disp_cal = document.getElementById('disp-cal');

let disp_fat_cal = document.getElementById('disp-fat-cal');
let disp_protein_cal = document.getElementById('disp-protein-cal');
let disp_carbs_cal = document.getElementById('disp-carbs-cal');

document.getElementById('btn-serve').addEventListener('click',function(){
    let option = document.getElementById('serving-option').value;
    let no = document.getElementById('serving-no').value;
    updateData(option * no);
});

let dataSets = [{
    data: [parseFloat(Number(carbs.value)).toFixed(2), Number(carbLimit.value) - parseFloat(Number(carbs.value)).toFixed(2)],
    backgroundColor: [carbs_color[0], allow_color]
}];

const options = {
    type: 'doughnut',
    data: {
        labels: ["Total Carbs", "Remaining Safe Consumption"],
        datasets: dataSets
    },
    options: {
        rotation: 270,
        circumference: 180,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'KETOMETER',
                color: "black",
                font: {
                    size: 14
                }
            }
        }

    }
}

const myChart = new Chart(ctxDonut,options);

function round(x) {
    return Math.ceil(x / colorDivider[carbLimit.value]) * colorDivider[carbLimit.value];
}

function updateData(multiplier){

    carbs.value = Number(def_carbs.value) * multiplier;
    fat.value = Number(def_fat.value) * multiplier;
    protein.value = Number(def_protein.value) * multiplier;
    cal.value = Number(def_cal.value) * multiplier;
    
    disp_carbs.innerHTML = parseFloat(Number(carbs.value)).toFixed(3);
    disp_fat.innerHTML = parseFloat(Number(fat.value)).toFixed(3);
    disp_protein.innerHTML = parseFloat(Number(protein.value)).toFixed(3);
    disp_cal.innerHTML = parseFloat(Number(cal.value)).toFixed(3);

    disp_carbs_cal.innerHTML = parseFloat(Number(carbs.value) * 4).toFixed(3);
    disp_fat_cal.innerHTML = parseFloat(Number(fat.value) * 9).toFixed(3);
    disp_protein_cal.innerHTML = parseFloat(Number(protein.value) * 4).toFixed(3);

    let carbsAllowed = Number(carbs.value) > Number(carbLimit.value) ? 0 : Number(carbLimit.value) - parseFloat(Number(carbs.value)).toFixed(2);
    let colorIndex = Number(carbs.value) > Number(carbLimit.value) ? 4 : Number( round(carbs.value))/colorDivider[carbLimit.value];
    dataSets = [{
        data: [parseFloat(Number(carbs.value)).toFixed(2), carbsAllowed],
        backgroundColor: [carbs_color[colorIndex], allow_color]
    }];
    
    myChart.data.datasets = dataSets
    myChart.update();
}
