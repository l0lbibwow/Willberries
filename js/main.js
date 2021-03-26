const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const scrollLinks = document.querySelectorAll('a.scroll-link');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.card-table__total');
const openModal =  () => {
	modalCart.classList.add('show')
	cart.renderCart();
};
const closeModal =  () => {
	modalCart.classList.remove('show')
};
buttonCart.addEventListener('click', openModal);


modalCart.addEventListener('click',event  => {
	const target = event.target;
	if (event.target.classList.contains('overlay') || target.classList.contains('modal-close')){
		closeModal()
	}
})
//scroll smooth

for (const scrollLink of scrollLinks){

	scrollLink.addEventListener('click', event => {
		event.preventDefault();
		const id = scrollLink.getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
	});
}
//goods

const getGoods = async  () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Errorochka' + result.status;
	}
	return await  result.json();
}
const cart = {
	cartGoods: [

	],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
				<td>${name}</td>
\t\t\t\t\t 		<td>${price}$</td>
\t\t\t\t\t 		<td><button class="cart-btn-minus">-</button></td>
\t\t\t\t\t 		<td>${count}</td>
\t\t\t\t\t 		<td><button class="cart-btn-plus">+</button></td>
\t\t\t\t\t 		<td>${price*count}$</td>
\t\t\t\t\t 		<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});
		const totalPrice = this.cartGoods.reduce((sum, item) => {
				return sum + item.price * item.count;
		},0);

		cartTableTotal.textContent = totalPrice + '$';
	},
	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id)
		this.renderCart();
	},
	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id){
				if (item.count <= 1){
					this.deleteGood(id)
				}else{
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id){
		for (const item of this.cartGoods) {
			if (item.id === id){
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGoods(id){
		const goodItem = this.cartGoods.find(item => item.id === id)
		if (goodItem){
			this.plusGood(id)
		}else{
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({id, name, price }) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
				});
		}
	},
}
cart.addCartGoods('001')
cart.addCartGoods('021')
document.body.addEventListener('click', e => {
	const target = e.target.closest('.add-to-cart');
	if (target){
		cart.addCartGoods(target.dataset.id)
	}
})

cartTableGoods.addEventListener('click', e => {
	const target = e.target;
	if (target.tagName === "BUTTON") {
		const id = target.closest('.cart-item').dataset.id;
		if (target.classList.contains('cart-btn-delete')) {
			cart.deleteGood(id);
		};
		if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		}
		if (target.classList.contains('cart-btn-plus')) {
			cart.plusGood(id);
		}
	}

});
const createCard =  objCard => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
	<div class="goods-card">
	${objCard.label ? `<span class="label">${objCard.label}</span>` : ``}
\t\t\t\t\t\t
\t\t\t\t\t\t<img src="db/${objCard.img}" alt=${objCard.name} class="goods-image">
\t\t\t\t\t\t<h3 class="goods-title">${objCard.name}</h3>
\t\t\t\t\t\t<p class="goods-description">${objCard.description}</p>
\t\t\t\t\t\t<button class="button goods-card-btn add-to-cart" data-id=${objCard.id}>
\t\t\t\t\t\t\t<span class="button-price">$ ${objCard.price}</span>
\t\t\t\t\t\t</button>
\t\t\t\t\t</div>
	`;
	return card
};
const renderCards = data => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	longGoodsList.append(...cards)
	document.body.classList.add('show-goods')
};

more.addEventListener('click',  event => {
	event.preventDefault()
	getGoods().then(renderCards)
});

const filterCards = (field,value) => {
	getGoods()
		.then(data => data.filter( good => good[field] === value))
		.then(renderCards);
}
navigationLink.forEach(link => {
	link.addEventListener('click', event => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		if (value === 'All'){
			getGoods().then(renderCards)
		}else{
			filterCards(field,value);
		}

	})
});
