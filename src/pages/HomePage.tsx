import React, { useState, useEffect } from 'react';

const HomePage: React.FC = () => {

  const testimonials = [
    {
      id: 1,
      name: "Sarah Jenkins",
      studentType: "Member for 2 years",
      rating: 5,
      quote: "OmYogVidya has become my sanctuary. The gentle guidance and supportive community have helped me find balance in both my practice and daily life. Every session leaves me feeling renewed.",
    },
    {
      id: 2,
      name: "David Miller",
      studentType: "Hatha Yoga Student",
      rating: 4,
      quote: "As someone new to yoga, I was nervous at first. But the instructor's patient approach made me feel welcome. I've gained strength, flexibility, and most importantly, inner peace.",
    },
    {
      id: 3,
      name: "Elena Kovac",
      studentType: "Vinyasa Enthusiast",
      rating: 5,
      quote: "The flowing sequences in Vinyasa classes are pure poetry in motion. Each breath connects me deeper to myself. This practice has transformed how I approach challenges in life.",
    },
  ];

  // Hero carousel images configuration
  const heroImages = [
    {
      src: "/hero.png",
      alt: "Serene yoga session in a bright studio",
      title: "Find Your Flow",
      subtitle: "Reconnect with Self"
    }
    // Additional images can be added here as they become available
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance carousel (only if multiple images)
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          (prevIndex + 1) % heroImages.length
        );
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  const goToNextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % heroImages.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + heroImages.length) % heroImages.length
    );
  };

  const currentImage = heroImages[currentImageIndex];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Smooth Transitions */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-sage-800/20"></div>
        </div>

        {/* Navigation Controls (only show if multiple images) */}
        {heroImages.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-wood-500/80 hover:bg-wood-600 text-white p-3 rounded-full transition-all transform hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={goToNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-wood-500/80 hover:bg-wood-600 text-white p-3 rounded-full transition-all transform hover:scale-110"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-wood-500 scale-110'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-2xl bg-cream-50/80 backdrop-blur-sm p-10 md:p-16 border-l-4 border-wood-500">
            <h1 className="text-5xl md:text-6xl mb-6 text-stone-900 leading-tight">
              {currentImage.title}, <br/>
              <span className="italic font-normal text-sage-600">{currentImage.subtitle}</span>
            </h1>
            <p className="text-lg text-stone-700 mb-8 leading-relaxed">
              Experience a journey of mindfulness and physical well-being through professional guided yoga practices tailored for every level.
            </p>
            <a className="inline-block bg-wood-500 hover:bg-wood-700 text-white px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all transform hover:-translate-y-1" href="/booking">
              Begin Your Journey
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-cream-100" id="about">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Instructor Portrait */}
              <img
                alt="Yoga Instructor Portrait"
                className="w-full h-auto shadow-2xl"
                src="/instructor.png"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-sage-200 -z-10"></div>
            </div>
            <div>
              <span className="text-wood-500 font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Meet Your Instructor</span>
              <h2 className="text-4xl mb-6 text-stone-900">Guided by Grace, Grounded in Peace</h2>
              <p className="text-stone-600 mb-6 leading-loose">
                With over 10 years of experience in Hatha and Vinyasa yoga, I help students find balance both on and off the mat. My approach combines traditional techniques with modern mindfulness practices to help you build strength, flexibility, and inner calm.
              </p>
              <p className="text-stone-600 mb-8 leading-loose">
                Yoga is more than just movement; it's a conversation between the body, mind, and spirit. I am here to facilitate that dialogue and support your personal growth.
              </p>
              <div className="flex items-center space-x-4">
                <div className="h-px w-12 bg-sage-600"></div>
                <span className="font-serif italic text-xl text-sage-800">Elena Serene</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yoga Styles Section */}
      <section className="py-24 bg-white" id="styles">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl mb-16 text-stone-900">Practices for Every Body</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Style 1: Vinyasa */}
            <div className="group p-8 border border-sage-100 hover:bg-sage-50 transition-all duration-300">
              <div className="mb-6 overflow-hidden">
                <img
                  alt="Vinyasa Flow"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  src="/vinyasa.png"
                />
              </div>
              <h3 className="text-2xl mb-4 text-sage-800">Vinyasa Flow</h3>
              <p className="text-stone-600 leading-relaxed">Dynamic sequences that synchronize breath with movement to build heat and focus.</p>
            </div>

            {/* Style 2: Yin Yoga */}
            <div className="group p-8 border border-sage-100 hover:bg-sage-50 transition-all duration-300">
              <div className="mb-6 overflow-hidden">
                <img
                  alt="Yin Yoga"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  src="/yin.png"
                />
              </div>
              <h3 className="text-2xl mb-4 text-sage-800">Yin Yoga</h3>
              <p className="text-stone-600 leading-relaxed">Slow-paced practice targeting deep connective tissues through long-held passive poses.</p>
            </div>

            {/* Style 3: Restorative */}
            <div className="group p-8 border border-sage-100 hover:bg-sage-50 transition-all duration-300">
              <div className="mb-6 overflow-hidden">
                <img
                  alt="Restorative Yoga"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  src="/restorative.png"
                />
              </div>
              <h3 className="text-2xl mb-4 text-sage-800">Restorative</h3>
              <p className="text-stone-600 leading-relaxed">Deep relaxation using props to support the body, allowing for total release and recovery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Shared Journey - Testimonials */}
      <section className="py-24 bg-cream-100" id="testimonials">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-6 text-stone-900">
              Our Shared Journey
            </h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto">
              Read the stories of transformation and peace from our community. Every breath counts, and every journey is unique.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 border border-sage-100 hover:shadow-lg transition-shadow duration-300">
                {/* Profile Section */}
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-sage-800 text-xl font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-stone-900 font-semibold text-lg">
                      {testimonial.name}
                    </h3>
                    <p className="text-stone-600 text-sm">
                      {testimonial.studentType}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="text-wood-500 text-lg">
                    {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-stone-600 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Practice Style */}
                <div className="text-stone-500 text-sm mt-auto pt-4 border-t border-sage-100">
                  <span className="text-wood-500 font-medium">
                    Yoga Practice
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H-04: Share Your Experience Button - moved below testimonials with 24px margin */}
      <section className="pt-6 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <a
              href="/contact"
              className="btn-primary px-8 py-3 hover:scale-105 transform transition-all duration-300"
            >
              Share Your Experience
            </a>
          </div>
        </div>
      </section>

      {/* CTA Banner - H-05: Removed decorative dots, using solid dark green background */}
      <section className="py-20 bg-secondary-800 relative">
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
            Ready to Transform
            <span className="block text-accent-200">Your Life?</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Take the first step toward better health, inner peace, and spiritual growth.
            Your yoga journey begins with a single breath.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button className="btn-secondary text-lg px-10 py-4 hover:bg-accent-600 hover:scale-105 transform transition-all duration-300 shadow-lg">
              Book Your First Session
            </button>
            <button className="border-2 border-white text-white text-lg px-10 py-4 rounded-md hover:bg-white hover:text-secondary-600 transition-all duration-300 hover:scale-105 transform min-h-[44px]">
              Contact Us
            </button>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 text-secondary-200">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-serif mb-1">500+</div>
              <div className="text-sm">Happy Students</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-serif mb-1">15+</div>
              <div className="text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-serif mb-1">1000+</div>
              <div className="text-sm">Sessions Taught</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;