import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  tap: {
    scale: 0.95
  }
};

const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      className={className}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      custom={delay}
      transition={{
        delay: delay * 0.1
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
