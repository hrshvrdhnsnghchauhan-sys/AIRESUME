import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPreview from '@/components/landing/LandingPreview';
import LandingTemplates from '@/components/landing/LandingTemplates';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import LandingPricing from '@/components/landing/LandingPricing';
import LandingFAQ from '@/components/landing/LandingFAQ';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingPreview />
        <LandingTemplates />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  );
}
