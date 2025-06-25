import Footer from "./footer/footer.jsx";
import "../styles/globals.css"; // Import global styles if you have them

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
