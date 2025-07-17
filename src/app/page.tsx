import { client } from '../lib/sanity';
import { homePageQuery } from '../lib/queries';
import { SanityHomePage } from '../lib/types';
import HomePage from '../components/HomePage';
import Layout from "../components/layout";

export default async function Home() {
  const homePageData: SanityHomePage = await client.fetch(homePageQuery);

  return (
    <Layout>
      <HomePage data={homePageData} />
    </Layout>
  );
}
