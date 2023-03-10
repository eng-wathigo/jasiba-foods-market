// variables

const cartBtn = document.querySelector(".cart-btn")

const bodyDOM =  document.querySelector(".body")
const closeCartBtn =  document.querySelector(".close-cart")
const clearCartBtn = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart")
const cartOverlay =  document.querySelector(".cart-overlay")
const cartItems =  document.querySelector(".cart-items")
const cartTotal = document.querySelector(".cart-total")
const cartContent =  document.querySelector(".cart-content")
const productsDOM =  document.querySelector(".products-center")
const categoriesDOM =  document.querySelector(".categories-center")
const checkoutBtn = document.querySelector(".checkout")
const openPopup = document.querySelector(".popup")
const categoryBtn = document.querySelector(".category-btn")


// cart
let cart = [];
//  buttons
let buttonsDOM = [];

//Category

class Categories {
    async getCategories(){
        try {
            let categoryResult = await fetch('products.json')
            let data = await categoryResult.json();
            let categories = data.groups;
            categories = categories.map(group=>{
                const {title} = group.fields;
                const {id} = group.sys;
                const image = group.fields.image.fields.file.url;
                return {title,id,image}

            })
            return categories
    
    
    } catch (error) {
        console.log(error);
    }
       
    }
}

//products

class Products {
    async getProducts(){
        try {
            let result = await fetch('products.json')
            let data = await result.json();
            let products = data.items;
            products = products.map(item=>{
                const {title,price,UoM, category} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title,price,UoM,id,image,category}

            })
            return products
    
    
    } catch (error) {
        console.log(error);
    }
       
    }
}

// diplay products
class UI {
    displayCategories(categories){
        let categoryResult = '';
        categories.forEach(category => {
            categoryResult += `
            <!-- Single category-->
            <article class="category">
                <div class="img-container">
                    <img src=${category.image} alt="category" class="product-img"/>
                    <button class="category-btn" data-id=${category.id}>
                        <i class="fas fa-search"></i> Explore ${category.title}
                    </button>                                        
                </div>
                <h3>${category.title}</h3>
                
            </article>

            <!-- End of Single category-->
            `;
        });
        categoriesDOM.innerHTML = categoryResult;
    }

    displayProducts(products){
        
        let result = '';
        products.forEach(product => {
            result += `
            <!-- Single Product-->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img"/>
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>                    
                </div>
                <h3>${product.title}</h3>
                <h4>KSHs.${product.price}${product.UoM}</h4>
            </article>

            <!-- End of Single Product-->
            `;
        });
        productsDOM.innerHTML = result;
    }
    
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.innerText = "In Cart";
                button.disabled = true;
              }
                button.addEventListener('click', (event)=>{
                event.target.innerText = "in Cart";
                event.target.disabled = true;
                    // get product from products based on id
                
                    let cartItem = {...Storage.getProducts(id), amount:1};
                                       
                    // add product to the cart
                    cart = [...cart,cartItem];
                    
                    // save the cart in local storage
                    Storage.saveCart(cart);
                    // set cart values 
                    this.setCartValues(cart);
                    // display cart items
                    this.addCartItem(cartItem);
                    // show the cart
                    this.showCart();

                });
            
        });
    }
        setCartValues(cart){
            let tempTotal = 0;
            let itemsTotal = 0;
            cart.map(item =>{
                tempTotal += item.price * item.amount;
                itemsTotal += item.amount;
            })
            cartTotal.innerText = parseFloat(tempTotal.toFixed(1));
            cartItems.innerText = itemsTotal;           

        }
        addCartItem(item){
            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `<img src=${item.image} alt="product"/>
            <div>
                <h4>${item.title}</h4>
                <h5>KSHs. ${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            <div/>`
            cartContent.appendChild(div);        
    
        }
        showCart(){
            cartOverlay.classList.add('transparentBcg');
            cartDOM.classList.add('showCart');

        }
        setUpApp(){
            cart = Storage.getCart();
            this.setCartValues(cart);
            this.populateCart(cart);
            cartBtn.addEventListener('click', this.showCart);
            closeCartBtn.addEventListener('click', this.hideCart);
            checkoutBtn.addEventListener('click', () => {
                this.openPopup()});
                     
            
            

        }
        populateCart(cart){
            cart.forEach(item=>this.addCartItem(item));
            
        }
        hideCart(){
            cartOverlay.classList.remove('transparentBcg');
            cartDOM.classList.remove('showCart');
        }
        openPopup(){
            popup.classList.add("open-popup");
        }
       
        
        
        cartLogic(){
            // clear cart button
            clearCartBtn.addEventListener('click', ()=>{
                this.clearCart();
            });
            // cart functionality
            cartContent.addEventListener('click',event=>{
                if(event.target.classList.contains('remove-item')){
                    let removeItem = event.target;
                    let id = removeItem.dataset.id;
                    cartContent.removeChild(removeItem.parentElement.parentElement);
                    this.removeItem(id);
                }
                else if(event.target.classList.contains
                    ("fa-chevron-up")){
                        let addAmount = event.target;
                        let id = addAmount.dataset.id;
                        let tempItem = cart.find( item => item.id ===id);
                        tempItem.amount = tempItem.amount + 1;
                        Storage.saveCart(cart);
                        this.setCartValues(cart);
                        addAmount.nextElementSibling.innerText = tempItem.amount;

                    }
                else if(event.target.classList.contains
                        ("fa-chevron-down")){
                        let lowerAmount = event.target;
                        let id = lowerAmount.dataset.id;
                        let tempItem = cart.find( item => item.id ===id);
                        tempItem.amount = tempItem.amount - 1;
                        if(tempItem.amount>0){
                            Storage.saveCart(cart);
                            this.setCartValues(cart);
                            lowerAmount.previousElementSibling.innerText = tempItem.amount;

                        }else {
                            cartContent.removeChild
                            (lowerAmount.parentElement.parentElement);
                            this.removeItem(id);
                        }

                        
                        
                        

                    }
            })
        }
        clearCart(){
            let cartItems = cart.map(item => item.id);
            cartItems.forEach(id => this.removeItem(id));
            while(cartContent.children.length>0){
                cartContent.removeChild(cartContent.children[0]);
            }
            this.hideCart();
        }
        removeItem(id){
            cart = cart.filter(item => item.id !== id);
            this.setCartValues(cart);
            Storage.saveCart(cart);
            let button = this.getSingleButton(id);
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-shopping-cart"><i/> 
            add to Cart`
        }
        getSingleButton(id){
            return buttonsDOM.find(button => button.dataset.id 
                === id);
        }
    
}

//local storage
class Storage {
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products))
    }
    static getProducts(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) :
        [];
    }

}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products();
    const categories = new Categories();
//set up application
ui.setUpApp();
    // get all products
    products.getProducts().then(products => {ui.displayProducts(products)
    Storage.saveProducts(products);
    }).then(()=> {
       ui.getBagButtons();
       ui.cartLogic();
    });

     // get all categories
     categories.getCategories().then(categories => {ui.displayCategories(categories)
        Storage.saveCategories(categories);
        });
});

