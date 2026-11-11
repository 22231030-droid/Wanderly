import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  ArrowRight,
  Plane,
  HelpCircle,
  Sparkles,
  MapPin,
} from "lucide-react";

import "./Contact.css";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSuccess(false);
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!form.subject) {
      newErrors.subject = "Please select a subject.";
    }

    if (!form.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (form.message.trim().length < 10) {
      newErrors.message =
        "Your message must contain at least 10 characters.";
    }

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }

    const newMessage = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject,
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = JSON.parse(
        localStorage.getItem("wanderlyMessages") || "[]"
      );

      const previousMessages = Array.isArray(saved)
        ? saved
        : [];

      localStorage.setItem(
        "wanderlyMessages",
        JSON.stringify([...previousMessages, newMessage])
      );

      setForm(initialForm);
      setErrors({});
      setSuccess(true);
    } catch {
      setErrors({
        submit:
          "Unable to save your message. Please try again.",
      });
      setSuccess(false);
    }
  }

  return (
    <main className="contact-page">

      {/* HERO */}
      <section className="contact-hero">
        <span className="contact-hero-badge">
          <Sparkles size={16} />
          WE'D LOVE TO HEAR FROM YOU
        </span>

        <h1>
          Let's Start a
          <span> Conversation.</span>
        </h1>

        <p>
          Have a question, suggestion, or feedback?
          Share your thoughts with Wanderly.
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="contact-container">

        {/* LEFT SIDE */}
        <div className="contact-info">

          <span className="contact-label">
            GET IN TOUCH
          </span>

          <h2>
            Your Journey Matters
            <span> to Us.</span>
          </h2>

          <p className="contact-description">
            Whether you have a question about Wanderly
            or an idea for improving the experience,
            we'd love to hear your feedback.
          </p>

          <div className="contact-info-cards">

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Mail size={23} />
              </div>

              <div>
                <h3>Send a Message</h3>
                <p>
                  Use our contact form to share
                  your questions and suggestions.
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <MessageCircle size={23} />
              </div>

              <div>
                <h3>Share Your Feedback</h3>
                <p>
                  Tell us what you enjoy and what
                  we could improve.
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <HelpCircle size={23} />
              </div>

              <div>
                <h3>Need Help Planning?</h3>
                <p>
                  Explore Wanderly's tools to organize
                  your next adventure.
                </p>
              </div>
            </div>

          </div>

          <div className="contact-explore-card">
            <div className="contact-explore-icon">
              <Plane size={28} />
            </div>

            <h3>Adventure Is Calling!</h3>

            <p>
              Discover inspiring destinations and
              start planning your next journey.
            </p>

            <Link to="/explore">
              Explore Destinations
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE — FORM */}
        <div className="contact-form-card">

          <div className="contact-form-heading">
            <div className="contact-form-icon">
              <Send size={24} />
            </div>

            <h2>Send Us a Message</h2>

            <p>
              Fill out the form below to save
              your message.
            </p>
          </div>

          {success && (
            <div
              className="contact-success"
              role="status"
            >
              <CheckCircle2 size={22} />

              <div>
                <strong>Message saved successfully!</strong>

                <p>
                  Your message was saved in this browser.
                  It has not been emailed or sent to a server.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="contact-form-row">

              <div className="contact-field">
                <label htmlFor="contact-name">
                  Full Name *
                </label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.name)}
                />

                {errors.name && (
                  <span className="contact-error">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">
                  Email Address *
                </label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                />

                {errors.email && (
                  <span className="contact-error">
                    {errors.email}
                  </span>
                )}
              </div>

            </div>

            <div className="contact-field">
              <label htmlFor="contact-subject">
                Subject *
              </label>

              <select
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                aria-invalid={Boolean(errors.subject)}
              >
                <option value="">
                  Select a subject
                </option>

                <option value="General Question">
                  General Question
                </option>

                <option value="Feedback">
                  Feedback
                </option>

                <option value="Feature Suggestion">
                  Feature Suggestion
                </option>

                <option value="Technical Issue">
                  Technical Issue
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              {errors.subject && (
                <span className="contact-error">
                  {errors.subject}
                </span>
              )}
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">
                Your Message *
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows="6"
                placeholder="Tell us what's on your mind..."
                value={form.message}
                onChange={handleChange}
                aria-invalid={Boolean(errors.message)}
              />

              <div className="contact-message-footer">
                {errors.message ? (
                  <span className="contact-error">
                    {errors.message}
                  </span>
                ) : (
                  <span>Minimum 10 characters</span>
                )}

                <span>
                  {form.message.length} characters
                </span>
              </div>
            </div>

            {errors.submit && (
              <p className="contact-error" role="alert">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              className="contact-submit-button"
            >
              <Send size={19} />
              Save Message
              <ArrowRight size={18} />
            </button>

            <p className="contact-privacy-note">
              <MapPin size={15} />
              Demo form: messages are stored locally
              on this device, not transmitted.
            </p>

          </form>
        </div>

      </section>

      {/* CTA */}
      <section className="contact-cta">
        <span>KEEP EXPLORING</span>

        <h2>Your Next Adventure Awaits.</h2>

        <p>
          The world is full of amazing places.
          Where will you go next?
        </p>

        <Link to="/my-trips">
          Plan Your Next Trip
          <ArrowRight size={19} />
        </Link>
      </section>

    </main>
  );
}

export default Contact;