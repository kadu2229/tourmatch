import Sobre from "@/components/About/About";
import Download from "@/components/Download/Download";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <Download />
      <Sobre />
      <Footer />
    </div>
  );
}
