const deleteProductBtnElements = document.querySelectorAll('.product-item-action button');

async function deleteProduct(event) {
    const buttonElement = event.target;
    const productid = buttonElement.dataset.productid;
    const csrfToken = buttonElement.dataset.csrf;

    const response = await fetch('/admin/products/' + productid + '?_csrf=' + csrfToken, {
        method: 'DELETE'
    });

    if(!response.ok) {
        alert('Something went wrong! Try again later');
        return;
    }

    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for(const deleteProductBtnElement of deleteProductBtnElements) {
    deleteProductBtnElement.addEventListener('click', deleteProduct);
}