// src/components/WrapperAnimadoParaHistorias.tsx

import React, { useEffect, useRef, useState } from 'react';
import estilos from 'estilosParaHistorias/WrapperAnimadoParaHistorias.module.css';

interface WrapperAnimadoParaHistoriasProps {
  children: React.ReactNode;
}

const WrapperAnimadoParaHistorias: React.FC<WrapperAnimadoParaHistoriasProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio < 0.5) {
            setOpacity(0);
          } else {
            setOpacity(1);
          }
        });
      },
      {
        threshold: [0.5],
      }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      if (wrapperRef.current) {
        observer.unobserve(wrapperRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={estilos.wrapper}
      style={{ opacity }}
    >
      {children}
    </div>
  );
};

export default WrapperAnimadoParaHistorias;
