/**
 * Універсальна таблиця для адмінки
 * @param {Array} columns - { key, label, className?, render? }
 * @param {Array} data - масив об'єктів (рядків таблиці)
 * @param {Function} actions - функція для додаткових дій (кнопки тощо)
 */
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
						{actions && <th>Дії</th>}
					</tr>
				</thead>
				<tbody>
					{data && data.length > 0 ? (
						data.map((row, idx) => (
							<tr key={(row.id as string | number) || idx}>
								{columns.map((col) => (
									<td key={col.key} className={col.className || ''}>
										{col.render ? col.render(row) : String(row[col.key] ?? '')}
									</td>
								))}
								{actions && <td className="actions">{actions(row)}</td>}
							</tr>
						))
					) : (
						<tr>
							<td colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
								Немає даних
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default AdminTable;
