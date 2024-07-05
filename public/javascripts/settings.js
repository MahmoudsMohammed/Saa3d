submitBtn =  document.querySelector('.submitBtn');
spinnerSpan = submitBtn.getElementsByClassName("spinner-border")[0];
submitBtn.addEventListener('click', () => { 
   spinnerSpan.classList.remove("d-none");
   spinnerSpan.classList.add("d-inline-block");
 });