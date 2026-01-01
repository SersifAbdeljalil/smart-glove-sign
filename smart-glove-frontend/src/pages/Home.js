/* ============================================
   FICHIER: src/pages/Home.js
   Page d'accueil principale
   ============================================ */

import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import '../styles/home.css';

const Home = () => {
  
  // Scroll vers le haut au chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      {/* Navbar fixe */}
      <Navbar />

      {/* Section Hero */}
      <Hero />

      {/* Section Features */}
      <Features />

      {/* Section À propos (optionnelle) */}
      <section 
        id="about" 
        style={{
          padding: '5rem 0',
          backgroundColor: 'var(--background)',
        }}
      >
        <div className="container">
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <span style={{
              display: 'inline-block',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--secondary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--spacing-lg)'
            }}>
              À Propos
            </span>

            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              Notre Mission
            </h2>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Smart Glove est né de la volonté de rendre la technologie 
              de reconnaissance de gestes accessible à tous. Notre équipe 
              de chercheurs et développeurs passionnés travaille sans 
              relâche pour créer des solutions innovantes basées sur 
              l'intelligence artificielle.
            </p>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              Grâce à notre système de deep learning avancé, nous avons 
              développé une plateforme capable de reconnaître plus de 10 
              gestes différents avec une précision supérieure à 95%, 
              ouvrant ainsi de nouvelles possibilités dans les domaines 
              de l'accessibilité, de la robotique et de l'interaction 
              homme-machine.
            </p>

            {/* Statistiques visuelles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-xl)',
              marginTop: 'var(--spacing-2xl)'
            }}>
              <div style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--background-gray)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  🎓
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  Deep Learning
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  Réseaux de neurones CNN
                </div>
              </div>

              <div style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--background-gray)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  ⚙️
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  Flask + React
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  Architecture moderne
                </div>
              </div>

              <div style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--background-gray)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  🚀
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  Open Source
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  Communauté active
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section 
        id="contact" 
        style={{
          padding: '5rem 0',
          backgroundColor: 'var(--background-gray)',
        }}
      >
        <div className="container">
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <span style={{
              display: 'inline-block',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--secondary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Contact
            </span>

            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Une Question ? Contactez-nous !
            </h2>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              Notre équipe est là pour répondre à toutes vos questions 
              concernant Smart Glove.
            </p>

            {/* Cartes de contact */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              <div style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--background)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  📧
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  Email
                </div>
                <a 
                  href="mailto:contact@smartglove.com"
                  style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  contact@smartglove.com
                </a>
              </div>

              <div style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--background)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  📱
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  Téléphone
                </div>
                <a 
                  href="tel:+212600000000"
                  style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  +212 6 00 00 00 00
                </a>
              </div>
            </div>

            <a 
              href="mailto:contact@smartglove.com"
              className="btn btn-primary btn-large"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              <span>✉️</span>
              <span>Envoyer un Message</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;