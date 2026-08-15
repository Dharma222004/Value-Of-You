"use client";

import React from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import WhyHumanCapital from "@/components/WhyHumanCapital";
import { FiveDimensions } from "@/components/landing/FiveDimensions";
import { CareerDetail } from "@/components/landing/CareerDetail";
import { ScoreVisualizer } from "@/components/landing/ScoreVisualizer";
import AssessmentProcess from "@/components/AssessmentProcess";
import { AssessmentTeaser } from "@/components/landing/AssessmentTeaser";
import { SecurityPrivacy } from "@/components/landing/SecurityPrivacy";
import { PlatformStats } from "@/components/landing/PlatformStats";
import FAQ from "@/components/FAQ";
import { CallToActionBanner } from "@/components/landing/CallToActionBanner";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  const scrollToWizard = () => {
    const element = document.getElementById("wizard");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1d] text-[#FFFFFF] relative overflow-hidden bg-institutional-grid">
      <Header onStartAssessment={scrollToWizard} />
      <Hero onStartAssessment={scrollToWizard} />
      <WhyHumanCapital />
      <FiveDimensions />
      <CareerDetail />
      <ScoreVisualizer />
      <AssessmentProcess />
      <AssessmentTeaser />
      <SecurityPrivacy />
      <PlatformStats />
      <FAQ />
      <CallToActionBanner />
      <Footer />
    </main>
  );
}
