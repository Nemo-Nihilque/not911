let resourceForm = document.forms.resourcesForm;
let categorySelect = document.getElementById('categorySelect');

document.forms.resourcesForm.addEventListener('submit', submitHandler);
document.forms.resourcesForm.addEventListener('reset', resetHandler);

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
  let { category, resource, phoneNumber, city, state } = form.elements;
  let method = 'POST';

  let payload = {
    category: category.value,
    resource: resource.value,
    phoneNumber: phoneNumber.value,
    city: city.value,
    state: state.value
  };
  
  fetch('/admin/resource', {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then(response => response.json())
    .then(data => writeResources([], data));
  form.reset();

}
    
function writeResources(resourceList, data){
  
}

function resetHandler (resetEvent) {
  
}
