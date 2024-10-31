import { motion } from "framer-motion";
interface ButtonProps {
  disabled?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  gradient?: string;
  className?: string;
}

const Button = ({
  disabled = false,
  children,
  type = "button",
  gradient = "from-green-500 to-emerald-600",
  className = "",
}: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-3 px-4 bg-gradient-to-r ${gradient} ${
        disabled
          ? "from-gray-100 to-gray-300 text-white opacity-40 cursor-not-allowed"
          : "text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700"
      } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 ${className}`}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;
