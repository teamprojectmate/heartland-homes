import React from "react";
import { Link } from "react-router-dom";

const dummyOffers = [
  {
    id: 1,
    title: "Коротка поїздка, якісний відпочинок",
    description: "Економте до 20% із Сезонною пропозицією",
    image: "https://via.placeholder.com/300x200.png?text=Offer+1",
    link: "#",
  },
  {
    id: 2,
    title: "Життя мрії в будинку для відпочинку",
    description: "Вибирайте з-поміж будинків, вілл, шале тощо.",
    image: "https://via.placeholder.com/300x200.png?text=Offer+2",
    link: "#",
  },
  {
    id: 3,
    title: "Вирушайте у нову пригоду",
    description: "Досліджуйте світ та знаходьте незабутні помешкання.",
    image: "https://via.placeholder.com/300x200.png?text=Offer+3",
    link: "#",
  },
];

const Offers = () => {
  return (
    <div className="offers-section">
      <div className="container">
        <h2 className="section-heading">Пропозиції</h2>
        <p className="section-subheading">Акції, знижки та спеціальні пропозиції для вас</p>
        <div className="row">
          {dummyOffers.map((offer) => (
            <div key={offer.id} className="col-md-4 mb-4">
              <div className="card card-custom">
                <img src={offer.image} className="card-img-top card-img-top-custom" alt={offer.title} />
                <div className="card-body">
                  <h5 className="card-title">{offer.title}</h5>
                  <p className="card-text">{offer.description}</p>
                  <Link to={offer.link} className="btn btn-primary">
                    Дізнатися більше
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;
