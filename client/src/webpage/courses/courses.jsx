import React from "react";
import "./courses.css";

export default function Courses() {
  return (
    <main className="courses-container">
      <h1 className="courses-title">Training Courses</h1>
      <p className="courses-intro">
        Welcome to our Training Courses page! Here you'll find resources and
        upcoming sessions to help you get the most out of MyPropertyPal.
      </p>
      <section className="courses-list">
        <div className="course-card">
          <h2>Getting Started with MyPropertyPal</h2>
          <p>
            Learn the basics of setting up your account, adding properties, and
            managing tenants.
          </p>
          <span className="course-date">Next session: July 10, 2025</span>
        </div>
        <div className="course-card">
          <h2>Advanced Features</h2>
          <p>
            Deep dive into automation, reporting, and integrations to maximize
            your productivity.
          </p>
          <span className="course-date">Next session: July 24, 2025</span>
        </div>
        <div className="course-card">
          <h2>Q&amp;A and Community Support</h2>
          <p>
            Join our open Q&amp;A to get your questions answered and connect
            with other users.
          </p>
          <span className="course-date">Next session: August 7, 2025</span>
        </div>
      </section>
    </main>
  );
}