import React from "react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const year = new Date().getFullYear();
  return (
    <footer
      className={`bg-blue-500 text-white py-4 px-6 flex flex-col sm:flex-row justify-between items-center w-full ${
        className || ""
      }`}
    >
      <span className="text-sm">&copy; {year} TradeBridgeSolutions.com</span>
      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <FaFacebook className="text-white text-lg cursor-pointer hover:opacity-80" />
        <FaXTwitter className="text-white text-lg cursor-pointer hover:opacity-80" />
        <FaLinkedin className="text-white text-lg cursor-pointer hover:opacity-80" />
      </div>
    </footer>
  );
};

export default Footer;
