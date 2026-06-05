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
    api.get(`/pages/${slug}`)
      .then(res => setPage(res.data?.data || res.data))
      .catch(() => setPage(false));
  }, [slug]);

  if (page === null) return null;
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
      <section className="static-page">
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
