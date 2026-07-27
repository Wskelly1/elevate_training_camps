import { getHomePage } from '../lib/queries';
import Layout from "../components/layout";
import IntegratedHomepage from '../components/IntegratedHomepage';

/**
 * Home - Main homepage component for Elevate Training Camps
 *
 * Server-rendered entry point for the site. Fetches homepage content from
 * Sanity CMS (cached — see REVALIDATE_SECONDS in lib/queries.ts) and passes
 * it to IntegratedHomepage for the scroll-driven animated rendering.
 *
 * @returns {JSX.Element} The complete homepage with animations and testimonials
 */
export default async function Home() {
  const homePageData = await getHomePage();

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
