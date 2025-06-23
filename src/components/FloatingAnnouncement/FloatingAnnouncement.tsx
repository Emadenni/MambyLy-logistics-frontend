// src/components/FloatingAnnouncement/FloatingAnnouncement.tsx
import React, { useEffect, useState } from "react";
import "./floatingAnnouncement.scss";

const FloatingAnnouncement = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 20000); // scompare dopo 20 secondi

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
   <div className="floating-announcement">
  🚀 Snart tillgänglig: <strong>Piazza Grande</strong>!
  <button className="close-btn" onClick={() => setVisible(false)}>x</button>
</div>
  );
};

export default FloatingAnnouncement;
