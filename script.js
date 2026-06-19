const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("strength-text");
const strengthBar = document.getElementById("strength-bar");

const lengthScore = document.getElementById("lengthScore");
const entropyScore = document.getElementById("entropyScore");
const riskLevel = document.getElementById("riskLevel");
const crackTime = document.getElementById("crackTime");

const recommendations = document.getElementById("recommendations");
const historyList = document.getElementById("history");

const togglePassword = document.getElementById("togglePassword");
const generateBtn = document.getElementById("generateBtn");
const themeToggle = document.getElementById("themeToggle");

const commonPasswords = [
"123456",
"password",
"qwerty",
"admin123",
"welcome"
];

passwordInput.addEventListener("input", checkPassword);

function checkPassword(){

let password=passwordInput.value;
let score=0;

let upper=/[A-Z]/.test(password);
let lower=/[a-z]/.test(password);
let number=/[0-9]/.test(password);
let special=/[!@#$%^&*]/.test(password);
let length=password.length>=8;
let breached=commonPasswords.includes(password.toLowerCase());

updateRule("length",length);
updateRule("uppercase",upper);
updateRule("lowercase",lower);
updateRule("number",number);
updateRule("special",special);
updateRule("breached",!breached);

if(length)score++;
if(upper)score++;
if(lower)score++;
if(number)score++;
if(special)score++;
if(!breached)score++;

lengthScore.textContent=password.length;

let entropy=calculateEntropy(password);
entropyScore.textContent=entropy+" bits";

crackTime.textContent=estimateTime(entropy);

strengthBar.className="";

if(score<=2){
strengthText.textContent="Weak";
riskLevel.textContent="High";
strengthBar.classList.add("weak");
strengthBar.style.width="30%";
}
else if(score<=4){
strengthText.textContent="Medium";
riskLevel.textContent="Medium";
strengthBar.classList.add("medium");
strengthBar.style.width="60%";
}
else if(score===5){
strengthText.textContent="Strong";
riskLevel.textContent="Low";
strengthBar.classList.add("strong");
strengthBar.style.width="85%";
}
else{
strengthText.textContent="Very Strong";
riskLevel.textContent="Very Low";
strengthBar.classList.add("very-strong");
strengthBar.style.width="100%";
}

showRecommendations(password,upper,lower,number,special,length);
saveHistory(password);
}

function updateRule(id,status){
const item=document.getElementById(id);

if(status){
item.classList.add("valid");
}
else{
item.classList.remove("valid");
}
}

function calculateEntropy(password){
if(password.length===0)return 0;
return Math.round(password.length*5);
}

function estimateTime(entropy){

if(entropy<20)return "Seconds";
if(entropy<40)return "Hours";
if(entropy<60)return "Months";

return "Years";
}

function showRecommendations(password,upper,lower,number,special,length){

recommendations.innerHTML="";

if(!length)addRec("Use at least 8 characters");
if(!upper)addRec("Add uppercase letters");
if(!lower)addRec("Add lowercase letters");
if(!number)addRec("Add numbers");
if(!special)addRec("Add special characters");
}

function addRec(text){
let li=document.createElement("li");
li.textContent=text;
recommendations.appendChild(li);
}

togglePassword.addEventListener("click",()=>{

if(passwordInput.type==="password"){
passwordInput.type="text";
}
else{
passwordInput.type="password";
}

});

generateBtn.addEventListener("click",()=>{

const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

let pass="";

for(let i=0;i<16;i++){
pass+=chars.charAt(
Math.floor(Math.random()*chars.length)
);
}

passwordInput.value=pass;
checkPassword();

});

themeToggle.addEventListener("click",()=>{
document.body.classList.toggle("light");
});

function saveHistory(password){

if(password.length<4)return;

let history=
JSON.parse(localStorage.getItem("history"))||[];

history.unshift(password);

history=history.slice(0,5);

localStorage.setItem("history",JSON.stringify(history));

renderHistory();
}

function renderHistory(){

historyList.innerHTML="";

let history=
JSON.parse(localStorage.getItem("history"))||[];

history.forEach(item=>{

let li=document.createElement("li");

li.textContent=item;

historyList.appendChild(li);

});

}

renderHistory();