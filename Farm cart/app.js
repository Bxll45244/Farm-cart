let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">฿${product.price}</div> <!-- Changed $ to ฿ here -->
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}


const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
        document.querySelector('.buttonCheckout').addEventListener('click', function() {
            // เมื่อคลิกปุ่ม Checkout ให้เปลี่ยนไปยังหน้า index.html
            window.location.href = 'index.html';
            document.addEventListener('DOMContentLoaded', function() {
    const listProduct = document.querySelector('.listProduct');
    const listCart = document.querySelector('.listCart');
    const cartTab = document.querySelector('.cartTab');
    const closeBtn = document.querySelector('.close');
    const checkOutBtn = document.querySelector('.checkOut');

    let cart = [];

    // โหลดรายการสินค้าเมื่อหน้าเว็บโหลด
    function loadProducts() {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(product => {
                    const item = document.createElement('div');
                    item.classList.add('item');
                    item.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>$${product.price}</p>
                        <button class="addToCart" data-id="${product.id}">Add to Cart</button>
                    `;
                    listProduct.appendChild(item);
                });
            });
    }

    // แสดงรายการสินค้าในตะกร้า
    function showCart() {
        listCart.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="info">
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
            `;
            listCart.appendChild(cartItem);
        });
    }

    // เพิ่มสินค้าเข้าตะกร้า
    function addToCart(id) {
        const product = cart.find(item => item.id === id);
        if (product) {
            product.quantity++;
        } else {
            const newProduct = products.find(item => item.id === id);
            newProduct.quantity = 1;
            cart.push(newProduct);
        }
        updateCartIcon();
    }

    // อัปเดตจำนวนสินค้าในไอคอนตะกร้า
    function updateCartIcon() {
        const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
        document.querySelector('.icon-cart span').textContent = totalItems;
    }

    // ปิดหน้าต่างตะกร้าเมื่อคลิกที่ปุ่มปิด
    closeBtn.addEventListener('click', function() {
        cartTab.classList.remove('showCart');
    });

    // เมื่อคลิกที่ปุ่ม "Add to Cart"
    listProduct.addEventListener('click', function(event) {
        if (event.target.classList.contains('addToCart')) {
            const id = parseInt(event.target.dataset.id);
            addToCart(id);
        }
    });

    // เมื่อคลิกที่ปุ่ม "Check Out"
    checkOutBtn.addEventListener('click', function() {
        showCart();
        cartTab.classList.add('showCart');
    });

    // โหลดรายการสินค้าเมื่อเว็บไซต์โหลด
    loadProducts();
});

        });
        
        
    })
}
initApp();
