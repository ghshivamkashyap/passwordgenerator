const inputslider = document.querySelector("[data-length-slider]");
const lengthdiaplay = document.querySelector("[data-length-number]");
const passworddisplay = document.querySelector("[data-password-display]");
const copybtn = document.querySelector("[datacopy]");
const copymsg = document.querySelector("[data-copy-msg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numberscheck = document.querySelector("#numbers");
const symbolscheck = document.querySelector("#symbols");
const indicator = document.querySelector("[indicator]");
const genratebtn = document.querySelector(".genratebtn");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^&*()_-+=~`/*+.|{}[]:;";
// console.log(symbols.length); 27 symbols hai isme

let password = "";
let passwordlength = 10;
let checkcount = 1;
// set indicator color to grey

// slider ka function
handleslider();
function handleslider() {
  // inputslider.value=passwordlength;
  inputslider.value = passwordlength;
  // lengthdiaplay.innerText=passwordlength;
  lengthdiaplay.innerText = passwordlength;

  const min=inputslider.min;
  const max=inputslider.max;
  inputslider.style.backgroundSize=((passwordlength-min)*100/(max-min)) + "% 100%"

}

// indicator light ka function

function setindicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = "10px 20px 30px blue";

}

// random intiger genrate kralo bhai

function getrandintiger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// random number function

function genraterandnum() {
  return getrandintiger(0, 9);
}

// random lowercase alphabet  function

function genratelowercase() {
  return String.fromCharCode(getrandintiger(97, 123));
}

// random uppercase alphabet function

function genrateuppercase() {
  return String.fromCharCode(getrandintiger(65, 90));
}

// random symbol genrate function

function getrandsymbol() {
  return symbols.charAt(getrandintiger(0, symbols.length));
}

// console.log(symbols.charAt(getrandintiger(0, symbols.length)));

// calculatestrength vala function for indicator

function calcstrength() {
  let hasupper = false;
  let hasnum = false;
  let hassym = false;
  let haslower = false;

  if (uppercasecheck.checked) hasupper = true;
  if (lowercasecheck.checked) haslower = true;
  if (symbolscheck.checked) hassym = true;
  if (numberscheck.checked) hasnum = true;

  if (hasupper && haslower && (hasnum || hassym) && passwordlength >= 8) {
    setindicator("#0f0");
  } else if (
    (hasupper || haslower) &&
    (hasnum || hassym) &&
    passwordlength >= 6
  ) {
    setindicator("#ff0");
  } else {
    setindicator("#f00");
  }
}

// copy to clipboard wala function

async function copycontent() {
  try {
    await navigator.clipboard.writeText(passworddisplay.value);
    copymsg.innerText = "Copied..";
  } catch {
    copymsg.innerText = "Failed..";
  }

  //   to make copy vala span visible
  copymsg.classList.add("active");

  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 1000);
}

// shuffle password function

function shufflepassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// slider eventlistner
inputslider.addEventListener("input", (e) => {
  passwordlength = e.target.value;
  handleslider();
});

// copy btn eventlistner
copybtn.addEventListener("click", () => {
  if (passworddisplay.value) {
    copycontent();
  }
});

// handlecheckboxchange vala function to keep count of checkbox

function handlecheckboxchange() {
  checkcount = 0;
  allcheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkcount++;
    }
  });

  //   special case if password length is lett the check count
  if (passwordlength < checkcount) {
    passwordlength = checkcount;
    handleslider();
  }
}

// checkbox ka count ka eventlister

allcheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handlecheckboxchange);
});

// genratepassword btn eventlistner

genratebtn.addEventListener("click", () => {
  if (checkcount <= 0) return;

  if (passwordlength < checkcount) {
    passwordlength = checkcount;
    handleslider();
  }

  console.log("starting the journey");

  //   new passwordwala logic
  //   1 old password remove kar do
  password = "";

  //   add stuff in password according to checkboxes
  let fsnarr = [];
  if (uppercasecheck.checked) {
    fsnarr.push(genrateuppercase);
  }

  if (lowercasecheck.checked) {
    fsnarr.push(genratelowercase);
  }

  if (numberscheck.checked) {
    fsnarr.push(genraterandnum);
  }

  if (symbolscheck.checked) {
    fsnarr.push(getrandsymbol);
  }

  // compercery adition kar lo

  for (let i = 0; i < fsnarr.length; i++) {
    password += fsnarr[i]();
  }

  console.log("compersery adition done");

  // remaining adition kar lo randomly
  for (let i = 0; i < passwordlength - fsnarr.length; i++) {
    let randidx = getrandintiger(0, fsnarr.length);
    password += fsnarr[randidx]();
  }

  console.log("remaning adition done");

  // shuffle the password

  password = shufflepassword(Array.from(password));

  console.log("shuffeling done");

  // password show in ui

  passworddisplay.value = password;
  console.log("ui updation done");
  // calculate strength now of genrated oassword

  calcstrength();
});
