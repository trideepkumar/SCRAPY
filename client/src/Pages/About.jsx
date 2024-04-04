import React from "react";

export default function About() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 flex flex-col justify-center align-middle">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-400">About Us</h1>
        </header>

        {/* Main content */}
        <section className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-500">
            Welcome to our About page! We are dedicated to providing you with
            information about our company and what we stand for.
          </p>
          <p className="mt-4 text-lg text-gray-500">
            Our mission is to clear issues and provide solutions to our
            customers. We strive to deliver the best service and products to
            meet your needs.
          </p>
          <p className="mt-4 text-lg text-gray-500">
            Thank you for visiting our About page. If you have any questions or
            inquiries, please feel free to{" "}
            <a href="/about" className="text-blue-200 hover:underline">
              contact us
            </a>
            .
          </p>
          <p className="mt-4 text-lg text-gray-500">
          How we protect your information

We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.
          </p>
          <p className="mt-4 text-lg text-gray-500">
            Contacting us If you have any questions about this Privacy Policy,
            the practices of this site, or your dealings with this site, please
            contact us at: Second Handie  <a href="/about" className="text-blue-200 hover:underline">
              secondHandie@gmail.com
            </a>
          </p>
        </section>

        <footer className="mt-8 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Company Name. All rights reserved.
        </footer>
      </div>
    </>
  );
}
