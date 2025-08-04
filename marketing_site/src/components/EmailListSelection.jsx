import { useEffect } from "react";

export default function EmailListSection() {
  useEffect(() => {
    // Dynamically add the Kit form script
    const script = document.createElement("script");
    script.src = "https://mypropertypal.kit.com/af56587299/index.js";
    script.async = true;
    script.setAttribute("data-uid", "af56587299");
    document.getElementById("email-list-form").appendChild(script);
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#2563eb]">
        Join Our Email List
      </h2>
      <p className="text-gray-700 mb-6">
        Stay updated with the latest features, tips, and exclusive offers from MyPropertyPal.
      </p>
      <div id="email-list-form" className="flex justify-center"></div>
    </section>
  );
}