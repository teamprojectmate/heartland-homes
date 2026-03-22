import { useTranslation } from 'react-i18next';
import BaseMap from '../../components/BaseMap';
import type { Accommodation } from '../../types';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';
import { localized, mapCity } from '../../utils/translations';

const AccommodationsMap = ({
	accommodations = [],
	highlightedId,
}: {
	accommodations?: Accommodation[];
	highlightedId: number | null;
}) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	return (
		<BaseMap
			items={accommodations}
			highlightedId={highlightedId}
			renderPopup={(a) => (
				<div style={{ textAlign: 'center' }}>
					<img
						src={fixDropboxUrl((a.image as string) || (a.images as string[])?.[0])}
						alt={localized(a.name, a.nameUk as string | undefined, lang)}
						style={{
							width: '120px',
							height: '80px',
							objectFit: 'cover',
							borderRadius: '6px',
						}}
						onError={(e) => ((e.target as HTMLImageElement).src = '/no-image.png')}
					/>
					<p style={{ margin: '5px 0 0', fontWeight: 'bold' }}>
						{localized(a.name, a.nameUk as string | undefined, lang)}
					</p>
					<p style={{ margin: 0, fontSize: '12px', color: '#555' }}>{mapCity(a.city, t)}</p>
				</div>
			)}
		/>
	);
};

export default AccommodationsMap;
