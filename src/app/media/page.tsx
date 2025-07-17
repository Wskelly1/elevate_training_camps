import Layout from "../../components/layout";

export default function MediaPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10 p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Media</h1>
        <p className="text-lg text-center mb-6">Explore photos and videos from past Elevate Training Camps. See the fun, the training, and the beautiful Flagstaff scenery!</p>
        <ul className="list-disc pl-6">
          <li>Photo: Campers at sunrise on Buffalo Park Trail</li>
          <li>Video: Coach's welcome speech (2023)</li>
          <li>Photo: Group run through the pines</li>
        </ul>
      </div>
    </Layout>
  );
} 