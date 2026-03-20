import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import Pagination from '../../components/Pagination';
import StatusSelect from '../../components/selects/StatusSelect';
import { TableSkeleton } from '../../components/skeletons';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	loadAdminAccommodations,
	removeAccommodation,
	setPage,
	updateAccommodationStatusAsync,
} from '../../store/slices/accommodationsSlice';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';
import { mapType } from '../../utils/translations';
import AdminTable from '../Admin/AdminTable';
import AdminAccommodationCard from './AdminAccommodationCard';

import '../../styles/components/admin/_admin.scss';
import '../../styles/components/badges/_badges.scss';
import '../../styles/components/_status-select.scss';
import '../../styles/components/admin/_admin-tables.scss';
import '../../styles/components/admin/_admin-accommodations.scss';

const fallbackImage = '/assets/no-image.svg';

const AdminAccommodations = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { user } = useAppSelector((state) => state.auth);
	const {
		items: accommodations,
		loading,
		error,
		page,
		totalPages,
	} = useAppSelector((s) => s.accommodations);

	const isMobile = useIsMobile();

	useEffect(() => {
		if (!user || user.cleanRole !== 'MANAGER') {
			navigate('/');
			return;
		}
		dispatch(loadAdminAccommodations({ page }));
	}, [user, navigate, dispatch, page]);

	const handleDelete = (id: number) => {
		if (window.confirm(t('admin.deleteAccommodation'))) {
			dispatch(removeAccommodation(id));
		}
	};

	const handleStatusChange = useCallback(
		(id: number, status: string) => {
			dispatch(updateAccommodationStatusAsync({ id, status }));
		},
		[dispatch],
	);

	const columns = useMemo(
		() => [
			{ key: 'id', label: 'ID' },
			{ key: 'name', label: t('admin.name') },
			{ key: 'city', label: t('admin.city') },
			{
				key: 'type',
				label: t('admin.type'),
				render: (acc: Record<string, unknown>) => {
					const { label, icon, color } = mapType(acc.type as string, t);
					return (
						<span className="badge badge-type" style={{ backgroundColor: color }}>
							{icon} {label}
						</span>
					);
				},
			},
			{
				key: 'dailyRate',
				label: t('admin.price'),
				className: 'price',
				render: (acc: Record<string, unknown>) => (
					<span>
						{String(acc.dailyRate)} {t('common.currency')}
					</span>
				),
			},
			{
				key: 'image',
				label: t('admin.image'),
				render: (acc: Record<string, unknown>) => (
					<img
						src={acc.image ? fixDropboxUrl(acc.image as string) : fallbackImage}
						alt={(acc.name as string) || t('accommodations.imageAlt')}
						className="table-img"
						onError={(e) => (e.currentTarget.src = fallbackImage)}
					/>
				),
			},
			{
				key: 'accommodationStatus',
				label: t('admin.status'),
				render: (acc: Record<string, unknown>) => (
					<StatusSelect
						type="accommodation"
						value={acc.accommodationStatus as string}
						onChange={(newStatus: string) => handleStatusChange(acc.id as number, newStatus)}
					/>
				),
			},
		],
		[handleStatusChange, t],
	);

	if (loading) return <TableSkeleton rows={5} columns={6} />;

	return (
		<div className="container admin-page-container">
			<h1 className="section-heading text-center">{t('accommodations.manageTitle')}</h1>

			{error && <Notification message={error} type="danger" />}

			<div className="text-end mb-3">
				<Link to="/accommodations/new" className="btn-primary">
					<FaPlus /> {t('accommodations.addAccommodation')}
				</Link>
			</div>

			{accommodations.length > 0 ? (
				<>
					{isMobile ? (
						<div className="admin-accommodations-cards">
							{accommodations.map((acc) => (
								<AdminAccommodationCard
									key={acc.id}
									acc={acc}
									onStatusChange={handleStatusChange}
									onDelete={handleDelete}
								/>
							))}
						</div>
					) : (
						<AdminTable
							columns={columns}
							data={accommodations}
							actions={(acc) => (
								<div className="action-buttons">
									<Link
										to={`/admin/accommodations/edit/${acc.id}`}
										className="btn-icon btn-secondary"
										title={t('common.edit')}
									>
										<FaEdit />
									</Link>
									<button
										type="button"
										className="btn-icon btn-danger"
										onClick={() => handleDelete(acc.id as number)}
										title={t('common.delete')}
									>
										<FaTrash />
									</button>
								</div>
							)}
						/>
					)}

					<Pagination
						page={page}
						totalPages={totalPages}
						onPageChange={(newPage: number) => dispatch(setPage(newPage))}
					/>
				</>
			) : (
				<p className="text-center">{t('accommodations.noAccommodationsYet')}</p>
			)}
		</div>
	);
};

export default AdminAccommodations;
