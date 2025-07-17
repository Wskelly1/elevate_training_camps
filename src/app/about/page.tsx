"use client";

import Layout from "../../components/layout";

const testimonials = [
  {
    quote: "Summit Flagstaff was a life-changing experience! The coaches and the scenery were incredible.",
    name: "Jane Doe",
    designation: "Camper, 2023",
    src: "/images/testimonial1.jpg",
  },
  {
    quote: "I loved every moment. The altitude training really made a difference in my performance.",
    name: "John Smith",
    designation: "Camper, 2022",
    src: "/images/testimonial2.jpg",
  },
  {
    quote: "The community and support at Summit Flagstaff is unmatched. Highly recommend!",
    name: "Emily Johnson",
    designation: "Parent, 2023",
    src: "/images/testimonial3.jpg",
  },
];

export default function AboutPage() {
  return (
    <Layout>
      <section className="py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">About Summit Flagstaff</h1>
        <p className="max-w-2xl mx-auto text-lg text-center mb-12">
          Summit Flagstaff is dedicated to providing a world-class altitude training experience in the heart of Arizona. Our camp brings together athletes, coaches, and families for an unforgettable journey of growth, learning, and adventure.
        </p>
        {/* <AnimatedTestimonials testimonials={testimonials} autoplay /> */}
      </section>
    </Layout>
  );
} 