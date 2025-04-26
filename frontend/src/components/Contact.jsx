import React from "react";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 py-12 mt-2 mb-4">
      <div className="text-center mt-8 mb-8">
        <motion.div
          className="inline-block border-x-4 border-[#076870] text-[#076870] rounded-md px-6 py-2 cursor-pointer"
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-xl font-light sm:text-xl md:text-xl"
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.h2>
        </motion.div>

        <motion.p
          className="text-2xl font-bold mt-4 text-gray-900 sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Our{" "}
          <span className="text-[#076870] font-light">
            Home <br /> Services
          </span>{" "}
          Experts
        </motion.p>
      </div>

      <div className="mx-4 flex flex-wrap lg:justify-between">
        <div className="w-full px-4 lg:w-1/2 xl:w-6/12 bg-[#104041] rounded-md">
          <h2 className="mb-6 text-xl font-light mt-6 text-gray-200 sm:text-[40px] lg:text-[36px] xl:text-[40px]">
            Contact Info
          </h2>
          <p className="mb-9 text-base leading-relaxed text-gray-200">
            We're here to help! If you have any questions or would like to
            discuss how our Home services digital marketplace can benefit you,
          </p>
          <div className="mb-12 max-w-[570px] lg:mb-0">
            {/* First SVG Icon (Location) */}
            <motion.div
              className="mb-8 flex w-full max-w-[370px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mr-6 flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded bg-[#104041] text-white sm:h-[70px] sm:w-[70px]">
                <svg
                  className="w-6 h-6"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 395.71 395.71"
                >
                  <g>
                    <path
                      d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"
                      fill="white"
                    />
                  </g>
                </svg>
              </div>
              <div className="w-full">
                <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                  Our Location
                </h4>
                <p className="text-base text-body-color text-gray-100">
                  99 S.t Jomblo Park Pekanbaru 28292. Indonesia
                </p>
              </div>
            </motion.div>

            {/* Second SVG Icon (Phone Number) */}
            <motion.div
              className="mb-8 flex w-full max-w-[370px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mr-6 flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded bg-[#104041] text-white sm:h-[70px] sm:w-[70px]">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.3 31.1499C22.95 31.1499 21.4 30.7999 19.7 30.1499C16.3 28.7999 12.55 26.1999 9.19997 22.8499C5.84997 19.4999 3.24997 15.7499 1.89997 12.2999C0.39997 8.59994 0.54997 5.54994 2.29997 3.84994C2.34997 3.79994 2.44997 3.74994 2.49997 3.69994L6.69997 1.19994C7.74997 0.599942 9.09997 0.899942 9.79997 1.89994L12.75 6.29994C13.45 7.34994 13.15 8.74994 12.15 9.44994L10.35 10.6999C11.65 12.7999 15.35 17.9499 21.25 21.6499L22.35 20.0499C23.2 18.8499 24.55 18.4999 25.65 19.2499L30.05 22.1999C31.05 22.8999 31.35 24.2499 30.75 25.2999L28.25 29.4999C28.2 29.5999 28.15 29.6499 28.1 29.6999C27.2 30.6499 25.9 31.1499 24.3 31.1499ZM3.79997 5.54994C2.84997 6.59994 2.89997 8.74994 3.99997 11.4999C5.24997 14.6499 7.64997 18.0999 10.8 21.2499C13.9 24.3499 17.4 26.7499 20.5 27.9999C23.2 29.0999 25.35 29.1499 26.45 28.1999L28.85 24.0999C28.85 24.0499 28.85 24.0499 28.85 23.9999L24.45 21.0499C24.45 21.0499 24.35 21.0999 24.25 21.2499L23.15 22.8499C22.45 23.8499 21.1 24.1499 20.1 23.4999C13.8 19.5999 9.89997 14.1499 8.49997 11.9499C7.84997 10.8999 8.09997 9.54994 9.09997 8.84994L10.9 7.59994V7.54994L7.94997 3.14994C7.94997 3.09994 7.89997 3.09994 7.84997 3.14994L3.79997 5.54994Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="w-full">
                <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                  Phone Number
                </h4>
                <p className="text-base text-body-color text-gray-100">
                  (+62) 812-3456-7890
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="w-full lg:w-1/2 xl:w-5/12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-xl font-light mt-6 text-gray-200 sm:text-[40px] lg:text-[36px] xl:text-[40px]">
              Send Us a Message
            </h2>
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-[#076870]"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-[#076870]"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Your Message"
                  className="w-full px-4 py-3 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-[#076870]"
                  rows="4"
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-3 text-lg font-medium text-white bg-[#076870] rounded-md hover:bg-[#064e54] transition-all duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
