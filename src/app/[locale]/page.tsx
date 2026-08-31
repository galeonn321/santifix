import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Areas from '@/components/sections/Areas';
import WhySantiHandyman from '@/components/sections/WhySantiHandyman';
import BookingForm from '@/components/sections/BookingForm';
import Reviews from '@/components/sections/Reviews';
import Footer from '@/components/sections/Footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Areas />
      <WhySantiHandyman />
      <BookingForm />
      <Reviews />
      <Footer />
    </main>
  );
}
