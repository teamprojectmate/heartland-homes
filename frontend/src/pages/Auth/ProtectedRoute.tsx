import { Navigate, useLocation } from 'react-router-dom';
import Notification from '../../components/Notification';
import { PageSkeleton } from '../../components/skeletons';
import { useAppSelector } from '../../store/hooks';

const ProtectedRoute = ({ children, requiredRole = null }) => {
	const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
	const location = useLocation();

	if (isLoading) {
		return <PageSkeleton />;
	}

	// Якщо користувач не авторизований → редірект на /login
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Витягуємо роль користувача
	const rawRole = user?.cleanRole || (Array.isArray(user?.roles) ? user.roles[0] : user?.role);

	// Нормалізація (видаляємо префікс ROLE_)
	const userRole = rawRole?.startsWith('ROLE_') ? rawRole.replace('ROLE_', '') : rawRole;

	// Перевірка ролі (якщо є вимога)
	if (requiredRole) {
		const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

		if (!roles.includes(userRole)) {
			return (
				<main className="container page">
					<h1 className="text-center">🚫 Доступ заборонено</h1>
					<p className="text-center">У вас немає дозволу на перегляд цієї сторінки.</p>
					<Notification message="У вас немає дозволу на перегляд цієї сторінки." type="danger" />
				</main>
			);
		}
	}

	// Якщо всі перевірки пройдені → пропускаємо далі
	return children;
};

export default ProtectedRoute;
