const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay= document.querySelector("[data-lengthNumber]");
const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numberCheck= document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength= 10;
let checkCount = 0;

handleSlider(); 
//set strength cirlce to grey
setIndicator("#ccc");

// set password length
function handleSlider() {
     inputSlider.value = passwordLength;
     lengthDisplay.innerHTML= passwordLength;
     const min = inputSlider.min;
     const max = inputSlider.max;
     inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
     
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
     
}

function getRndInteger(min , max){
   return  Math.floor(Math.random() * (max-min)) + min;

}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));  // fromCharCode = Int-> String
}
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));  // fromCharCode = Int-> String
}

function generateSymbol() {

    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);

}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
   try{

    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerHTML="copied";

   }
   catch(e) {
    copyMsg.innerHTML = "Failed";
   }
   // to make copy wala span visible

   copyMsg.classList.add("active");

   setTimeout( () => {
    copyMsg.classList.remove("active");
   },2000); 

 
}

function shufflePassword(array) {
    // Fisher Yates method for shuffling the password
    for (let i= array.length-1 ; i> 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i]= array[ j];
        array[j] = temp;
    }
    let str="";
    array.forEach((el) => (str +=el));
    return str;  


}

function handleCheckBoxChange() {
    checkCount=0;
    allCheckBox.forEach( (checkbox)=> {
        if(checkbox.checked)
        checkCount++;
    });

    //special condition to have min value of password based on the checkbox
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}


allCheckBox.forEach( (checkbox)=> {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e)=> {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

// MOST IMPORTANT FUNCTION
generateBtn.addEventListener('click', () => {

    // when no checkbox is checked
    if(checkCount == 0)
     return;
    
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();

    }

    // Let's start the journy to find new password

    console.log("starting the journy");

    // remove old password

    password="";
     
    // let's add cond of checkbox

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }


    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

        // compulsory addition

        for( let i=0 ; i< funcArr.length; i++){
            password += funcArr[i]();
        }

        console.log("compulsory addition done");

        // remaining addition
        for(let i = 0; i< passwordLength- funcArr.length ; i++){
            let randIndex = getRndInteger( 0 ,funcArr.length);
            console.log("randIndex" + randIndex);
            password += funcArr[randIndex]();
        }

        console.log("remaing addition done");

        // shuffle the password
        password = shufflePassword(Array.from(password));
        console.log("shuffle done");
        // show in UI
        passwordDisplay.value= password;
        console.log("display done");
        // calculate strength based on the new genrated password
        calcStrength();



});
