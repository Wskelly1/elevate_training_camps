'use client';

import { client } from '../lib/sanity';
import { homePageQuery } from '../lib/queries';
import { SanityHomePage } from '../lib/types';
import Layout from "../components/layout";
import IntegratedHomepage from '../components/IntegratedHomepage';
import React, { useState, useEffect } from 'react';

/**
 * Home - Main homepage component for Elevate Training Camps
 *
 * This component serves as the entry point for the website, displaying the integrated
 * homepage with scroll animations and testimonials section. It fetches data from
 * Sanity CMS and manages the overall page state.
 *
 * Features:
 * - Dynamic content loading from Sanity CMS
 * - Integrated homepage with scroll-driven animations
 * - Interactive testimonials carousel (now integrated)
 * - Loading states and error handling
 * - Responsive design for all screen sizes
 *
 * @returns {JSX.Element} The complete homepage with animations and testimonials
 */
export default function Home() {
  const [homePageData, setHomePageData] = useState<SanityHomePage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(homePageQuery);
        setHomePageData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-screen"></div>
        </div>
      </Layout>
    );
  }

  if (!homePageData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>No content available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Integrated Homepage Component with built-in testimonials */}
      <IntegratedHomepage data={homePageData} />
    </Layout>
  );
}
