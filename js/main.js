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
const openModal = function () {
	modalCart.classList.add('show')
};
const closeModal = function () {
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

const scrollLinks = document.querySelectorAll('a.scroll-link');

for (const scrollLink of scrollLinks){

	scrollLink.addEventListener('click', function(event) {

		event.preventDefault();
		const id = scrollLink.getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
	});
}
//goods

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function (){
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Errorochka' + result.status;
	}
	return await  result.json();
}
const createCard = function (objCard) {
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
const renderCards = function (data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	longGoodsList.append(...cards)
	document.body.classList.add('show-goods')
};

more.addEventListener('click', function (event){
	event.preventDefault()
	getGoods().then(renderCards)
});

const filterCards = function(field,value) {
	getGoods()
		.then(function (data){
		const filteredGoods = data.filter((function (good){
			return good[field] === value
		}))
		return filteredGoods;
	})
		.then(renderCards);
}
navigationLink.forEach(function(link) {
	link.addEventListener('click', function (event){
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field,value);
	})
});
