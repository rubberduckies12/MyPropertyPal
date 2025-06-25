import React from "react";
import Head from "next/head.js";
import WebpageHeader from "../header/header.jsx";
import "../../styles/tos/tos.css";

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

      <h2>3. Intellectual Property</h2>
      <p>
        All content, trademarks, logos, software, and data provided by MyPropertyPal or its licensors remain our property or that of our licensors. You may not copy, modify, distribute, or create derivative works without our prior written permission.
      </p>

      <h2>4. Third-Party Services and Data</h2>
      <p>
        Our service may integrate with third-party APIs, data providers, and services. Use of such third-party data is subject to their respective terms and conditions. We do not warrant or guarantee the accuracy, completeness, or availability of any third-party data or services.
      </p>

      <h2>5. Affiliate Links and Advertising</h2>
      <p>
        MyPropertyPal may contain affiliate links, advertising, or sponsored content. This means we may receive a commission or other compensation if you click on or make a purchase through these links, at no extra cost to you. We only promote products or services that we believe provide value to our users.
      </p>
      <p>
        Please note that we have no control over the content, policies, or practices of third-party sites and disclaim any responsibility for their actions or omissions. Your use of affiliate links is at your own risk, and we recommend reviewing the terms and privacy policies of any linked sites before engaging.
      </p>

      <h2>6. User Content</h2>
      <p>
        You retain ownership of any content you submit through MyPropertyPal but grant us a worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, and display such content to provide and promote the service.
      </p>
      <p>
        You agree not to submit content that is unlawful, infringing, defamatory, or otherwise objectionable. We reserve the right to remove or disable any content that violates these Terms or our policies.
      </p>

      <h2>7. Privacy</h2>
      <p>
        Please review our <a href="/privacy/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> to understand how we collect, use, and protect your personal information. By using MyPropertyPal, you consent to our data practices as described therein.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        MyPropertyPal is provided "as is" and "as available" without warranties of any kind, either express or implied. To the fullest extent permitted by law, we disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
      </p>
      <p>
        We are not liable for any direct, indirect, incidental, consequential, special, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use or inability to use the service.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless MyPropertyPal, its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your access to or use of the service or your violation of these Terms.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We reserve the right to modify or update these Terms at any time. When changes are made, we will revise the "Last Updated" date at the top of this page and, where appropriate, notify you through the service or via email. Your continued use of MyPropertyPal after any such changes constitutes acceptance of the new Terms.
      </p>

      <h2>11. Governing Law and Jurisdiction</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of England and Wales. You agree that any dispute arising out of or relating to these Terms or your use of MyPropertyPal shall be subject to the exclusive jurisdiction of the courts of England and Wales.
      </p>

      <h2>12. Severability</h2>
      <p>
        If any provision of these Terms is found to be invalid or unenforceable by a court, the remaining provisions will continue in full force and effect.
      </p>

      <h2>13. Entire Agreement</h2>
      <p>
        These Terms, together with our Privacy Policy and any other legal notices published by MyPropertyPal, constitute the entire agreement between you and MyPropertyPal regarding the use of our services.
      </p>

      <h2>14. Contact Us</h2>
      <p>
        If you have any questions or concerns about these Terms, please contact us at <a href="mailto:support@mypropertypal.com">support@mypropertypal.com</a>.
      </p>

      <p className="tos-footer">
        &copy; {new Date().getFullYear()} MyPropertyPal. All rights reserved.
      </p>
    </main>
  </>
);

export default Tos;