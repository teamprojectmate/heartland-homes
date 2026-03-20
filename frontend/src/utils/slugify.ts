const slugify = (text = '') =>
	text
		.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '_')
		.replace(/[^\w-]+/g, '')
		.replace(/_+/g, '_')
		.replace(/^_+|_+$/g, '');

export default slugify;
