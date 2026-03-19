import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/components/_offers.scss';
import '../styles/components/_buttons.scss';

const Offers = () => {
	const { t } = useTranslation();

	const offers = [
		{
			id: 1,
			title: t('offers.offer1Title'),
			description: t('offers.offer1Desc'),
			details: t('offers.offer1Details'),
			image:
				'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
		},
		{
			id: 2,
			title: t('offers.offer2Title'),
			description: t('offers.offer2Desc'),
			details: t('offers.offer2Details'),
			image:
				'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop',
		},
		{
			id: 3,
			title: t('offers.offer3Title'),
			description: t('offers.offer3Desc'),
			details: t('offers.offer3Details'),
			image:
				'https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?q=80&w=2070&auto=format&fit=crop',
		},
		{
			id: 4,
			title: t('offers.offer4Title'),
			description: t('offers.offer4Desc'),
			details: t('offers.offer4Details'),
			image:
				'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop',
		},
	];

	const [selectedOffer, setSelectedOffer] = useState<{
		title: string;
		description: string;
		details: string;
		image: string;
	} | null>(null);

	return (
		<>
			<div className="offers-grid">
				{offers.map(({ id, title, description, image, details }) => (
					<article key={id} className="offer-card">
						<img className="offer-image" src={image} alt={title} loading="lazy" />
						<div className="card-body">
							<h5 className="card-title">{title}</h5>
							<p className="card-text">{description}</p>
							<button
								type="button"
								className="btn-primary mt-auto"
								onClick={() => setSelectedOffer({ title, description, details, image })}
							>
								{t('common.learnMore')}
							</button>
						</div>
					</article>
				))}
			</div>

			{selectedOffer && (
				<div
					className="modal-overlay"
					onClick={() => setSelectedOffer(null)}
					onKeyDown={(e) => {
						if (e.key === 'Escape') setSelectedOffer(null);
					}}
					role="dialog"
					aria-modal="true"
					aria-labelledby="offer-title"
				>
					<div
						className="modal-content"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="document"
					>
						<button
							type="button"
							className="modal-close"
							aria-label={t('common.close')}
							onClick={() => setSelectedOffer(null)}
						>
							✖
						</button>
						<img src={selectedOffer.image} alt={selectedOffer.title} className="modal-image" />
						<h3 id="offer-title">{selectedOffer.title}</h3>
						<p>{selectedOffer.details}</p>
					</div>
				</div>
			)}
		</>
	);
};

export default Offers;
