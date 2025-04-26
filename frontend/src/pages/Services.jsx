import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import ServiceDetailsPage from "./ServiceDetailsPage";
import ReadyToJoin from "../components/ReadyToJoin";


const ServicesPage = () => {
  // State for toggling dropdown visibility
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Toggle functions for dropdown visibility
  const toggleSortDropdown = () => setIsSortOpen(!isSortOpen);
  const toggleFilterDropdown = () => setIsFilterOpen(!isFilterOpen);
  const services = [
    {
      id: 1,
      name: 'Electrical Problems',
      description: 'From simple repairs to complete rewiring projects, our electrical solutions are designed to keep your home safe.',
      image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b50e3a30a5d77c8578a8_electrical-problems.jpg'
    },
    {
      id: 2,
      name: 'Plumbing Solutions',
      description: 'Don’t let plumbing issues disrupt your daily routine. Our plumbing solutions cover everything from leaky faucets.',
      image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b4ed7288e84197d4a6b7_plumbing-solutions.jpg'
    },
    {
      id: 3,
      name: 'Carpentry Services',
      description: 'Whether you\'re looking to add custom built-ins, repair damaged furniture, or install new cabinetry, our carpentry solutions have you covered.',
      image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b4c384a3010ab6bf5e72_carpentry-services.jpg'
    },
    {
      id: 4,
      name: 'Painting Services',
      description: 'Transform your space with our painting and wall covering services. Whether you\'re refreshing your walls or looking for new designs.',
      image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b493aa2d2deeb29c33e0_painting-services.jpg'
    },
    {
      id: 5,
      name: 'Gardening Services',
      description: 'Extend your living space outdoors with our landscaping and outdoor solutions. From lawn maintenance to garden design.',
      image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b472e9f876e39aa1936b_gardening-services.jpg'
    },
    {
      id: 6,
      name: 'Home Renovations',
      description: 'Ready to take your home to the next level? We offer full-service renovations, from kitchens to bathrooms.',
      image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b4196c891ed31ef5a530_home-renovations.jpg'
    },
  ];

  return (
    <>
<section className="services bg-white">
    
      {/* Hero Section */}
      <section
        className="relative py-32 bg-cover bg-center bg-white"
        style={{
          backgroundImage: 'url("https://cdn.prod.website-files.com/663b34c56f05c8c9e12aafdc/664058919f21cfec93f3fe47_hero-bg.jpg")',
        }}
      >
        <div className="absolute inset-0 "></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <motion.div
              className="inline-block border-x-4 border-[#076870] text-[#076870] rounded-md px-6 py-2 bg-gray-200 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-light">
                Contact Us
              </h2>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold text-black mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Get Comprehensive
              <span className="text-[#076870] font-light block md:inline">
                {" "}Home <br />  Solutions 
               </span> 
              Services
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Search Bar with Sort and Filter */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center">
          {/* Left Side: About Us Heading */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} // Start off-screen to the left
            whileInView={{ opacity: 1, x: 0 }} // Animate to visible
            transition={{ duration: 0.6, delay: 0.2 }} // Smooth transition
            viewport={{ once: true }} // Animate only once
          >
            <div className="text-center md:text-left">
             
              <p className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-black">
                Your Trusted <span className="text-[#076870]">Home</span> <br />
                 <span className="text-[#076870]">Solutions </span>Partner
              </p>
            </div>
          </motion.div>

          {/* Right Side: Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} // Start off-screen to the right
            whileInView={{ opacity: 1, x: 0 }} // Animate to visible
            transition={{ duration: 0.6, delay: 0.4 }} // Smooth transition
            viewport={{ once: true }} // Animate only once
          >
            <div className="text-center md:text-left">
              <p className="text-sm font-light sm:text-sm lg:text-base text-gray-600">
              At HandyHome, we provide all service categories with high quality, ensuring your home remains a place of comfort,
               efficiency, and reliability.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="hidden md:block h-1 w-[100%] mt-8 bg-gray-200 mx-auto"></div>


        {/* Search Bar with Icon */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#076870] text-gray-700"
              placeholder="Search services..."
            />
            <svg fill="#000000" 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500"

            version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 488.4 488.4" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6 s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2 S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7 S381.9,104.65,381.9,203.25z"></path> </g> </g> </g></svg>
          </div>

          {/* Sort and Filter Buttons */}
          <div className="flex gap-4">
            {/* Sort By Button */}
            <div className="relative">
              <button
                onClick={toggleSortDropdown}
                className="px-12 py-3 bg-[#076870] text-white rounded cursor-pointer font-semibold hover:bg-[#065f57] transition duration-300"
              >
                Sort By
              </button>
              {isSortOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                  <ul className="text-gray-700">
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Price: Low to High
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Price: High to Low
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Rating: High to Low
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Rating: Low to High
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Date: Newest First
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Date: Oldest First
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={toggleFilterDropdown}
                className="px-12 py-3 bg-[#f3f4f6] text-[#076870] rounded cursor-pointer font-semibold border border-[#076870] hover:bg-[#076870] hover:text-white transition duration-300"
              >
                Filter By
              </button>
              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                  <ul className="text-gray-700">
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Category: Electrical
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Category: Plumbing
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Category: Carpentry
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Location: Nearby
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Rating: 4 Stars & Up
                    </li>
                    <li className="cursor-pointer hover:bg-[#076870] hover:text-white px-4 py-2 text-sm">
                      Price Range: $50 - $200
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
        </div>
     
        <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 text-center">
  {services.map((service) => (
    <motion.div
      key={service.id}
      className="bg-white border border-gray-200 rounded-lg shadow-lg transform transition duration-300 group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ backgroundColor: "#076870", scale: 1.05 }} // Change background color on hover
      whileTap={{ backgroundColor: "#076870", scale: 0.95 }} // Change background color on click
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Link to={`/service-details/${service.id}`}>
        <img
          className="rounded-t-lg w-full h-56 object-cover"
          src={service.image}
          alt={service.name}
        />
      </Link>
      <div className="p-5 text-center">
        <Link to={`/service-details/${service.id}`}>
          <motion.h5
            className="mb-2 text-2xl font-bold text-gray-900 group-hover:text-white group-focus:text-white"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {service.name}
          </motion.h5>
        </Link>
        <motion.p
          className="mb-3 text-gray-700 group-hover:text-white group-focus:text-white"
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {service.description}
        </motion.p>
        <div className="mt-4 text-center">
          <Link
            to={`/service-details/${service.id}`}
            className="inline-flex items-center px-6 py-3 border border-[#076870] text-[#076870] rounded-full group-hover:bg-white group-hover:text-[#076870] group-focus:bg-white group-focus:text-[#076870] transition-colors duration-200 ease-in-out"
          >
            More Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 ml-2"
              fill="currentColor"
              viewBox="0 0 12 12"
            >
              <path d="M6.80182 8.45459C6.67915 8.46603 6.55599 8.43835 6.45 8.37549C6.37256 8.29599 6.33544 8.18563 6.3491 8.07549C6.35196 7.98381 6.36291 7.89254 6.38182 7.80277C6.40013 7.69979 6.42377 7.59784 6.45272 7.49731L6.77454 6.39003C6.80773 6.28074 6.82966 6.16834 6.84 6.05457C6.84 5.93185 6.85636 5.84729 6.85636 5.79821C6.8632 5.57947 6.76981 5.36956 6.60272 5.22821C6.3972 5.07043 6.14126 4.99288 5.88272 5.01003C5.69745 5.01282 5.5136 5.04315 5.33726 5.10003C5.14453 5.16003 4.9418 5.23184 4.72908 5.31549L4.63636 5.67549C4.69908 5.65367 4.77546 5.62913 4.86272 5.60185C4.94597 5.5772 5.03227 5.56433 5.11908 5.56367C5.24086 5.55048 5.36344 5.58038 5.46544 5.64821C5.53472 5.73088 5.56723 5.83827 5.55544 5.94549C5.55513 6.0372 5.54508 6.12863 5.52544 6.21821C5.50634 6.31367 5.4818 6.41457 5.4518 6.52093L5.12726 7.63365C5.1011 7.73708 5.08017 7.84175 5.06454 7.94729C5.05179 8.03764 5.04542 8.12877 5.04544 8.22001C5.0441 8.44025 5.14481 8.6487 5.31816 8.78455C5.52684 8.94479 5.78644 9.02422 6.04906 9.00819C6.23398 9.01198 6.41827 8.98527 6.59452 8.92909C6.74906 8.87635 6.95543 8.80091 7.21362 8.70273L7.3009 8.35909C7.23096 8.3881 7.15894 8.4118 7.08544 8.42999C6.99249 8.45122 6.89705 8.45947 6.80182 8.45459Z" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  ))}
</div>
    </div>
      </section>
      {/* Ready to Join Section */}
      <ReadyToJoin />

      
</section>
    </>
  );
};

export default ServicesPage;
