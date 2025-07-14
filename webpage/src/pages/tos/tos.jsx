import React from "react";
import Head from "next/head.js";
import WebpageHeader from "../header/header.jsx";

const Tos = () => (
  <>
    <Head>
      <meta name="robots" content="noindex, nofollow" />
      <title>Terms of Service</title>
    </Head>
    <WebpageHeader />
    <main className="tos-container">
      <h1 className="tos-title">Terms of Service</h1>
      <p>
        Welcome to MyPropertyPal. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
      </p>

      <h2>1. Use of Service</h2>
      <p>
        You agree to use MyPropertyPal only for lawful purposes and in accordance with these Terms. You are responsible for your use of the service, including any content you provide, submit, or share. You must not use the service to engage in any unlawful, harmful, or fraudulent activity.
      </p>

      <h2>2. User Accounts</h2>
      <p>
        Some features require you to create an account. You agree to provide accurate and complete information and to keep your account credentials confidential. You are responsible for all activities that occur under your account and must notify us immediately of any unauthorized use.
      </p>
    </main>
  </>
);

export default Tos;