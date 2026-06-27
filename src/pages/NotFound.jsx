import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO title="Page Not Found" />

      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="space-y-6 max-w-md">
          {/* Animated/glow text badge */}
          <div className="relative">
            <h1 className="text-9xl font-black text-slate-100 dark:text-slate-800 tracking-tighter select-none">
              404
            </h1>
            <p className="absolute inset-0 flex items-center justify-center text-2xl font-black text-primary dark:text-blue-500 uppercase tracking-widest mt-6">
              Oops! Lost
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-850 dark:text-slate-100">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button variant="primary" onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
