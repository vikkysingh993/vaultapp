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
      .then(res => setPage(res.data))
      .catch(() => setPage(false));
  }, [slug]);

  if (page === null) return null;
  if (page === false) return <h2>Page not found</h2>;

  return (
    <>
      <Navbar />
        <section className="static-page">
      <div className="container">
        <h1 className="page-title">{page.title}</h1>

        {/* 🔥 CMS HTML render */}
        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </section>
      <Footer />
    </>
  );
}
