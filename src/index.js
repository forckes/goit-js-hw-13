import './index.html'
import './scss/common.scss'
import { fetchImages } from './js/api.js'
import galleryTpl from './templates/gallery.hbs'
import './scss/tooltip.scss'
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import SimpleLightbox from 'simplelightbox'
import './scss/loader.scss'
import 'simplelightbox/dist/simple-lightbox.min.css'

//
let page = 1
const refs = {
	input: document.querySelector('.search-form'),
	gallery: document.querySelector('.gallery'),
	btn: document.querySelector('.load-more'),
	loader: document.querySelector('.loading'),
}

refs.input.addEventListener('submit', searchQuery)
refs.btn.addEventListener('click', onLoadMore)
refs.btn.classList.add('hidden')
refs.loader.classList.add('hidden')

//functions
function searchQuery(e) {
	e.preventDefault()
	clearGallery()
	const value = refs.input.query.value
	refs.loader.classList.remove('hidden')
	findImages(value, page)
}
async function findImages(value, page) {
	try {
		const response = await fetchImages(value, page)
		checkNumberOfHits(response.hits.length)
		notifyResponse(response)
		const data = await response.hits
		renderMarkup(data)
		refs.loader.classList.add('hidden')
		const lightbox = new SimpleLightbox('.photo-card a', {
			captionDelay: 250,
		})
	} catch (error) {
		console.error(error)
	}
}
function renderMarkup(markup) {
	refs.gallery.insertAdjacentHTML('beforeend', galleryTpl(markup))
}
function notifyResponse(r) {
	r.totalHits === 0
		? Notify.failure('Oh no :( Nothing are found')
		: Notify.success(`Yey we found ${r.totalHits} images for you query`)
}
async function onLoadMore() {
	const value = refs.input.query.value
	page = page + 1
	const response = await fetchImages(value, page)
	checkNumberOfHits(response.hits.length)
	const data = await response.hits
	renderMarkup(data)
}
function clearGallery() {
	refs.gallery.innerHTML = ''
}
function checkNumberOfHits(r) {
	r < 12
		? refs.btn.classList.add('hidden')
		: refs.btn.classList.remove('hidden')
}
