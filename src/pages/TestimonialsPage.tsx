import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { testimonialSchema, validateInput, type TestimonialInput } from '../lib/validations';

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  practice_style?: string;
  student_type?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<TestimonialInput>({
    name: '',
    email: '',
    practiceStyle: 'Hatha',
    content: '',
    rating: 5,
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load approved testimonials
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'approved')
          .order('submitted_at', { ascending: false });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
    // Clear errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors([]);

    // Client-side validation
    const validation = validateInput(testimonialSchema, formData);
    if (!validation.success) {
      setFormErrors(validation.errors);
      setSubmitting(false);
      return;
    }

    try {
      // Submit testimonial (will have pending status by default)
      const { error } = await supabase
        .from('testimonials')
        .insert([{
          name: validation.data.name,
          email: validation.data.email || null,
          content: validation.data.content,
          rating: validation.data.rating,
          practice_style: validation.data.practiceStyle || null,
          status: 'pending'
        }] as any);

      if (error) throw error;

      // Success feedback
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        practiceStyle: 'Hatha',
        content: '',
        rating: 5,
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error('Error submitting testimonial:', error);
      setFormErrors([error.message || 'Failed to submit testimonial. Please try again.']);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };
  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-secondary-900 mb-6">
            Our Shared Journey
          </h1>
          <p className="text-lg text-secondary-700 max-w-3xl mx-auto">
            Read the stories of transformation and peace from our community. Every breath counts, and every journey is unique.
          </p>
          <div className="mt-8">
            <button
              onClick={() => document.getElementById('testimonial-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary px-6 py-3"
            >
              Share Your Experience
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-secondary-600">Loading our community stories...</div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-secondary-600">Be the first to share your transformation journey!</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="card bg-primary-50 border border-primary-200">
                  {/* Profile Image Placeholder */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-accent-200 rounded-full flex items-center justify-center mr-4">
                      <span className="text-accent-700 text-xl font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-secondary-900 font-semibold text-lg">
                        {testimonial.name}
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        {testimonial.student_type || `${testimonial.practice_style} Student`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="text-accent-500 text-lg">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  <p className="text-secondary-700 mb-4 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="text-secondary-500 text-sm mt-auto pt-4 border-t border-primary-200">
                    {testimonial.practice_style && (
                      <span className="text-accent-600 font-medium">
                        {testimonial.practice_style} Practice
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Testimonial Form */}
        <div id="testimonial-form" className="max-w-2xl mx-auto">
          <div className="card bg-primary-50 border border-primary-200">
            <h2 className="text-2xl font-serif text-secondary-900 mb-6 text-center">
              Share Your Experience
            </h2>

            {/* Success Message */}
            {submitSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <p className="font-medium">Thank you for your testimonial!</p>
                <p className="text-sm">Your testimonial has been submitted for review and will appear on the page once approved.</p>
              </div>
            )}

            {/* Error Messages */}
            {formErrors.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-medium">Please fix the following errors:</p>
                <ul className="list-disc list-inside text-sm">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-secondary-800 font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-secondary-800 font-medium mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-secondary-800 font-medium mb-2">
                  Practice Style
                </label>
                <select
                  name="practiceStyle"
                  value={formData.practiceStyle}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="Hatha">Hatha Yoga</option>
                  <option value="Vinyasa">Vinyasa Flow</option>
                  <option value="Yin">Yin Yoga</option>
                  <option value="Restorative">Restorative Yoga</option>
                </select>
              </div>

              <div>
                <label className="block text-secondary-800 font-medium mb-2">
                  Rating *
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-secondary-800 font-medium mb-2">
                  Your Testimonial *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="input"
                  rows={5}
                  placeholder="Share your experience with our yoga practice..."
                  required
                  maxLength={1000}
                />
                <div className="text-sm text-secondary-600 mt-1">
                  {formData.content.length}/1000 characters
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Testimonial'}
                </button>
              </div>

              <div className="text-sm text-secondary-600 text-center">
                <p>Your testimonial will be reviewed before appearing on the page.</p>
                <p>We respect your privacy and will never share your email address.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;