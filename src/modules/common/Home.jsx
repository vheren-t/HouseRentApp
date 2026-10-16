import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import PropertyCards from '../user/AllPropertiesCards.jsx';

export default function Home() {
  const [list, setList] = useState([]);
  useEffect(() => { api.get('/user/properties').then((r) => setList(r.data)).catch(() => {}); }, []);

  return (
    <>
      <section className="hero">
        <div>
          <h1 className="fw-bold">Find Your Dream Rental Property</h1>
          <p className="text-secondary">Comfort, convenience & class — all in one place</p>
        </div>
      </section>
      <div className="container py-4">
        <div className="text-center mb-4">
          <h3>Explore Our Premium Properties</h3>
          <span className="small text-secondary">Ingin memasang properti? </span>
          <Link to="/register" className="btn btn-outline-primary btn-sm">Register as Owner</Link>
        </div>
        <PropertyCards list={list} />
      </div>
    </>
  );
}
