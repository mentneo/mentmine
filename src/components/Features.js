import React from 'react';
// Example: Using different icons, you might need to install a different icon pack or use SVGs
import { FaScroll, FaFlask, FaHatWizard, FaStar, FaShieldAlt } from 'react-icons/fa'; // Placeholder icons

function Features() {
  const features = [
    {
      icon: <FaScroll className="h-12 w-12 text-starlight" />,
      title: "Ancient Scrolls (Affordable Pricing)",
      description: "Unlock potent knowledge at prices even a humble apprentice can afford.",
      delay: 0
    },
    {
      icon: <FaFlask className="h-12 w-12 text-starlight" />,
      title: "Alchemic Projects (Live Projects)",
      description: "Transmute theory into practical skills with hands-on, real-world enchantments.",
      delay: 100
    },
    {
      icon: <FaHatWizard className="h-12 w-12 text-starlight" />,
      title: "Archmage Mentors (Expert Mentors)",
      description: "Learn from seasoned sorcerers of the digital realm.",
      delay: 200
    },
    {
      icon: <FaStar className="h-12 w-12 text-starlight" />,
      title: "Sigils of Mastery (Certification)",
      description: "Earn recognized sigils that mark your prowess and open new gateways.",
      delay: 300
    },
    {
      icon: <FaShieldAlt className="h-12 w-12 text-starlight" />,
      title: "Constant Vigil (24/7 Support)",
      description: "Our magical guardians are always on watch to assist your learning quest.",
      delay: 400
    }
  ];

  return (
    <section id="features" className="py-20 bg-mystic-dark text-mystic-text">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-magic text-starlight mb-4" data-aos="fade-up">
            Discover Your Powers
          </h2>
          <p className="text-mystic-text opacity-80 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Mentneo's curriculum is imbued with ancient wisdom and modern magic,
            designed to awaken your latent tech talents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-mystic p-6 rounded-lg shadow-xl hover:shadow-starlight/30 transition-shadow duration-300 border border-mystic-light/30"
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              <div className="flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-magic text-starlight mb-3 text-center">{feature.title}</h3>
              <p className="text-mystic-text opacity-90 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
