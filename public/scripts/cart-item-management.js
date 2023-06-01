const cartUpdateFormElements = document.querySelectorAll('.cart-item-management');

async function updateCart(event) {
    event.preventDefault();

    const form = event.target;

    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value;

    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'PATCH',
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                _csrf: csrfToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch(error) {
        alert('Something went wrong!');
        return;
    }

    if(!response.ok) {
        alert('Something went wrong!');
        return;
    }

    const responseData = await response.json();
    const itemLi = form.parentElement.parentElement;

    if(responseData.updatedCartData.updatedItemPrice === 0) {
        itemLi.remove();
    } else {    
        const itemTotalPriceElement = document.querySelector('#item-total-price');
        itemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2);
    }

    const cartBadgeElement = document.querySelector('.nav-list .badge');
    const cartTotalPriceElement = document.querySelector('#cart-total-price');
    
    cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
    cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);
}

for(const cartUpdateFormElement of cartUpdateFormElements) {
    cartUpdateFormElement.addEventListener('submit', updateCart);
}