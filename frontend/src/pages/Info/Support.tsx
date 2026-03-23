import { Mail, Phone, Send } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const Support = () => {
	const { t } = useTranslation();
	const [form, setForm] = useState({ name: '', email: '', message: '' });
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
		setForm({ name: '', email: '', message: '' });
	};

	return (
		<section className="info-page container">
			<div className="info-header">
				<Mail className="info-icon" size={28} />
				<h1 className="page-title">{t('info.supportTitle')}</h1>
			</div>

			<p className="lead-text">{t('info.supportText')}</p>

			<div className="support-box">
				<p>
					<Phone size={20} /> <a href="tel:+380671234567">+380 67 123 45 67</a>
				</p>
				<p>
					<Mail size={20} />{' '}
					<a href="mailto:support@heartlandhomes.com">support@heartlandhomes.com</a>
				</p>
			</div>

			<div className="contact-form-section">
				<h2 className="contact-form-title">{t('info.contactFormTitle')}</h2>
				<p className="contact-form-subtitle">{t('info.contactFormSubtitle')}</p>

				{submitted ? (
					<div className="contact-form-success">
						<Send size={24} />
						<p>{t('info.contactFormSuccess')}</p>
					</div>
				) : (
					<form className="contact-form" onSubmit={handleSubmit}>
						<div className="contact-form-group">
							<label htmlFor="contact-name">{t('info.contactName')}</label>
							<input
								id="contact-name"
								type="text"
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder={t('info.contactNamePlaceholder')}
								required
								autoComplete="name"
							/>
						</div>

						<div className="contact-form-group">
							<label htmlFor="contact-email">{t('info.contactEmail')}</label>
							<input
								id="contact-email"
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder={t('info.contactEmailPlaceholder')}
								required
								autoComplete="email"
							/>
						</div>

						<div className="contact-form-group">
							<label htmlFor="contact-message">{t('info.contactMessage')}</label>
							<textarea
								id="contact-message"
								name="message"
								value={form.message}
								onChange={handleChange}
								placeholder={t('info.contactMessagePlaceholder')}
								rows={5}
								required
							/>
						</div>

						<button type="submit" className="btn-primary contact-form-btn">
							<Send size={16} />
							{t('info.contactSend')}
						</button>
					</form>
				)}
			</div>
		</section>
	);
};

export default Support;
