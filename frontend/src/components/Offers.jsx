import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/_offers.scss';
import '../styles/components/_cards.scss';
import '../styles/components/_buttons.scss';
import '../styles/layout/_main-layout.scss';

const offers = [
  {
    id: 1,
    title: 'Коротка поїздка, якісний відпочинок',
    description: 'Економте до 20% із Сезонною пропозицією',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    link: '/offers/seasonal'
  },
  {
    id: 2,
    title: 'Життя мрії в будинку для відпочинку',
    description: 'Вибирайте з-поміж будинків, вілл, шале тощо.',
    image:
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop',
    link: '/offers/villas'
  },
  {
    id: 3,
    title: 'Вирушайте у нову пригоду',
    description: 'Досліджуйте світ та знаходьте незабутні помешкання.',
    image:
      'https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?q=80&w=2070&auto=format&fit=crop',
    link: '/offers/adventures'
  }
];

const Offers = () => {
  return (
    <section className="offers-section">
      <div className="container">
        <h2 className="section-heading">Пропозиції</h2>
        <p className="section-subheading">
          Акції, знижки та спеціальні пропозиції для вас
        </p>

        <div className="offers-grid">
          {offers.map(({ id, title, description, image, link }) => (
            <article key={id} className="offer-card card-custom">
              <img className="offer-image" src={image} alt={title} loading="lazy" />
              <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
                <Link to={link} className="btn-primary mt-auto">
                  Дізнатися більше
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;
