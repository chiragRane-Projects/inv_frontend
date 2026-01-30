import Features from "@/components/landingPage/Features";
import Footer from "@/components/landingPage/Footer";
import Header from "@/components/landingPage/header";
import Hero from "@/components/landingPage/hero";
import RoleTabs from "@/components/landingPage/RoleTabs";
import TrustedBy from "@/components/landingPage/TrustedBy";

export default function Home() {
  return (
    <main>
     <Header/>
     <Hero/>
     <TrustedBy/>
     <Features/>
     <RoleTabs/>
     <Footer/>
    </main>
  );
}
