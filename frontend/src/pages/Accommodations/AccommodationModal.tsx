import React from 'react';
import '../../styles/components/accommodation/_accommodation-modal.scss';

type AccommodationModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

const AccommodationModal = React.memo(({ isOpen, onClose, children }: AccommodationModalProps) => {
	if (!isOpen) return null;

	return (
		<div
			className="accommodation-modal-overlay"
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === 'Escape') onClose();
			}}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="accommodation-modal-content"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="document"
			>
				<button type="button" className="accommodation-modal-close" onClick={onClose}>
					&#10006;
				</button>
				{children}
			</div>
		</div>
	);
});

AccommodationModal.displayName = 'AccommodationModal';

export default AccommodationModal;
