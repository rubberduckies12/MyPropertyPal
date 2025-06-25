import React, { useState } from "react";
import WebpageHeader from "../header/header.jsx";
import "../../styles/contact/contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");
    // Placeholder for backend integration
    setTimeout(() => {
      setStatus("Message sent! (Not really, this is a demo.)");
      setForm({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <>
      <WebpageHeader />
      <div className="contact-form-container">
        <h2>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Send</button>
          <div className="form-status">{status}</div>
        </form>
      </div>
    </>
  );
}

export default Contact;