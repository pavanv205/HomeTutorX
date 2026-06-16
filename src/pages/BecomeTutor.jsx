import React from 'react';
import SEO from '../components/common/SEO';
import BecomeTutorForm from '../components/forms/BecomeTutorForm';
import { FaGraduationCap, FaClock, FaRupeeSign, FaShieldAlt } from 'react-icons/fa';

const BENEFITS = [
  {
    icon: <FaRupeeSign className="h-6 w-6" />,
    title: 'Attractive Earnings',
    description: 'Set your own hourly tutoring rates and earn according to your completed lecture hours.'
  },
  {
    icon: <FaClock className="h-6 w-6" />,
    title: 'Flexible Schedules',
    description: 'Choose your own class hours. Tutor online from home or conduct offline sessions in your vicinity.'
  },
  {
    icon: <FaShieldAlt className="h-6 w-6" />,
    title: 'Verified Payments',
    description: 'Enjoy timely monthly payouts directly to your bank account. No billing hassle with students.'
  },
  {
    icon: <FaGraduationCap className="h-6 w-6" />,
    title: 'Teaching Materials',
    description: 'Access curriculum guidelines, sample question papers, worksheets, and resources.'
  }
];

const BecomeTutor = () => {
  return (
    <>
      <SEO
        title="Become a Tutor"
        description="Join TutorConnect as a private tutor. Teach online or offline at your home, set your own hourly rates, choose flexible hours, and grow your career."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        
        {/* Onboarding Header */}
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-xs font-bold text-primary dark:text-blue-500 uppercase tracking-widest">
            Join Our Faculty
          </h1>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Share Your Knowledge. Earn on Your Terms.
          </h2>
          <p className="text-base text-slate-650 dark:text-slate-400 font-medium">
            TutorConnect connects qualified teachers with students seeking academic improvements. Complete the registration application to start lecturing today.
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((b, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center">
                {b.icon}
              </div>
              <h3 className="font-bold text-slate-850 dark:text-slate-205 text-base">{b.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {b.description}
              </p>
            </div>
          ))}
        </section>

        {/* The Multi-Step Registration Form */}
        <section className="pt-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Registration Application
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Takes less than 5 minutes to submit
            </p>
          </div>
          <BecomeTutorForm />
        </section>

      </div>
    </>
  );
};

export default BecomeTutor;
