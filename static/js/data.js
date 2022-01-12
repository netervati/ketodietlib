const ctxPie = document.getElementById('pie-area').getContext('2d');
const ctxGauge = document.getElementById('gauge-area').getContext('2d');
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

const dispArray = [
    {el:document.getElementById('disp-fat'),pos:3,times:null,source:fat},
    {el:document.getElementById('disp-protein'),pos:3,times:null,source:protein},
    {el:document.getElementById('disp-carbs'),pos:3,times:null,source:carbs},
    {el:document.getElementById('disp-cal'),pos:3,times:null,source:cal},
    {el:document.getElementById('disp-fat-cal'),pos:3,times:9,source:fat},
    {el:document.getElementById('disp-protein-cal'),pos:3,times:4,source:protein},
    {el:document.getElementById('disp-carbs-cal'),pos:3,times:4,source:carbs},
];

let servingOption = document.getElementById('serving-option');
let servingNo = document.getElementById('serving-no');
let dispRating = document.getElementById('disp-rating')

document.getElementById('btn-serve').addEventListener('click',function(){
    let option = servingOption.value;
    let no = servingNo.value;
    updateData(option * no);
});

let gaugeDatasets = [{
    data: [parseFloat(Number(carbs.value)).toFixed(2), Number(carbLimit.value) - parseFloat(Number(carbs.value)).toFixed(2)],
    backgroundColor: [carbs_color[0], allow_color]
}];

let pieDatasets = [{
    data: [fat.value, carbs.value, protein.value],
    backgroundColor: [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
    
}];

const pieOptions = {
    type: 'pie',
    data: {
        labels: [
            'Fat',
            'Carbs',
            'Protein'
        ],
        datasets: pieDatasets
    },
    options: {
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'NUTRIENT COMPARISON',
                color: "black",
                font: {
                    size: 14
                }
            }
        }

    }
};

const gaugeOptions = {
    type: 'doughnut',
    data: {
        labels: ["Total Carbs", "Remaining Safe Consumption"],
        datasets: gaugeDatasets
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

const ketometer = new Chart(ctxGauge,gaugeOptions);
const nutrientdiv = new Chart(ctxPie,pieOptions);

function round(x) {
    return Math.ceil(x / colorDivider[carbLimit.value]) * colorDivider[carbLimit.value];
}

function decimal(value, pos, times){
    let multiplied = times != null ? Number(value) * times : Number(value);
    return parseFloat(multiplied).toFixed(pos);
}

function updateData(multiplier){

    carbs.value = Number(def_carbs.value) * multiplier;
    fat.value = Number(def_fat.value) * multiplier;
    protein.value = Number(def_protein.value) * multiplier;
    cal.value = Number(def_cal.value) * multiplier;

    for (let i = 0, total = dispArray.length; i < total; i++){
        let convData = decimal(dispArray[i].source.value,dispArray[i].pos,dispArray[i].times);
        dispArray[i].el.innerHTML = convData;
    }

    let carbsAllowed = Number(carbs.value) > Number(carbLimit.value) ? 0 : Number(carbLimit.value) - parseFloat(Number(carbs.value)).toFixed(2);
    let colorIndex = Number(carbs.value) > Number(carbLimit.value) ? 4 : Number( round(carbs.value))/colorDivider[carbLimit.value];

    gaugeDatasets = [{
        data: [decimal(carbs.value,2,null), carbsAllowed],
        backgroundColor: [carbs_color[colorIndex], allow_color]
    }];

    pieDatasets = [{
        data: [parseFloat(Number(fat.value)).toFixed(2), parseFloat(Number(carbs.value)).toFixed(2), parseFloat(Number(protein.value)).toFixed(2)],
        backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
        
    }];
    
    ketometer.data.datasets = gaugeDatasets
    ketometer.update();

    nutrientdiv.data.datasets = pieDatasets;
    nutrientdiv.update();

    ketoRating();
}

function ketoRating(){
    dispRating.innerHTML = "";
    if (servingOption.value != 1){
        let fatCarbs = fat.value / carbs.value;
        let carbsCarblimit = carbLimit.value / carbs.value ;
        const avg = (fatCarbs + carbsCarblimit) / 2;

        let badge = document.createElement('span');
        if (avg > 2){
            badge.classList.add('badge','bg-success');
            badge.innerHTML = "Good";
        }
        else if (avg > 1.6){
            badge.classList.add('badge','bg-warning'); 
            badge.innerHTML = "Acceptable";
        }
        else if (avg > 1.3){
            badge.classList.add('badge','bg-danger'); 
            badge.innerHTML = "Poor";
        }
        else{
            badge.classList.add('badge','bg-dark');
            badge.innerHTML = "Bad";
        }
        dispRating.append(badge);
    }
}
