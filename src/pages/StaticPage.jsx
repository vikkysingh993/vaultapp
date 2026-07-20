import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axios";
import "../assets/css/static-page.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function StaticPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    setPage(null); // reset on slug change so skeleton shows on every navigation
    api.get(`/pages/${slug}`)
      .then(res => setPage(res.data?.data || res.data))
      .catch(() => setPage(false));
  }, [slug]);

  // ── Loading skeleton — prevents blank flash on navigation ──
  if (page === null)
    return (
      <>
        <Navbar />
        <section className="static-page">
          <div className="page-hero page-hero--skeleton">
            <div className="container hero-copy">
              <div className="skeleton-line skeleton-badge" />
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-intro" />
            </div>
          </div>
          <div className="container page-body">
            <div className="page-card">
              <div className="skeleton-line skeleton-body" />
              <div className="skeleton-line skeleton-body skeleton-body--short" />
              <div className="skeleton-line skeleton-body" />
              <div className="skeleton-line skeleton-body skeleton-body--mid" />
            </div>
          </div>
        </section>
        <Footer />
      </>
    );

  if (page === false)
    return (
      <>
        <Navbar />
        <div className="page-not-found">
          <span>🔍</span>
          <p>Page not found</p>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <section className="static-page static-page--loaded">
        <div className="page-hero">
          <div className="container hero-copy">
            <span className="page-badge">Launchpad Guide</span>
            <h1 className="page-title">{page.title}</h1>
            <p className="page-intro">Discover a more polished style for OCC Launchpad pages with a premium layout, bold headings, and refined text panels.</p>
          </div>
        </div>

        <div className="container page-body">
          <div className="page-card">
            <div className="page-content" dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
