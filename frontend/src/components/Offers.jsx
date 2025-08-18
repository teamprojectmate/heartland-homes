import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/_offers.scss";
import "../styles/components/_cards.scss";
import "../styles/components/_buttons.scss";
import "../styles/layout/_main-layout.scss";

const dummyOffers = [
  {
    id: 1,
    title: "Коротка поїздка, якісний відпочинок",
    description: "Економте до 20% із Сезонною пропозицією",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "#",
  },
  {
    id: 2,
    title: "Життя мрії в будинку для відпочинку",
    description: "Вибирайте з-поміж будинків, вілл, шале тощо.",
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "#",
  },
  {
    id: 3,
    title: "Вирушайте у нову пригоду",
    description: "Досліджуйте світ та знаходьте незабутні помешкання.",
    image: "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "#",
  },
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
          {dummyOffers.map((offer) => (
            <article key={offer.id} className="offer-card card-custom">
              <img className="offer-image" src={offer.image} alt={offer.title} />
              <div className="card-body">
                <h5 className="card-title">{offer.title}</h5>
                <p className="card-text">{offer.description}</p>
                <Link to={offer.link} className="btn-primary mt-auto">
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
