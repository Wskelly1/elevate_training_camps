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
      {/* Top colored box with heading and intro, full width */}
      <div className="bg-muted rounded-none px-8 pt-40 pb-20 mb-10 w-full">
        <div className="container mx-auto flex items-center">
          <div className="w-1/2">
            <h1 className="text-4xl font-bold mb-4">{settings.title || 'Frequently Asked Questions'}</h1>
            <p className="text-lg text-muted-foreground">
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
              <details key={faq._id} className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-lg">{faq.question}</summary>
                <div className="px-4 pb-4 text-muted-foreground">
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