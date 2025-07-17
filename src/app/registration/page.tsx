import Layout from "../../components/layout";

export default function RegistrationPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10 p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Registration</h1>
        <p className="text-lg text-center mb-6">Register for Elevate Training Camps and secure your spot for an unforgettable high-altitude experience in Flagstaff, AZ. Registration opens soon—check back for details and pricing!</p>
        <ul className="list-disc pl-6">
          <li>Early bird discounts available</li>
          <li>Flexible payment options</li>
          <li>All skill levels welcome</li>
        </ul>
      </div>
    </Layout>
  );
} 