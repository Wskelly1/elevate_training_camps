'use client';

import Layout from "../../components/layout";
import { Target, Users, Clock, MapPin, Star, CheckCircle, Award, TrendingUp, Heart, Zap } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { getCoachingPrograms, getCoachingBenefits, getCoachingTestimonials } from "../../lib/queries";
import { SanityCoachingProgram, SanityCoachingBenefit, SanityCoachingTestimonial } from "../../lib/types";

/**
 * Coaching Page - Comprehensive coaching services for Elevate Training Camps
 *
 * This page showcases the various coaching programs and services offered,
 * including individual coaching, group training, and specialized programs.
 * Features detailed information about coaching methodologies, pricing,
 * and how to get started with professional coaching services.
 */
export default function CoachingPage() {
  const [coachingPrograms, setCoachingPrograms] = useState<SanityCoachingProgram[]>([]);
  const [coachingBenefits, setCoachingBenefits] = useState<SanityCoachingBenefit[]>([]);
  const [testimonials, setTestimonials] = useState<SanityCoachingTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programs, benefits, coachingTestimonials] = await Promise.all([
          getCoachingPrograms(),
          getCoachingBenefits(),
          getCoachingTestimonials()
        ]);

        setCoachingPrograms(programs || []);
        setCoachingBenefits(benefits || []);
        setTestimonials(coachingTestimonials || []);
      } catch (error) {
        console.error("Error fetching coaching data:", error);
        // Set fallback data if Sanity fails
        setCoachingPrograms([]);
        setCoachingBenefits([]);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Icon mapping function
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      target: Target,
      users: Users,
      mappin: MapPin,
      zap: Zap,
      award: Award,
      clock: Clock,
      trendingup: TrendingUp,
      heart: Heart
    };
    return iconMap[iconName] || Target;
  };

  // Fallback data if Sanity is empty
  const fallbackPrograms = [
    {
      title: "Individual Performance Coaching",
      description: "One-on-one coaching sessions tailored to your specific athletic goals and needs.",
      features: [
        "Personalized training plans",
        "Performance analysis and feedback",
        "Goal setting and progress tracking",
        "Nutrition and recovery guidance",
        "Mental performance coaching"
      ],
      duration: "60-90 minutes per session",
      price: "Starting at $150/session",
      icon: Target,
      popular: true
    },
    {
      title: "Group Training Programs",
      description: "Small group coaching sessions for athletes looking to train with peers.",
      features: [
        "Small group sizes (4-6 athletes)",
        "Competitive training environment",
        "Peer motivation and support",
        "Cost-effective coaching",
        "Team building exercises"
      ],
      duration: "90 minutes per session",
      price: "Starting at $75/session",
      icon: Users,
      popular: false
    },
    {
      title: "High-Altitude Training Camps",
      description: "Intensive multi-day training camps at our Flagstaff location.",
      features: [
        "3-7 day intensive programs",
        "High-altitude adaptation training",
        "Comprehensive performance testing",
        "Lodging and meals included",
        "Follow-up coaching support"
      ],
      duration: "3-7 days",
      price: "Starting at $1,200/camp",
      icon: MapPin,
      popular: true
    },
    {
      title: "Virtual Coaching Programs",
      description: "Remote coaching services for athletes who can't attend in-person sessions.",
      features: [
        "Video analysis and feedback",
        "Online training plans",
        "Weekly check-ins via video call",
        "Progress tracking apps",
        "24/7 support access"
      ],
      duration: "Ongoing monthly programs",
      price: "Starting at $200/month",
      icon: Zap,
      popular: false
    }
  ];

  const fallbackBenefits = [
    {
      title: "Expert Guidance",
      description: "Learn from certified coaches with years of experience in high-performance athletics.",
      icon: Award
    },
    {
      title: "Proven Results",
      description: "Our athletes consistently achieve personal bests and reach their competitive goals.",
      icon: TrendingUp
    },
    {
      title: "Personalized Approach",
      description: "Every program is tailored to your specific needs, goals, and current fitness level.",
      icon: Heart
    },
    {
      title: "High-Altitude Advantage",
      description: "Train at 7,000 feet elevation for natural performance enhancement and adaptation.",
      icon: MapPin
    }
  ];

  const fallbackTestimonials = [
    {
      name: "Sarah Johnson",
      sport: "Track & Field",
      quote: "The individual coaching program transformed my performance. I shaved 15 seconds off my 5K time in just 3 months!",
      rating: 5
    },
    {
      name: "Mike Chen",
      sport: "Cycling",
      quote: "The high-altitude training camp was incredible. I felt stronger and more confident in my races after just one week.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      sport: "Swimming",
      quote: "The virtual coaching program kept me on track during the pandemic. My coach's guidance was invaluable.",
      rating: 5
    }
  ];

  // Use Sanity data if available, otherwise use fallback
  const displayPrograms = coachingPrograms.length > 0 ? coachingPrograms : fallbackPrograms;
  const displayBenefits = coachingBenefits.length > 0 ? coachingBenefits : fallbackBenefits;
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fbf9f3] to-[#fff9eb]">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#427b4d]/10 to-[#755f4f]/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <Target className="h-16 w-16 mx-auto text-[#427b4d] mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Professional Coaching
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Unlock your athletic potential with personalized coaching from certified professionals.
                Train at high altitude in Flagstaff, Arizona, and achieve your performance goals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#427b4d] hover:bg-[#387143] text-white px-8 py-4 text-lg"
              >
                Book a Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#427b4d] text-[#427b4d] hover:bg-[#427b4d] hover:text-white px-8 py-4 text-lg"
              >
                View Programs
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our Coaching?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our certified coaches bring decades of experience and proven methodologies to help you reach your athletic potential.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayBenefits.map((benefit, index) => {
                const IconComponent = getIcon(benefit.icon);
                return (
                  <div key={benefit._id || index} className="text-center p-6 rounded-lg bg-[#fff9eb] hover:shadow-lg transition-shadow">
                    <IconComponent className="h-12 w-12 mx-auto text-[#427b4d] mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-20 bg-[#fff9eb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Coaching Programs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from a variety of coaching programs designed to meet your specific needs and goals.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {displayPrograms.map((program, index) => {
                const IconComponent = getIcon(program.icon);
                return (
                  <div
                    key={program._id || index}
                    className={`relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow ${
                      program.popular ? 'ring-2 ring-[#427b4d]' : ''
                    }`}
                  >
                    {program.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#427b4d] text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="flex items-center mb-6">
                      <IconComponent className="h-8 w-8 text-[#427b4d] mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">{program.name || program.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{program.description}</p>
                    <ul className="space-y-3 mb-6">
                      {program.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-[#427b4d] mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm">{program.duration}</span>
                        </div>
                        <div className="text-2xl font-bold text-[#427b4d]">
                          {program.price ? `$${program.price}` : program.price}
                        </div>
                      </div>
                      <Button className="w-full bg-[#427b4d] hover:bg-[#387143] text-white">
                        Learn More
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What Our Athletes Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from athletes who have transformed their performance with our coaching programs.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {displayTestimonials.map((testimonial, index) => (
                <div key={testimonial._id || index} className="bg-[#fff9eb] p-8 rounded-xl">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-[#427b4d] text-sm">{testimonial.sport}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#427b4d] to-[#387143]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Elevate Your Performance?
              </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Take the first step towards achieving your athletic goals. Book a free consultation
              to discuss your training needs and discover which coaching program is right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#427b4d] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Book Free Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[#427b4d] px-8 py-4 text-lg"
              >
                Call (651) 207-4749
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
