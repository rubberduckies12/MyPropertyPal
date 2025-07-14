import Footer from "./footer/footer.jsx";
import "../styles/globals.css"; // Import global styles
import "../styles/about/about.css";
import "../styles/blog/blog.css";
import "../styles/contact/contact.css";
import "../styles/mtd/mtd.css";
import "../styles/features/features.css";
import "../styles/privacy/privacy.css";
import "../styles/landing/landing.css";
import "../styles/header/header.css";
import "../styles/footer/footer.css";
import "../styles/tos/tos.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
//globals css change
