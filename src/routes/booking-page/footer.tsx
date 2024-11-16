import grvwhitelLogo from "../../assets/grvl-white-trans.png"

const Footer = () => {
  return (
    <footer className="p-4 bg-[#222323] sm:p-6 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="hhttps://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/" className="flex items-center">
              <img
                src={grvwhitelLogo}
                className="mr-3 h-8"
                alt="Great Rift Lodge Logo"
              />
              <span className="self-center text-2xl font-semibold text-white whitespace-nowrap dark:text-white">
                Great Rift Valley Lodge
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
           
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-200 uppercase dark:text-white">
                Follow us
              </h2>
              <ul className="text-gray-300 dark:text-gray-400">
                <li className="mb-4">
                  <a
                    href="https://www.facebook.com/GreatRiftValleyLodge/"
                    className="hover:underline"
                  >
                    Facebook
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://twitter.com/RiftValleyLodge"
                    className="hover:underline"
                  >
                    Twitter
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.instagram.com/greatriftvalleylodge"
                    className="hover:underline"
                  >
                    Instagram
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.linkedin.com/company/heritage-hotels-ltd"
                    className="hover:underline"
                  >
                    Linked In
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.tripadvisor.com/Hotel_Review-g317067-d569109-Reviews-Great_Rift_Valley_Lodge_Golf_Resort-Naivasha_Rift_Valley_Province.html"
                    className="hover:underline"
                  >
                    Trip Advisor
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-200 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="text-gray-300 dark:text-gray-400">
                <li className="mb-4">
                  <a href="https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/hotel-gdpr" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/hotel-policies" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center dark:text-white-400">
            © 2024{" "}
            <a href="https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/" className="hover:underline">
              Great Rift Valley Lodge
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06..."
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
