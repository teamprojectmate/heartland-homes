import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Notification from '../../components/Notification';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadMyAccommodations, removeAccommodation } from '../../store/slices/accommodationsSlice';
import '../../styles/components/admin/_admin-tables.scss';

const MyAccommodations = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { items, loading, error } = useAppSelector((s) => s.accommodations);

	useEffect(() => {
		dispatch(loadMyAccommodations({ page: 0, size: 10 }));
	}, [dispatch]);

	const handleDelete = (id: number) => {
		if (window.confirm(t('accommodations.deleteConfirm'))) {
			dispatch(removeAccommodation(id));
		}
	};

	if (loading) return <p className="text-center mt-5">{t('common.loading')}</p>;

	return (
		<div className="container page">
			<h1 className="section-heading">{t('accommodations.myTitle')}</h1>

			{error && <Notification message={error} type="danger" />}

			<div className="text-end mb-3">
				<Link to="/accommodations/new" className="btn-primary">
					<FaPlus /> {t('accommodations.addNew')}
				</Link>
			</div>

			{items.length > 0 ? (
				<table className="admin-table">
					<thead>
						<tr>
							<th>{t('admin.name')}</th>
							<th>{t('admin.city')}</th>
							<th>{t('admin.price')}</th>
							<th>{t('admin.status')}</th>
							<th>{t('admin.actions')}</th>
						</tr>
					</thead>
					<tbody>
						{items.map((acc) => (
							<tr key={acc.id}>
								<td>{acc.name}</td>
								<td>{acc.city}</td>
								<td>
									{acc.dailyRate} {t('common.currency')}
								</td>
								<td>{acc.status}</td>
								<td>
									<Link to={`/my-accommodations/edit/${acc.id}`} className="btn-icon btn-secondary">
										<FaEdit />
									</Link>
									<button
										type="button"
										className="btn-icon btn-danger"
										onClick={() => handleDelete(acc.id)}
									>
										<FaTrash />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p className="text-center">{t('accommodations.noAccommodations')}</p>
			)}
		</div>
	);
};

export default MyAccommodations;
