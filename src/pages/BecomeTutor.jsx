import SEO from '../components/common/SEO';
import BecomeTutorForm from '../components/forms/BecomeTutorForm';

const BecomeTutor = () => {
  return (
    <>
      <SEO
        title="Become a Tutor"
        description="Join TutorConnect as a private tutor. Teach online or offline at your home, set your own hourly rates, choose flexible hours, and grow your career."
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
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
