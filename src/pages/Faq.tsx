import { useEffect, useState } from "react";
import api from "../config/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get(`/faqs`);
        if (res.data.success) {
          setFaqs(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <>
      <Navbar />

      <section className="faq p80" id="faq-page">
        <div className="container">
          <h2 className="text-center hadding mb-5">Frequently Asked Questions</h2>
          <div className="row">
            <div className="col-lg-10 m-auto">
              {loading ? (
                <p className="text-center">Loading FAQs...</p>
              ) : (
                <div className="accordion" id="faqAccordion">
                  {faqs.length > 0 ? (
                    faqs.map((faq, i) => (
                      <div className="accordion-item" key={faq.id || i}>
                        <h2 className="accordion-header" id={`heading${i}`}>
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${i}`}
                            aria-expanded="false"
                            aria-controls={`collapse${i}`}
                          >
                            {faq.question}
                          </button>
                        </h2>
                        <div
                          id={`collapse${i}`}
                          className="accordion-collapse collapse"
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body">{faq.answer}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center">No FAQs available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
