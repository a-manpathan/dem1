import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import './LoadingAnimation.css';

interface LoadingAnimationProps {
  isLoading: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isLoading }) => {
  const dnaStrand = Array.from({ length: 8 }, (_, i) => i);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  };

  const dotVariants: Variants = {
    hidden: { y: 0, scale: 1 },
    visible: {
      y: [-10, 10, -10],
      scale: [1, 1.2, 1],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut' as const, // Explicitly type as a valid easing
      },
    },
  };

  const helixVariants: Variants = {
    hidden: { rotate: 0 },
    visible: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 4,
        ease: 'linear' as const, // Explicitly type as a valid easing
      },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-label="Loading"
        >
          <motion.div
            className="flex flex-col items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="relative flex space-x-4"
              variants={helixVariants}
            >
              <div className="flex flex-col space-y-2">
                {dnaStrand.map((_, index) => (
                  <motion.div
                    key={`left-${index}`}
                    className="w-4 h-4 bg-blue-400 rounded-full shadow-glow"
                    variants={dotVariants}
                  />
                ))}
              </div>
              <div className="flex flex-col space-y-2">
                {dnaStrand.map((_, index) => (
                  <motion.div
                    key={`right-${index}`}
                    className="w-4 h-4 bg-teal-400 rounded-full shadow-glow"
                    variants={dotVariants}
                    transition={{ delay: 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
            <motion.p
              className="mt-4 text-white text-lg font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Analyzing Health Data...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingAnimation;