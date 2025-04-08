
import about1 from "@/assets/about-1.png";
import about2 from "@/assets/about-2.png";

const Hero = () => {
  return (
    <section className="container mx-auto px-3 lg:px-0 py-12">
      <div className="flex flex-col md:flex-row py-16 justify-center items-center gap-6">
        <div>
          <p className="mb-6 text-xl">About Us</p>
          <h1 className="text-3xl font-semibold leading-snug ">
            Pet Connect –{" "}
            <span className="text-[#e54c00]">
              Connecting Pets with Loving Homes
            </span>
          </h1>
          <p className=" font-light pt-6 leading-6">
            Pet Connect is a compassionate platform dedicated to pet adoption,
            fostering, and rescue. We connect adopters, foster parents, and
            shelters to ensure every pet finds a loving home. With AI-powered
            pet identification, we make the process easier, faster, and more
            efficient.
          </p>
        </div>
        <img
          src={about2}
          alt="nurses helping a dog"
          className="w-full md:w-1/2 rounded-2xl aspect-video object-cover object-top rotate-y-180"
        />
      </div>
    </section>
  );
};

const AboutUs = () => {
  return (
    <div className="bg-white">
      <section className="container mx-auto px-3 lg:px-0">
        <div className="flex flex-col md:flex-row py-16 justify-center items-center gap-6">
          <img
            src={about1}
            alt="nurses helping a dog"
            className="w-full md:w-1/2 rounded-2xl object-cover object-top"
          />
          <div>
            <h1 className="text-3xl font-semibold leading-snug">
              About Us{" "}
              <span className="text-[#e54c00]">
                - Saving Paws, Changing Lives
              </span>
            </h1>
            <p className="pt-6 leading-6">
              At Pet Connect, we make pet adoption and fostering simple, secure,
              and accessible. Our mission is to connect rescued pets with loving
              families while helping lost pets reunite with their owners.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const VisionMission = () => {
  return (
    <div className="bg-[#E54C00B2]">
      <section className="container mx-auto px-3 py-8 lg:px-0">
        <div className="flex flex-col md:flex-row text-white gap-16">
          <div className="flex flex-1 flex-col gap-6">
            <svg
              width="94"
              height="66"
              viewBox="0 0 126 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M122.062 79.5615H3.9375C2.89321 79.5615 1.89169 79.9764 1.15327 80.7148C0.414841 81.4532 0 82.4547 0 83.499C0 84.5433 0.414841 85.5448 1.15327 86.2833C1.89169 87.0217 2.89321 87.4365 3.9375 87.4365H122.062C123.107 87.4365 124.108 87.0217 124.847 86.2833C125.585 85.5448 126 84.5433 126 83.499C126 82.4547 125.585 81.4532 124.847 80.7148C124.108 79.9764 123.107 79.5615 122.062 79.5615ZM106.139 67.749C105.173 56.9751 100.21 46.9528 92.2263 39.6536C84.2429 32.3543 73.8172 28.3066 63 28.3066C52.1828 28.3066 41.7571 32.3543 33.7737 39.6536C25.7904 46.9528 20.8273 56.9751 19.8608 67.749H27.7751C28.7297 59.0739 32.852 51.0562 39.352 45.2322C45.852 39.4082 54.2725 36.1877 63 36.1877C71.7275 36.1877 80.148 39.4082 86.648 45.2322C93.148 51.0562 97.2703 59.0739 98.2249 67.749H106.139ZM63 0.811523C61.9557 0.811523 60.9542 1.22637 60.2158 1.96479C59.4773 2.70322 59.0625 3.70473 59.0625 4.74902V16.5615C59.0625 17.6058 59.4773 18.6073 60.2158 19.3458C60.9542 20.0842 61.9557 20.499 63 20.499C64.0443 20.499 65.0458 20.0842 65.7842 19.3458C66.5227 18.6073 66.9375 17.6058 66.9375 16.5615V4.74902C66.9375 3.70473 66.5227 2.70322 65.7842 1.96479C65.0458 1.22637 64.0443 0.811523 63 0.811523ZM12.8835 21.57C12.1453 22.3084 11.7307 23.3098 11.7307 24.3538C11.7307 25.3979 12.1453 26.3993 12.8835 27.1376L21.231 35.4851C21.5942 35.8612 22.0287 36.1612 22.5091 36.3675C22.9895 36.5739 23.5062 36.6825 24.029 36.6871C24.5518 36.6916 25.0703 36.592 25.5542 36.394C26.0381 36.196 26.4777 35.9037 26.8474 35.534C27.2171 35.1642 27.5095 34.7246 27.7075 34.2407C27.9055 33.7568 28.0051 33.2383 28.0005 32.7155C27.996 32.1927 27.8874 31.676 27.681 31.1956C27.4747 30.7152 27.1747 30.2807 26.7986 29.9175L18.4511 21.57C17.7127 20.8319 16.7114 20.4172 15.6673 20.4172C14.6232 20.4172 13.6219 20.8319 12.8835 21.57ZM113.116 21.57C112.378 20.8319 111.377 20.4172 110.333 20.4172C109.289 20.4172 108.287 20.8319 107.549 21.57L99.2014 29.9175C98.8253 30.2807 98.5253 30.7152 98.319 31.1956C98.1126 31.676 98.004 32.1927 97.9995 32.7155C97.9949 33.2383 98.0945 33.7568 98.2925 34.2407C98.4905 34.7246 98.7829 35.1642 99.1526 35.534C99.5223 35.9037 99.9619 36.196 100.446 36.394C100.93 36.592 101.448 36.6916 101.971 36.6871C102.494 36.6825 103.011 36.5739 103.491 36.3675C103.971 36.1612 104.406 35.8612 104.769 35.4851L113.116 27.1376C113.855 26.3993 114.269 25.3979 114.269 24.3538C114.269 23.3098 113.855 22.3084 113.116 21.57Z"
                fill="white"
              />
            </svg>
            <h1 className="text-4xl font-semibold">Our Vision</h1>
            <p className="text-lg pt-6 font-light ">
              To create a world where every pet has a loving home. By leveraging
              technology and community support, we aim to eliminate pet
              homelessness and ensure no animal is left without care.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-6">
            <svg
              width="52"
              height="66"
              viewBox="0 0 89 108"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.333008 107.512V74.924C0.333008 73.0907 0.772646 71.349 1.65192 69.699C2.5312 68.049 3.75406 66.7198 5.32051 65.7115L11.4163 61.724C12.0629 69.424 13.0788 75.9782 14.4643 81.3865C15.8497 86.7949 18.0202 92.799 20.9757 99.399L0.333008 107.512ZM29.2882 96.5115C26.0556 90.4615 23.6542 84.0449 22.084 77.2615C20.5139 70.4782 19.7288 63.4657 19.7288 56.224C19.7288 44.7657 22.0157 33.9729 26.5894 23.8455C31.1631 13.7182 37.1888 6.04019 44.6663 0.811523C52.1476 6.03652 58.1751 13.7145 62.7488 23.8455C67.3225 33.9765 69.6075 44.7694 69.6038 56.224C69.6038 63.374 68.8188 70.3187 67.2486 77.058C65.6785 83.7973 63.2771 90.2819 60.0445 96.5115H29.2882ZM44.6663 58.0115C47.7143 58.0115 50.3244 56.9354 52.4967 54.783C54.669 52.6307 55.7534 50.0402 55.7497 47.0115C55.746 43.9829 54.6617 41.3942 52.4967 39.2455C50.3318 37.0969 47.7216 36.0189 44.6663 36.0115C41.611 36.0042 39.0028 37.0822 36.8415 39.2455C34.6803 41.4089 33.5941 43.9975 33.583 47.0115C33.5719 50.0255 34.6581 52.616 36.8415 54.783C39.0249 56.95 41.6332 58.0262 44.6663 58.0115ZM88.9997 107.512L68.357 99.399C71.3125 92.799 73.483 86.7949 74.8684 81.3865C76.2538 75.9782 77.2698 69.424 77.9163 61.724L84.0122 65.7115C85.5823 66.7198 86.807 68.049 87.6863 69.699C88.5656 71.349 89.0034 73.0907 88.9997 74.924V107.512Z"
                fill="white"
              />
            </svg>
            <h1 className="text-4xl font-semibold">Our Mission</h1>
            <p className="text-lg pt-6 font-light">
              To simplify pet adoption, fostering, and lost pet recovery by
              connecting adopters, shelters, and pet owners through
              technology-driven solutions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const WhyChooseUs = () => {
  return (
    <section className="container mx-auto px-3 py-16 lg:px-0">
      <h2 className="text-4xl font-semibold text-center mb-12">
        Why Choose Us?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 bg-[#F9F9F9] rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Verified Shelters & Rescues
          </h3>
          <p className="text-sm font-light">
            We ensure all listed organizations are credible and trustworthy.
          </p>
        </div>

        <div className="p-6 bg-[#F9F9F9] rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            AI-Powered Pet Identification
          </h3>
          <p className="text-sm font-light">
            Instantly recognize pet breeds for easier adoption and lost pet
            recovery.
          </p>
        </div>

        <div className="p-6 bg-[#F9F9F9] rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Seamless Adoption & Fostering Process
          </h3>
          <p className="text-sm font-light">
            Browse, apply, and connect with shelters effortlessly.
          </p>
        </div>

        <div className="p-6 bg-[#F9F9F9] rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Dedicated Lost & Found Support
          </h3>
          <p className="text-sm font-light">
            Quickly report and locate lost pets with our community-driven
            platform.
          </p>
        </div>

        <div className="p-6 bg-[#F9F9F9] rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Real-Time Communication
          </h3>
          <p className="text-sm font-light">
            Chat directly with shelters, adopters, and foster parents for a
            smooth process.
          </p>
        </div>

        <div className="p-6 bg-[#F9F9F9] rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Safe & Secure Platform</h3>
          <p className="text-sm font-light">
            We prioritize transparency, ensuring a reliable and protected
            experience for every user.
          </p>
        </div>
      </div>
    </section>
  );
};

function About() {
  return (
    <div className="App">
      <Hero />
      <AboutUs />
      <VisionMission />
      <WhyChooseUs />
    </div>
  );
}

export default About;
