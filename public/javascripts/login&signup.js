// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
'use strict'

// Fetch all the forms we want to apply custom Bootstrap validation styles to
var forms = document.querySelectorAll('.needs-validation')

// Loop over them and prevent submission
Array.prototype.slice.call(forms)
.forEach(function (form) {
form.addEventListener('submit', function (event) {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }

  form.classList.add('was-validated')
}, false)
})
})()

const logIn = {
  btn: document.querySelector('.logInBtn'),
  form: document.querySelector('.logIn'),
  input: document.getElementsByClassName('logInput'),
  submit: document.querySelector('.logInSubmit')
};

const signUp = {
  btn: document.querySelector('.signUpBtn'),
  form: document.querySelector('.signUp'),
  input: document.getElementsByClassName('signInput'),
  submit: document.querySelector('.signUpSubmit')
};

function formDisplay(f1, f2){
  f1.btn.classList.add("selected");
  f2.btn.classList.remove("selected");
  f1.form.style.display = 'block';
  f2.form.style.display = 'none';
  for(let i = 0; i < f1.input.length; i++){
    f1.input[i].setAttribute('required', '');
   }
  for(let i = 0; i < f2.input.length; i++){
    f2.input[i].removeAttribute('required');
   }
}

logIn.btn.addEventListener('click', () => { formDisplay(logIn, signUp) });
signUp.btn.addEventListener('click', () => { formDisplay(signUp, logIn) });

logIn.form.addEventListener("keyup", function(e) {
  if (e.key == 'Enter') {
    console.log(logIn.submit);
    logIn.submit.click();
  }
});