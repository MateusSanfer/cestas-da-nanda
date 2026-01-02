import React from "react";

const testimonials = [
  {
    id: 1,
    name: "Ana Clara",
    location: "Salvador, BA",
    text: "A cesta chegou impecável! Minha mãe chorou de emoção. Os produtos são de altíssima qualidade e o capricho na embalagem faz toda a diferença.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a04a582f4e2902024d",
  },
  {
    id: 2,
    name: "Felipe Santos",
    location: "Lauro de Freitas, BA",
    text: "Ótimo atendimento e entrega super rápida. A cesta 'Café Premium' superou minhas expectativas. Recomendo muito!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a042582f4e2902024d",
  },
  {
    id: 3,
    name: "Mariana Costa",
    location: "Salvador, BA",
    text: "Encomendei a cesta de chocolates para o meu namorado e ele amou. Tudo muito fresco e gostoso. Com certeza comprarei novamente.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302c",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
            O que dizem nossos clientes
          </h2>
          <div className="w-24 h-1 bg-terracotta mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-cream/30 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-1 mb-4 text-terracotta text-sm">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill"></i>
                ))}
              </div>

              <blockquote className="text-gray-600 italic mb-6 flex-grow">
                "{testimonial.text}"
              </blockquote>

              <div>
                <h4 className="font-serif font-bold text-charcoal text-lg">
                  {testimonial.name}
                </h4>
                <span className="text-warmGray text-sm uppercase tracking-wide">
                  {testimonial.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
