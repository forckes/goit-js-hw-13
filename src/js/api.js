// https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=33988247-485686e7226228f73d1e4aa27
const BASE_URL = 'https://pixabay.com/api/'
const API_KEY = '33988247-485686e7226228f73d1e4aa27'
export async function fetchImages(query, page) {
	try {
		const response = await fetch(
			`${BASE_URL}?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${API_KEY}`
		)
		const data = await response.json()
		return data
	} catch (error) {
		console.error()
	}
}
