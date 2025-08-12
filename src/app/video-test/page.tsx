import { Metadata } from 'next';
import { client } from '../../lib/sanity';
import { groq } from 'next-sanity';
import VideoTest from '../../components/VideoTest';

export const metadata: Metadata = {
  title: 'Video Test Page',
  description: 'Testing video playback from Sanity',
};

async function getVideoData() {
  const data = await client.fetch(groq`
    *[_type == "homePage"][0] {
      expandMediaSrc {
        asset->{
          _id,
          url
        }
      },
      expandPosterSrc {
        asset->{
          _id,
          url
        }
      }
    }
  `);

  return data;
}

export default async function VideoTestPage() {
  const data = await getVideoData();
  const videoUrl = data?.expandMediaSrc?.asset?.url || '';
  const posterUrl = data?.expandPosterSrc?.asset?.url || '';

  // For debugging
  console.log('Video URL from Sanity:', videoUrl);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Video Test Page</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sanity Video Test</h2>
        <VideoTest
          videoUrl={videoUrl}
          posterUrl={posterUrl}
        />
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Known Working Video Test</h2>
        <VideoTest
          videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          posterUrl="https://peach.blender.org/wp-content/uploads/bbb-splash.png"
        />
      </div>
    </div>
  );
}
