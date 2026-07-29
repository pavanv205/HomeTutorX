import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import Button from '../common/Button';
import homeImg from '../../assets/chatgpt_hero.png';

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 bg-slate-50 dark:bg-[#0B0F19]">
      {/* Background blobs for visual appeal */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 -mr-40 -mt-20 dark:bg-blue-500/5" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl -z-10 -ml-20 -mb-20 dark:bg-amber-500/5" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >


            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white"
            >
              Personalized <span className="text-blue-600 dark:text-blue-400">Home & Online</span> Tuition
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-650 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Connect with top-rated, certified local home tutors and interactive online educators tailored to your student's learning style. Boost confidence and grades.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/tutors')}
                icon={<FaSearch className="text-xs" />}
                iconPosition="left"
              >
                Find a Tutor
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/become-tutor')}
                icon={<FaUserPlus className="text-xs" />}
                iconPosition="left"
              >
                Become a Tutor
              </Button>
            </motion.div>

            {/* Simple Trust Banner */}
            <motion.div
              variants={itemVariants}
              className="pt-6 flex flex-wrap justify-center lg:justify-start items-center gap-6 text-xs text-slate-400 font-semibold uppercase tracking-wider"
            >
              <span className="flex items-center gap-1.5">✓ 100% Verified Profiles</span>
              <span className="flex items-center gap-1.5">✓ Personal Support</span>
            </motion.div>
          </motion.div>

          {/* Hero Right Media / Illustrative Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Image Container */}
            <div className="relative mx-auto w-full">
              <img
                src={homeImg}
                alt="Student learning with a tutor"
                className="w-full h-auto block"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
