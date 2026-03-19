import { useTranslation } from 'react-i18next';

const Pagination = ({ page, totalPages, onPageChange }) => {
	const { t } = useTranslation();

	if (totalPages <= 1) return null;

	return (
		<div className="pagination">
			<button
				type="button"
				className="btn btn-outline"
				onClick={() => onPageChange(page - 1)}
				disabled={page === 0}
			>
				{t('common.previous')}
			</button>

			<span className="pagination-info">
				{t('common.pageOf', { current: page + 1, total: totalPages })}
			</span>

			<button
				type="button"
				className="btn btn-outline"
				onClick={() => onPageChange(page + 1)}
				disabled={page >= totalPages - 1}
			>
				{t('common.next')}
			</button>
		</div>
	);
};

export default Pagination;
