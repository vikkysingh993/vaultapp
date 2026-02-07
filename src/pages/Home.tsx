import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ First time login? Auto redirect to launchpad
  useEffect(() => {
    if (user && sessionStorage.getItem("firstTimeLogin")) {
      sessionStorage.removeItem("firstTimeLogin");
      navigate("/launchpad", { replace: true });
    }
  }, [user, navigate]);
  return (
    <>
      <Navbar />
        <Header />

      {/* ===== Now Coin Section ===== */}
      <section className="launch p80 bg_color" id="about-us3">
        <div className="container">
          <h2 className="tc hadding text-center mb-4">Now Coin</h2>
          <div className="row align-items-center">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div className="col-md-4 mb-3" key={i}>
                <a href="/coin" className="coin_box">
                  <div className="d-flex mb-3">
                    <div className="text-center coin_box_left">
                      <img
                        className="img-fluid"
                        src="/img/about.png"
                        alt="about"
                      />
                    </div>
                    <div>
                      <h3>Occy Token (OCCY)</h3>
                      <div className="color1">
                        <span className="font-medium text-green-300">
                          market cap: $
                        </span>
                        2.3M
                      </div>
                      <div>
                        <span className="text-[#9DA3AE]">replies: 314</span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-0">
                    New South Park Episode Takes Aim at Memecoins
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Ecosystem Section ===== */}
      <section id="about-us2">
        <div className="ecosystem_secrtion p80 text-center" id="token">
          <div className="container">
            <div className="row mb-4">
              <div className="col-md-9 m-auto text-center">
                <h2 className="hadding mb-3">Occy Token Ecosystem</h2>
                <p>
                  Welcome to Occy Token, where we connect users to Top-Notch
                  Projects and introduce <br />
                  Projects to Global Investors effortlessly.
                </p>
              </div>
            </div>

            <div className="row">
              {[
                {
                  img: "launchpad.png",
                  title: "Launchpad",
                  desc: "Experience the future of crypto with Our Launchpad, where groundbreaking projects take flight to revolutionize the world of Blockchain.",
                },
                {
                  img: "incubator.png",
                  title: "Incubator",
                  desc: "We Fuel the growth of cutting-edge crypto startups in our Incubator, nurturing innovation and propelling them towards boundless success.",
                },
                {
                  img: "multichain_ido.webp",
                  title: "Multichain IDOs",
                  desc: "Amplify your crypto potential with Multichain IDOs where innovation has no boundaries and we welcome diverse blockchains to thrive.",
                },
                {
                  img: "nextgen_projects.webp",
                  title: "NextGen Projects",
                  desc: "Step into the world of tomorrow's crypto advancements through our NextGen projects, where visionary concepts lead to WEB 3.0 evolution.",
                },
                {
                  img: "partnerships.png",
                  title: "Partnerships",
                  desc: "Beyond launching groundbreaking projects, we empower their journey with unparalleled support through strategic partnerships with CEXs, Media Partners, and Brand Ambassadors.",
                },
                {
                  img: "marketing.png",
                  title: "Marketing",
                  desc: "Boost your crypto project's success with our Marketing Experts, where our advanced promotion strategies fuel growth and yield amazing results.",
                },
              ].map((x) => (
                <div className="col-md-4 col-sm-6 mb-4" key={x.title}>
                  <div className="ecosystem_box">
                    <img src={`/img/${x.img}`} alt={x.title} />
                    <h4>{x.title}</h4>
                    <p>{x.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Launch Section ===== */}
      <section className="launch p80 bg_color" id="about-us3-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="text-center mb-5 mb-md-0">
                <img
                  className="img-fluid animation1 h450"
                  src="/img/launch.png"
                  alt="launch"
                />
              </div>
            </div>
            <div className="col-md-6">
              <h2 className="tc hadding">
                Launch <br /> On Occy Token
              </h2>
              <p className="mb-4">
                Unleash your project's potential, seize the spotlight and secure
                your project's future with an exciting IDO on our cutting-edge
                crypto launchpad.
              </p>
              <a href="/apply-ido" className="btn btn_man">
                Apply for IDO
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== About Us Section ===== */}
      <section className="about_us p80" id="about-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 order-md-2 text-center">
              <img src="/img/about.png" alt="about" className="img-fluid" />
            </div>
            <div className="col-md-6 order-md-1 taj">
              <h2 className="hadding">About Us</h2>
              <p>
                At our Occy Token launchpad, we have built a vibrant ecosystem
                that not only launches the projects but also helps incubate them
                at every stage. With a passionate team of experts, we are
                dedicated to fostering the next generation of innovators and
                revolutionaries. From ideation to launches, we offer
                unparalleled support, guiding projects through every step of
                their journey, backed by state-of-the-art technology and
                strategic partnerships. By choosing our launchpad, you gain
                access to a global community of investors, influencers, and
                enthusiasts eager to witness the greatness unfold. Embrace the
                future of Web 3.0 and soar to unparalleled heights with us.
                <br />
                Your destiny awaits!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Partners Section ===== */}
      <section
        className="launch p80 bg_color text-center partners"
        id="about-us4"
      >
        <h2 className="tc hadding mb-5">Our Partners</h2>
        <div className="container">
          <div className="row align-items-center">
            {[
              "sonic-labs.png",
              "silo-lending.png",
              "beets.png",
              "occ.avif",
            ].map((src) => (
              <div className="col-md-3 mb-4 mb-sm-0" key={src}>
                <div className="text-center">
                  <img className="img-fluid" src={`/img/${src}`} alt="partner" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="faq p80" id="faq">
        <h3 className="text-center hadding mb-5">
          Frequently Asked Questions (FAQs)
        </h3>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 m-auto">
              <div className="accordion" id="accordionEx">
                {[
                  {
                    q: "What is Occy Token?",
                    a: "Occy Token is a cutting-edge crypto Launchpad and Incubator designed to empower blockchain projects and investors.",
                  },
                  {
                    q: "How does Occy Token ensure security for investors?",
                    a: "Occy Token employs robust security measures, including decentralized KYC using BABT (Binance Account Bound Token).",
                  },
                  {
                    q: "What is BABT, and how does it work for KYC?",
                    a: "BABT (Binance Account Bound Token) is a unique KYC solution that eliminates the need for third-party providers.",
                  },
                  {
                    q: "How does the refund policy work?",
                    a: "We offer a 7-day, No-Questions-Asked refund option if you haven't claimed TGE yet.",
                  },
                  {
                    q: "What sets Occy Token apart from other Launchpads?",
                    a: "Occy Token prioritizes decentralization, strong KYC, after-hack protection, and user safety.",
                  },
                  {
                    q: "How can I participate in IDOs?",
                    a: "Join our community and follow updates on upcoming projects and events.",
                  },
                  {
                    q: "How can I contact Occy Token for further inquiries?",
                    a: "Use our contact form or join our community on social media.",
                  },
                  {
                    q: "Is Occy Token open to collaborations or partnerships?",
                    a: "Yes, Occy Token welcomes collaborations with other blockchain projects and organizations.",
                  },
                ].map((item, i) => (
                  <div className="accordion-item" key={i}>
                    <h2 className="accordion-header" id={`heading${i}`}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${i}`}
                        aria-expanded="false"
                        aria-controls={`collapse${i}`}
                      >
                        {item.q}
                      </button>
                    </h2>
                    <div
                      id={`collapse${i}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionEx"
                    >
                      <div className="accordion-body">{item.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
