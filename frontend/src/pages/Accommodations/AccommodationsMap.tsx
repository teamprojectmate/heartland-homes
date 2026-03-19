import BaseMap from '../../components/BaseMap';
import type { Accommodation } from '../../types';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';

const AccommodationsMap = ({
	accommodations = [],
	highlightedId,
}: {
	accommodations?: Accommodation[];
	highlightedId: number | null;
}) => {
	return (
		<BaseMap
			items={accommodations}
			highlightedId={highlightedId}
			renderPopup={(a) => (
				<div style={{ textAlign: 'center' }}>
					<img
						src={fixDropboxUrl((a.image as string) || (a.images as string[])?.[0])}
						alt={a.name}
						style={{
							width: '120px',
							height: '80px',
							objectFit: 'cover',
							borderRadius: '6px',
						}}
						onError={(e) => ((e.target as HTMLImageElement).src = '/no-image.png')}
					/>
					<p style={{ margin: '5px 0 0', fontWeight: 'bold' }}>{a.name}</p>
					<p style={{ margin: 0, fontSize: '12px', color: '#555' }}>{a.city}</p>
				</div>
			)}
		/>
	);
};

export default AccommodationsMap;
