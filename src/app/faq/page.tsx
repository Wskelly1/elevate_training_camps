"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { client, urlFor } from "../../lib/sanity";
import Image from "next/image";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

interface FAQPageSettings {
  title?: string;
  introduction?: string;
  faqPageImage?: any;
}

async function getFAQs() {
  return await client.fetch(`
    *[_type == "faq"] | order(order asc) {
      _id,
      question,
      answer
    }
  `);
}

async function getFAQPageSettings() {
  return await client.fetch(`
    *[_type == "siteSettings"][0] {
      faqPage {
        title,
        introduction,
        faqPageImage
      }
    }
  `);
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<FAQPageSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [faqsData, settingsData] = await Promise.all([getFAQs(), getFAQPageSettings()]);
        setFaqs(faqsData);
        if (settingsData && settingsData.faqPage) {
          setSettings(settingsData.faqPage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <Layout>
      <div className="relative">
        {/* Brown background container */}
        <div
          className="absolute top-0 left-0 w-full h-[460px]"
          style={{ backgroundColor: '#a89885', zIndex: -1 }}
        />

        {/* Header Section */}
        <div className="container mx-auto px-8 pt-28 pb-8 mb-10 flex items-center">
          <div className="w-1/2 text-black">
            <h1 className="text-4xl font-bold mb-4">{settings.title || 'Frequently Asked Questions'}</h1>
            <p className="text-lg opacity-90">
              {settings.introduction || 'At Elevate Training Camps, we believe that high-altitude training should be accessible, fun, and safe for all athletes. Below you\'ll find answers to common questions about our camp, registration, and what to expect in Flagstaff, AZ.'}
            </p>
          </div>
          <div className="w-1/2 flex justify-center">
            {settings.faqPageImage && (
              <Image
                src={urlFor(settings.faqPageImage).url()}
                alt="FAQ Image"
                width={300}
                height={300}
                className="rounded-lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* Main content centered and constrained */}
      <div className="max-w-3xl mx-auto">
        {/* Section heading */}
        <h2 className="text-2xl font-semibold mb-6 text-primary">General Questions</h2>
        {/* FAQ List */}
        <div className="space-y-4 mb-10">
          {isLoading ? (
            <p>Loading FAQs...</p>
          ) : (
            faqs.map((faq) => (
              <details key={faq._id} className="group border border-[#d3c7b4] rounded-lg bg-[#f0ead6] shadow-sm overflow-hidden">
                <summary className="faq-summary cursor-pointer pl-10 pr-4 py-3 font-medium text-lg text-[#755f4f] rounded-lg group-open:rounded-b-none focus:outline-none">
                  {faq.question}
                </summary>
                <div className="px-10 pb-4 text-black bg-[#f0ead6]">
                  {faq.answer}
                </div>
              </details>
            ))
          )}
        </div>
        {/* Contact prompt */}
        <div className="text-center text-lg mt-12 mb-12">
          Have more questions?{' '}
          <a href="/contact" className="text-primary underline font-semibold">Contact us</a>
        </div>
      </div>
    </Layout>
  );
}
