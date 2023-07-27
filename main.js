let siteVol = 15000;

//Box type constructor
function BoxType(
  name,
  productID,
  maxPalletSpace,
  palletEaches,
  percentUse,
  currentPalletQty
) {
  this.name = name;
  this.productID = productID;
  this.maxPalletSpace = maxPalletSpace;
  this.palletEaches = palletEaches;
  this.percentUse = percentUse;
  this.currentPalletQty = currentPalletQty;
  this.daysOnHand = () => {
    let result =
      (this.palletEaches * this.currentPalletQty) / (siteVol * this.percentUse);
    return result.toFixed(2);
  };
  this.dailyRunRate = () => {
    let result = siteVol * this.percentUse;
    return result.toFixed(2);
  };
  this.weekend = () => {
    let result =
      (this.palletEaches * this.currentPalletQty) /
        (siteVol * this.percentUse) -
      3;
    return result.toFixed(2);
  };
  this.vacantSpace = () => {
    return maxPalletSpace - Math.round(this.currentPalletQty);
  };
}

const boxArray = [];

//Function to push new objects to boxArray
function addBoxObject(
  name,
  productID,
  maxPalletSpace,
  palletEaches,
  percentUse,
  currentPalletQty
) {
  let item = new BoxType(
    name,
    productID,
    maxPalletSpace,
    palletEaches,
    percentUse,
    currentPalletQty
  );
  boxArray.push(item);
}

//Box elements pushed to boxArray, to be added into DOM (example data below)
addBoxObject("Type 1", "box1", 10, 500, 0.0010, 0);
addBoxObject("Type 2", "box2", 5, 1800, 0.050, 0);
addBoxObject("Type 3", "box3", 7, 1000, 0.20, 0);


//Generate app elements
const appContainer = document.querySelector(".app-container");
const metricsContainer = document.querySelector(".metrics-container")
const inputArea = document.getElementsByTagName('input');
const submitBtn = document.querySelector(".submit__btn");
window.addEventListener("DOMContentLoaded", function () {
  displayBoxType(boxArray);
  inputConfirm(inputArea);
});
submitBtn.addEventListener("click", () => {
  calculatedBoxMetrics(boxArray);
});

//Display box objects in DOM
const displayBoxType = (item) => {
  let displayEach = item.map(function (item) {
    return `<div class="box-type bg-red grid grid__input gap">
        <h2 class="box-title">BOX <span class="box-number">${item.name}</span></h2>
        <h2 class="box-cor">${item.productID}</h2>
        <input type="text" placeholder="Insert Pallet Count Here (e.g. 0.75)" value="" class="box-input">
        </div>`;
  });
  displayEach = displayEach.join("");
  appContainer.innerHTML = displayEach;
}

//Box object color change on input & update each currentPalletQty
const inputConfirm = (trigger) => {
  for (let i = 0; i < trigger.length; i++) {
    trigger[i].addEventListener("change", () => {
      if (countValidate(trigger[i].value)) {
        trigger[i].setAttribute("value", `${trigger[i].value}`);
        trigger[i].parentElement.classList.replace("bg-red", "bg-green");
        let newVal = trigger[i].getAttribute("value");
        boxArray[i].currentPalletQty = newVal;
      } else {
        trigger[i].setAttribute("value", "");
        trigger[i].parentElement.classList.replace("bg-green", "bg-red");
      }
    });
  }
};

//Regex validation function for input
const countValidate = (inputField) => {
  let inputRegex = /[+]?([0-9]*[.])?[0-9]+/g;
  let result = inputRegex.test(inputField);
  return result == true ? inputField : null;
};

//Dynamically update object property pallet count via array
const updateCurrentPalletQty = () => {
  for(let i = 0 ; i< boxArray.length; i++){
    return boxArray[i].currentPalletQty = inputArea[i].value;
  }
}

const calculatedBoxMetrics = (item) => {
  let displayMetrics = item.map(function(item) {
    if (item.currentPalletQty > 0){
    return `<div class="metrics-card flex flex-col gap">
    <div class="flex metrics-card__header gap">
      <h1>BOX ${item.name}</h1>
      <h1>${item.productID}</h1>
    </div>
    <div class="metrics-card__content flex flex-col flex-center gap">
      <div class="metrics-data__container flex">
        <h2 class="metrics-data">${item.daysOnHand()}</h2>
        <h2 class="metrics-label"> Days On Hand</h2>
      </div>
      <div class="metrics-data__container flex">
        <h2 class="metrics-data">${item.vacantSpace()}</h2>
        <h2 class="metrics-label"> Spaces Available</h2>
      </div>
      ${placementCheck(item.vacantSpace())}
    </div>
  </div>`
  }
})
  displayMetrics = displayMetrics.join("");
  metricsContainer.innerHTML = displayMetrics;
}


const placementCheck = (val) => {
  if (val <= 0){
    return `<h2 class="metrics-alert warning">Place In Overflow</h2>`
  } else {
    return `<h2 class="metrics-alert success">Place Inside</h2>`
  }
}


