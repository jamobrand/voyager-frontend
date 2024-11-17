import { Helmet } from "react-helmet-async"
import Header from "./navbar"
import HeroSection from "./hero"
import ChaletDisplay from "./chalet-display"
import OfferCarousel from "./offer-carousel"
import Footer from "./footer"

const HomePage = () => {
  return (
    <div>
        <Helmet>
            <title>Great Rift Valley Lodge</title>
            <meta name="description" content="Voyager is a modern and elegant chalet rental platform." />
        </Helmet>
        <Header />
        <HeroSection />
        <ChaletDisplay />
        <OfferCarousel />
        <Footer />
    </div>
  )
}

export default HomePage