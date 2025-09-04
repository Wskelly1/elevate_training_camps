'use client';

import Layout from "../../components/layout";
import { Calendar, Clock, MapPin, Users, CheckCircle, Star, CreditCard, Gift, Zap, Award, Target, Heart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { getTrainingPackages, getUpcomingCamps, getPaymentOptions, getWhatsIncluded } from "../../lib/queries";
import { SanityTrainingPackage, SanityUpcomingCamp, SanityPaymentOption, SanityWhatsIncluded } from "../../lib/types";

/**
 * RegistrationPage - Comprehensive registration and pricing page for Elevate Training Camps
 *
 * This component displays detailed registration information, pricing tiers, and upcoming
 * camp details. It provides users with complete information about costs, discounts,
 * payment options, and what to expect during the registration process.
 *
 * Features:
 * - Detailed pricing tiers with feature comparisons
 * - Early bird discounts and special offers
 * - Registration timeline and important dates
 * - Payment options and policies
 * - What's included in each package
 * - Call-to-action for registration
 *
 * @returns {JSX.Element} The comprehensive registration and pricing page
 */
export default function RegistrationPage() {
  const [trainingPackages, setTrainingPackages] = useState<SanityTrainingPackage[]>([]);
  const [upcomingCampsData, setUpcomingCampsData] = useState<SanityUpcomingCamp[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<SanityPaymentOption[]>([]);
  const [whatsIncluded, setWhatsIncluded] = useState<SanityWhatsIncluded[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packages, camps, payments, included] = await Promise.all([
          getTrainingPackages(),
          getUpcomingCamps(),
          getPaymentOptions(),
          getWhatsIncluded()
        ]);

        setTrainingPackages(packages || []);
        setUpcomingCampsData(camps || []);
        setPaymentOptions(payments || []);
        setWhatsIncluded(included || []);
      } catch (error) {
        console.error("Error fetching registration data:", error);
        // Set fallback data if Sanity fails
        setTrainingPackages([]);
        setUpcomingCampsData([]);
        setPaymentOptions([]);
        setWhatsIncluded([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Icon mapping function
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      award: Award,
      mappin: MapPin,
      zap: Zap,
      users: Users,
      target: Target,
      clock: Clock,
      heart: Heart
    };
    return iconMap[iconName] || Award;
  };

  // Fallback data if Sanity is empty
  const fallbackPackages = [
    {
      _id: "fallback-package-1",
      name: "Basic Camp",
      description: "Perfect for athletes new to high-altitude training",
      price: 1200,
      originalPrice: 1400,
      duration: "3 days",
      features: [
        "High-altitude training sessions",
        "Basic performance testing",
        "Group coaching sessions",
        "Accommodation (shared rooms)",
        "All meals included",
        "Training gear rental",
        "Welcome package"
      ],
      popular: false,
      order: 0,
      active: true
    },
    {
      _id: "fallback-package-2",
      name: "Premium Camp",
      description: "Our most popular option with comprehensive training",
      price: 1800,
      originalPrice: 2200,
      duration: "5 days",
      features: [
        "Everything in Basic Camp",
        "Individual coaching sessions",
        "Advanced performance testing",
        "Nutrition consultation",
        "Recovery and massage therapy",
        "Private accommodation",
        "Personalized training plan",
        "Follow-up coaching (1 month)",
        "Exclusive training gear"
      ],
      popular: true,
      order: 1,
      active: true
    },
    {
      _id: "fallback-package-3",
      name: "Elite Camp",
      description: "Intensive training for serious athletes",
      price: 2800,
      originalPrice: 3200,
      duration: "7 days",
      features: [
        "Everything in Premium Camp",
        "Daily individual coaching",
        "Comprehensive performance analysis",
        "Mental performance coaching",
        "Sports psychology sessions",
        "Luxury accommodation",
        "Personal chef consultation",
        "Follow-up coaching (3 months)",
        "Competition preparation",
        "Priority booking for future camps"
      ],
      popular: false,
      order: 2,
      active: true
    }
  ];

  const fallbackWhatsIncluded = [
    {
      _id: "fallback-included-1",
      category: "Training & Coaching",
      items: [
        "High-altitude training sessions",
        "Individual and group coaching",
        "Performance testing and analysis",
        "Personalized training plans",
        "Mental performance coaching"
      ],
      icon: "award",
      order: 0,
      active: true
    },
    {
      _id: "fallback-included-2",
      category: "Accommodation & Meals",
      items: [
        "Comfortable lodging in Flagstaff",
        "All meals and snacks included",
        "Nutrition consultation",
        "Recovery facilities access"
      ],
      icon: "mappin",
      order: 1,
      active: true
    },
    {
      _id: "fallback-included-3",
      category: "Equipment & Gear",
      items: [
        "Training equipment rental",
        "Performance tracking devices",
        "Exclusive Elevate gear",
        "Welcome package with essentials"
      ],
      icon: "zap",
      order: 2,
      active: true
    },
    {
      _id: "fallback-included-4",
      category: "Support & Follow-up",
      items: [
        "24/7 support during camp",
        "Follow-up coaching sessions",
        "Progress tracking",
        "Community access"
      ],
      icon: "users",
      order: 3,
      active: true
    }
  ];

  const fallbackCamps = [
    {
      _id: "fallback-camp-1",
      date: "March 15-19, 2025",
      type: "Premium Camp",
      spots: "8 spots remaining",
      location: "Flagstaff, AZ",
      earlyBird: true,
      earlyBirdEnds: "February 15, 2025",
      order: 0,
      active: true
    },
    {
      _id: "fallback-camp-2",
      date: "April 12-16, 2025",
      type: "Basic Camp",
      spots: "12 spots remaining",
      location: "Flagstaff, AZ",
      earlyBird: true,
      earlyBirdEnds: "March 12, 2025",
      order: 1,
      active: true
    },
    {
      _id: "fallback-camp-3",
      date: "May 10-16, 2025",
      type: "Elite Camp",
      spots: "4 spots remaining",
      location: "Flagstaff, AZ",
      earlyBird: false,
      earlyBirdEnds: null,
      order: 2,
      active: true
    }
  ];

  const fallbackPaymentOptions = [
    {
      _id: "fallback-1",
      name: "Full Payment",
      description: "Pay in full and receive an additional 5% discount on your total cost.",
      discount: "Save 5%",
      order: 0,
      active: true
    },
    {
      _id: "fallback-2",
      name: "2-Payment Plan",
      description: "Split your payment into two equal installments with no additional fees.",
      discount: "50% + 50%",
      order: 1,
      active: true
    },
    {
      _id: "fallback-3",
      name: "Monthly Plan",
      description: "Spread your payments over 3-6 months with a small processing fee.",
      discount: "3-6 months",
      order: 2,
      active: true
    }
  ];

  // Use Sanity data if available, otherwise use fallback
  const displayPackages = trainingPackages.length > 0 ? trainingPackages : fallbackPackages;
  const displayCamps = upcomingCampsData.length > 0 ? upcomingCampsData : fallbackCamps;
  const displayPaymentOptions = paymentOptions.length > 0 ? paymentOptions : fallbackPaymentOptions;
  const displayWhatsIncluded = whatsIncluded.length > 0 ? whatsIncluded : fallbackWhatsIncluded;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fbf9f3] to-[#fff9eb]">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#427b4d]/10 to-[#755f4f]/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <Calendar className="h-16 w-16 mx-auto text-[#427b4d] mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Registration & Pricing
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Secure your spot for an unforgettable high-altitude training experience.
                Choose from our comprehensive camp packages designed for every athlete.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#427b4d] hover:bg-[#387143] text-white px-8 py-4 text-lg"
              >
                Register Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#427b4d] text-[#427b4d] hover:bg-[#427b4d] hover:text-white px-8 py-4 text-lg"
              >
                Download Brochure
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Choose Your Training Package
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                All packages include accommodation, meals, and comprehensive training.
                Early bird discounts available for limited time!
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {displayPackages.map((tier, index) => (
                <div
                  key={tier._id || index}
                  className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    tier.popular ? 'ring-2 ring-[#427b4d] scale-105' : 'border border-gray-200'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#427b4d] text-white px-6 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-gray-600 mb-6">{tier.description}</p>

                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                        {tier.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">${tier.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{tier.duration}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#427b4d] mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-4 text-lg font-semibold ${
                      tier.popular
                        ? 'bg-[#427b4d] hover:bg-[#387143] text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    Choose {tier.name}
                  </Button>
                </div>
              ))}
            </div>


          </div>
        </section>

        {/* Upcoming Camps */}
        <section className="py-20 bg-[#fff9eb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Upcoming Training Camps
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Book your spot for our upcoming high-altitude training camps in Flagstaff, Arizona.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {displayCamps.map((camp, index) => (
                <div key={camp._id || index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      camp.earlyBird ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {camp.earlyBird ? 'Early Bird Available' : 'Regular Pricing'}
                    </span>
                    <span className="text-sm text-gray-600">{camp.spots}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{camp.type}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{camp.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{camp.location}</span>
                    </div>
                    {camp.earlyBird && camp.earlyBirdEnds && (
                      <div className="flex items-center text-green-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">Early bird ends {camp.earlyBirdEnds}</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full bg-[#427b4d] hover:bg-[#387143] text-white">
                    Register for This Camp
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What's Included
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every training camp package includes comprehensive services and amenities
                to ensure you get the most out of your high-altitude training experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayWhatsIncluded.map((category, index) => {
                const IconComponent = getIcon(category.icon);
                return (
                  <div key={category._id || index} className="text-center">
                    <div className="bg-[#fff9eb] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-[#427b4d]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.category}</h3>
                    <ul className="space-y-2 text-left">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start text-gray-600">
                          <CheckCircle className="h-4 w-4 text-[#427b4d] mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team & Group Pricing */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Users className="h-16 w-16 mx-auto text-[#427b4d] mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Team & Group Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Special pricing for teams and groups. The more athletes you bring, the more you save!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Team/Group Pricing */}
              <div className="bg-[#fff9eb] rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Team / Group Pricing</h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-[#427b4d] pl-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">10 Athletes</h4>
                    <p className="text-lg font-bold text-[#427b4d] mb-2">$1,350 per person</p>
                    <p className="text-gray-600 mb-3">4-week program with Airbnb-style housing</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Housing included</li>
                      <li>• Van rental</li>
                      <li>• Groceries</li>
                      <li>• Training support</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-[#427b4d] pl-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">12-14 Athletes</h4>
                    <p className="text-lg font-bold text-[#427b4d] mb-2">$1,200 - $1,250 per person</p>
                    <p className="text-gray-600 mb-3">Best value - shared housing and van rental costs</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Shared housing</li>
                      <li>• Van rental split among group</li>
                      <li>• Groceries</li>
                      <li>• Training support</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-[#427b4d] pl-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">6-8 Athletes</h4>
                    <p className="text-lg font-bold text-[#427b4d] mb-2">$1,500 - $1,600 per person</p>
                    <p className="text-gray-600 mb-3">Smaller groups - higher per-person costs</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Housing included</li>
                      <li>• Van rental</li>
                      <li>• Groceries</li>
                      <li>• Training support</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Hostel-Style Option */}
              <div className="bg-[#fff9eb] rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Hostel-Style Option</h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-[#755f4f] pl-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Solo Athletes & Pairs</h4>
                    <p className="text-lg font-bold text-[#755f4f] mb-2">$1,400 - $1,500 per person</p>
                    <p className="text-gray-600 mb-3">4-week program with shared housing</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Shared housing with other athletes</li>
                      <li>• Paired with athletes from other schools/teams</li>
                      <li>• Transport included</li>
                      <li>• Groceries included</li>
                      <li>• Training support</li>
        </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="font-semibold text-yellow-800 mb-2">Important Note:</h5>
                    <p className="text-sm text-yellow-700">
                      Meals out, personal spending, and travel to Flagstaff are <strong>not included</strong> in these prices.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-800 mb-2">Final Pricing:</h5>
                    <p className="text-sm text-blue-700">
                      Final cost depends on total headcount for the session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Options */}
        <section className="py-20 bg-[#fff9eb]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <CreditCard className="h-16 w-16 mx-auto text-[#427b4d] mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Flexible Payment Options
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We offer flexible payment plans to make high-altitude training accessible to every athlete.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {displayPaymentOptions.map((option, index) => (
                <div key={option._id || index} className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{option.name}</h3>
                  <div className="text-3xl font-bold text-[#427b4d] mb-2">{option.discount}</div>
                  <p className="text-gray-600">{option.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6">
                Contact us to discuss payment options and secure your spot in our next training camp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-[#427b4d] hover:bg-[#387143] text-white px-8 py-4 text-lg"
                >
                  Register Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#427b4d] text-[#427b4d] hover:bg-[#427b4d] hover:text-white px-8 py-4 text-lg"
                >
                  Call (651) 207-4749
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
