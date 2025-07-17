import Layout from "../../components/layout";

export default function FAQPage() {
  return (
    <Layout>
      {/* Top colored box with heading and intro, full width */}
      <div className="bg-muted rounded-none p-8 mb-10 w-full">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          At Elevate Training Camps, we believe that high-altitude training should be accessible, fun, and safe for all athletes. Below you'll find answers to common questions about our camp, registration, and what to expect in Flagstaff, AZ.
        </p>
      </div>
      {/* Main content centered and constrained */}
      <div className="max-w-3xl mx-auto">
        {/* Section heading */}
        <h2 className="text-2xl font-semibold mb-6 text-primary">Signing Up</h2>
        {/* FAQ List */}
        <div className="space-y-4 mb-10">
          <details className="border rounded-md">
            <summary className="cursor-pointer px-4 py-3 font-medium text-lg">Who can attend Elevate Training Camps?</summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Youth and high school athletes of all skill levels are welcome. We also offer sessions for parents and coaches.
            </div>
          </details>
          <details className="border rounded-md">
            <summary className="cursor-pointer px-4 py-3 font-medium text-lg">What should I bring?</summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Bring running shoes, comfortable clothes, a water bottle, sunscreen, and a great attitude!
            </div>
          </details>
          <details className="border rounded-md">
            <summary className="cursor-pointer px-4 py-3 font-medium text-lg">Where are the camps held?</summary>
            <div className="px-4 pb-4 text-muted-foreground">
              All camps are held in beautiful Flagstaff, Arizona, known for its high-altitude training environment.
            </div>
          </details>
          <details className="border rounded-md">
            <summary className="cursor-pointer px-4 py-3 font-medium text-lg">How do I register?</summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Visit our <a href="/registration" className="text-primary underline">registration page</a> for details and to sign up when registration opens.
            </div>
          </details>
          <details className="border rounded-md">
            <summary className="cursor-pointer px-4 py-3 font-medium text-lg">What is included in the camp fee?</summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Camp fees include all training sessions, meals, lodging, and camp activities. Travel to Flagstaff is not included.
            </div>
          </details>
        </div>
        {/* Contact prompt */}
        <div className="text-center text-lg mt-12">
          Have more questions?{' '}
          <a href="/contact" className="text-primary underline font-semibold">Contact us</a>
        </div>
      </div>
    </Layout>
  );
} 