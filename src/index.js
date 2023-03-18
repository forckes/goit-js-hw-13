import './index.html'
import './scss/common.scss'
import { fetchImages } from './js/api.js'
import galleryTpl from './templates/gallery.hbs'
import './scss/tooltip.scss'
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import SimpleLightbox from 'simplelightbox'
import 'simplelightbox/dist/simple-lightbox.min.css'

//
let page = 1
const refs = {
	input: document.querySelector('.search-form'),
	gallery: document.querySelector('.gallery'),
	btn: document.querySelector('.load-more'),
}

refs.input.addEventListener('submit', searchQuery)
refs.btn.addEventListener('click', onLoadMore)
refs.btn.classList.add('hidden')

//functions
function searchQuery(e) {
	clearGallery()
	const value = refs.input.query.value
	e.preventDefault()
	findImages(value, page)
	console.log('wait..')
}
function findImages(value, page) {
	fetchImages(value, page)
		.then(response => {
			checkNumberOfHits(response.hits.length)

			response.hits.forEach(h => console.log(h.previewURL))

			notifyResponse(response)
			return response.hits
		})
		.then(data => {
			renderMarkup(data)
			var lightbox = new SimpleLightbox('.photo-card a', {
				captionsData: 'alt',
				captionDelay: 250,
			})
		})
}

function renderMarkup(markup) {
	refs.gallery.insertAdjacentHTML('beforeend', galleryTpl(markup))
}
function notifyResponse(r) {
	r.totalHits === 0
		? Notify.failure('Oh no :( Nothing are found')
		: Notify.success(`Yey we found ${r.totalHits} images for you query`)
}
function onLoadMore() {
	const value = refs.input.query.value
	page = page + 1
	fetchImages(value, page)
		.then(response => {
			checkNumberOfHits(response.hits.length)
			return response.hits
		})
		.then(data => {
			renderMarkup(data)
		})
}
function clearGallery() {
	refs.gallery.innerHTML = ''
}
function checkNumberOfHits(r) {
	r < 12
		? refs.btn.classList.add('hidden')
		: refs.btn.classList.remove('hidden')
}
