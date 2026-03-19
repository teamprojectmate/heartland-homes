import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className="container page text-center">
			<h1 className="display-4 mb-3">404</h1>
			<p className="mb-4">Сторінку не знайдено 😢</p>
			<Link to="/" className="btn-primary">
				На головну
			</Link>
		</div>
	);
};

export default NotFound;
