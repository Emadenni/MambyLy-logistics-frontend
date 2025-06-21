import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoButik from "../../assets/images/logoButik.webp";
import "./SidoButikBanner.scss";

const SidoButikBanner = () => {
  return (
    <section className="sido-butik-banner">
      <div className="background-pattern" />
      <div className="content">
        <motion.img
          src={logoButik}
          alt="Sido Butik logo"
          className="butik-logo"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.h2
          className="headline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Bygg stort. <span className="highlight"> Betala smått.</span>
        </motion.h2>
        <motion.p
          className="description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Letar du efter ett snabbt och snyggt sätt att få en hemsida? 
          Sido Butik erbjuder färdiga templates som du enkelt kan anpassa till din verksamhet.
        </motion.p>
        <motion.div
          className="cta-wrapper"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link to="/sidoButik" className="cta-button">
            Upptäck Sido Butik →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SidoButikBanner;
