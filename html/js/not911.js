let list = document.getElementById('categories');

fetch('/admin/category')
  .then(response => response.json())
  .then(data => writeCategories(list, data));

document.forms.categoryForm.addEventListener('submit', submitHandler);
document.forms.categoryForm.addEventListener('reset', resetHandler);

function writeCategories(list, data) {

  let nodes = [];
  data.forEach(categories => {
    let li = document.createElement('li');
    li.addEventListener('click', updateForm);
    li.setAttribute('data-category-id', categories.id);
    li.setAttribute('data-category-name', categories.name);

    let text = document.createTextNode(categories.name);
    li.appendChild(text);

    let deleteButton = document.createElement('a');
    deleteButton.addEventListener('click', deleteCategory);
    deleteButton.appendChild(document.createTextNode('x'));

    li.appendChild(deleteButton);

    nodes.push(li);
  });

  list.replaceChildren(...nodes);
}

function deleteCategory (clickEvent) {
  clickEvent.stopPropagation();
  let listItem = clickEvent.target.parentElement;
  let { categoryId, categoryName } = listItem.dataset;

  fetch('/admin/category?id=' + categoryId, {
    method: 'DELETE'
  }).then(response => {
    if(response.status == 200){
      list.removeChild(listItem);
    };
  });
}

function updateForm (clickEvent) {
  let listItem = clickEvent.target;
  let { categoryId, categoryName } = listItem.dataset;

  let form = document.forms.categoryForm;

  let categoryField = form.elements.category;
  categoryField.value = categoryName;

  form.elements.id.value = categoryId;
}

function submitHandler (submitEvent) {
  submitEvent.preventDefault();
  
  let form = submitEvent.target;
  let category = form.elements.category.value;
  let id = form.elements.id.value;
  
  let method, payload;
  if(id == '') {
    // Post
    method = 'POST';
    payload = {
      category
    };
  } else {
    // Put
    method = 'PUT';
    payload = {
      category,
      id
    };
  }

  fetch('/admin/category', {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then(response => response.json())
    .then(data => writeCategories(list, data));
  form.reset();
}

function resetHandler (resetEvent) {
  let form = resetEvent.target;
  form.elements.id.value = '';
}
