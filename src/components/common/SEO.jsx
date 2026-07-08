import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, ogImage, canonicalUrl }) => {
  const defaultTitle = 'HomeTutorX | Find Verified Home & Online Tutors';
  const defaultDesc = 'Connect with top-rated, qualified home and online tutors for CBSE, ICSE, Boards, JEE, NEET, and university courses.';
  
  const siteTitle = title ? `${title} | HomeTutorX` : defaultTitle;
  const siteDesc = description || defaultDesc;
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDesc} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDesc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

export default SEO;
