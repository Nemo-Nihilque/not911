let resourceForm = document.forms.resourcesForm;
let categorySelect = document.getElementById('categorySelect');

document.forms.resourceForm.addEventListener('submit', submitHandler);
document.forms.resourceForm.addEventListener('reset', resetHandler);

fetch('/admin/category')
  .then(response => response.json())
  .then(data => populateCategories(categorySelect, data));

function populateCategories(select, data) {
  data.forEach(category => {
    let option = document.createElement('option');
    option.setAttribute('value', category.id);

    let text = document.createTextNode(category.name);
    option.appendChild(text);

    select.appendChild(option);
  });
}

function submitHandler (submitEvent) {
  submitEvent.preventDefault();

  let form = submitEvent.target;

  let { category, name, phoneNumber, city, state } = form.elements;

  let method, payload;
  
  fetch('/admin/resource', {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then(response =. response.json())
    .then(data =. writeCategory(list, data));
  form.reset();

}
    
function resetHandler (resetEvent) {
  
}
