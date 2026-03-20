import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import Notification from '../../components/Notification';
import { PageSkeleton } from '../../components/skeletons';
import { useAppSelector } from '../../store/hooks';

type ProtectedRouteProps = {
	children: React.ReactNode;
	requiredRole?: string | string[] | null;
};

const ProtectedRoute = ({ children, requiredRole = null }: ProtectedRouteProps) => {
	const { t } = useTranslation();
	const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
	const location = useLocation();

	if (isLoading) {
		return <PageSkeleton />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	const rawRole = user?.cleanRole || (Array.isArray(user?.roles) ? user.roles[0] : user?.role);
	const userRole = rawRole?.startsWith('ROLE_') ? rawRole.replace('ROLE_', '') : rawRole;

	if (requiredRole) {
		const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

		if (!roles.includes(userRole)) {
			return (
				<main className="container page">
					<h1 className="text-center">{t('auth.accessDenied')}</h1>
					<p className="text-center">{t('auth.noPermission')}</p>
					<Notification message={t('auth.noPermission')} type="danger" />
				</main>
			);
		}
	}

	return children;
};

export default ProtectedRoute;
