import { useTranslation } from 'react-i18next';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StatusSelect from '../../components/selects/StatusSelect';
import type { Accommodation } from '../../types';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';
import { mapType } from '../../utils/translations';

const fallbackImage = '/assets/no-image.svg';

type AdminAccommodationCardProps = {
	acc: Accommodation;
	onStatusChange: (id: number, status: string) => void;
	onDelete: (id: number) => void;
};

const AdminAccommodationCard = ({ acc, onStatusChange, onDelete }: AdminAccommodationCardProps) => {
	const { t } = useTranslation();
	const image = acc.image ? fixDropboxUrl(acc.image) : fallbackImage;
	const { label, icon, color } = mapType(acc.type as string, t);

	return (
		<div className="admin-accommodation-card">
			<img
				src={image}
				alt={acc.name || t('accommodations.accommodation')}
				className="accommodation-card-img"
				onError={(e) => (e.currentTarget.src = fallbackImage)}
			/>

			<div className="accommodation-card-content">
				<div className="card-header">
					<h3 className="accommodation-title">{acc.name}</h3>
					<StatusSelect
						type="accommodation"
						value={acc.accommodationStatus || ''}
						onChange={(newStatus) => onStatusChange(acc.id, newStatus)}
					/>
				</div>

				<div className="badge badge-type" style={{ backgroundColor: color }}>
					{icon} {label}
				</div>

				<div className="card-body">
					<p>
						<strong>{t('admin.city')}:</strong> {acc.city}
					</p>
					<p className="price">
						<strong>{t('admin.price')}:</strong> {acc.dailyRate} {t('common.currency')}
					</p>
				</div>

				<div className="admin-card-actions">
					<Link to={`/admin/accommodations/edit/${acc.id}`} className="btn-inline btn-secondary">
						<FaEdit /> {t('common.edit')}
					</Link>
					<button type="button" className="btn-inline btn-danger" onClick={() => onDelete(acc.id)}>
						<FaTrash /> {t('common.delete')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AdminAccommodationCard;
