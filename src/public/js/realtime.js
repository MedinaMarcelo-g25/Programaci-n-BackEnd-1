const socket = io();

function renderProducts(products) {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price}<br>
      <small>${p.description}</small><br>
      <span>Código: ${p.code} | Stock: ${p.stock} | Categoría: ${p.category}</span>
      <button class="delete-btn">Eliminar</button>
    `;
    list.appendChild(li);
  });
}

socket.on('products', renderProducts);

document.getElementById('add-product-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const product = {
    title: form.title.value,
    description: form.description.value,
    code: form.code.value,
    price: Number(form.price.value),
    status: true,
    stock: Number(form.stock.value),
    category: form.category.value,
    thumbnails: form.thumbnails.value
      ? form.thumbnails.value.split(',').map(s => s.trim())
      : []
  };
  socket.emit('addProduct', product);
  form.reset();
});

document.getElementById('product-list').addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const li = e.target.closest('li');
    const id = li.dataset.id;
    socket.emit('deleteProduct', Number(id));
  }
});