import { useTranslation } from 'react-i18next';

type Column = {
	key: string;
	label: string;
	className?: string;
	render?: (row: Record<string, unknown>) => React.ReactNode;
};

type AdminTableProps = {
	columns: Column[];
	data: Record<string, unknown>[];
	actions?: (row: Record<string, unknown>) => React.ReactNode;
};

const AdminTable = ({ columns, data, actions }: AdminTableProps) => {
	const { t } = useTranslation();

	return (
		<div className="admin-table-wrapper">
			<table className="admin-table">
				<thead>
					<tr>
						{columns.map((col) => (
							<th key={col.key} className={col.className || ''}>
								{col.label}
							</th>
						))}
						{actions && <th>{t('admin.actions')}</th>}
					</tr>
				</thead>
				<tbody>
					{data && data.length > 0 ? (
						data.map((row, idx) => (
							<tr key={(row.id as string | number) || idx}>
								{columns.map((col) => (
									<td key={col.key} className={col.className || ''} data-label={col.label}>
										{col.render ? col.render(row) : String(row[col.key] ?? '')}
									</td>
								))}
								{actions && (
									<td className="actions" data-label={t('admin.actions')}>
										{actions(row)}
									</td>
								)}
							</tr>
						))
					) : (
						<tr>
							<td colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
								{t('common.noData')}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default AdminTable;
