const AboutPrivacy = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy explains how
        PetConnect collects, uses, and shares information when you use our
        service.
      </p>
      <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We collect information in the following ways:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>
          <strong>Information you provide directly:</strong> When you create an
          account, we collect your name, email address, and other contact
          information.
        </li>
        <li>
          <strong>Information we collect automatically:</strong> We collect
          information about your activity on PetConnect, such as the pages you
          visit and the content you interact with.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
      <p className="mb-4">
        We use the information we collect to:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Provide and improve PetConnect</li>
        <li>Personalize your experience</li>
        <li>Communicate with you</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">3. Sharing Your Information</h2>
      <p className="mb-4">
        We share your information with:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Other users of PetConnect, when you post content</li>
        <li>Service providers who help us operate PetConnect</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">4. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, correct, or delete your personal
        information. You can do this by contacting us.
      </p>
      <h2 className="text-xl font-semibold mb-2">5. Amendments</h2>
      <p className="mb-4">
        We may change this policy from time to time. If we make changes, we will
        notify you by revising the date at the top of the policy.
      </p>
    </div>
  );
};

export default AboutPrivacy;