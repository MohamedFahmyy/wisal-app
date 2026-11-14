import React, { useEffect } from 'react';
import {
  HeroSection,
  IntroStrip,
  FeaturedDesignsSection,
  HowItWorksSection,
  FeaturesOverviewSection,
  WhyWisalSection,
  TestimonialsSection,
  PackagesPreviewSection,
  FAQPreviewSection,
  FinalCTASection
} from '../components/sections/LandingSections';

export default function HomePage() {
  useEffect(() => {
    document.title = 'وِصال — منصة دعوات إلكترونية فاخرة';
  }, []);

  return (
    <main className="landing-page-main">
      <HeroSection />
      <IntroStrip />
      <FeaturedDesignsSection />
      <HowItWorksSection />
      <FeaturesOverviewSection />
      <WhyWisalSection />
      <TestimonialsSection />
      <PackagesPreviewSection />
      <FAQPreviewSection />
      <FinalCTASection />
    </main>
  );
}
