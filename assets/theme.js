/*
// ===================== TRANSITIONS PAGE =====================
// Animation des points au chargement
document.addEventListener("DOMContentLoaded", () => {
  const pageTransition = document.querySelector('.page-transition');
  
  // Affiche 3 points animés au début (déjà géré par le CSS)
  // Après 1.2s, on disparaît doucement
  setTimeout(() => {
    pageTransition.style.opacity = 0;
    pageTransition.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      pageTransition.style.display = 'none';
    }, 600);
  }, 1000);
});
*/

document.addEventListener("DOMContentLoaded", () => {
  const pageTransition = document.querySelector(".page-transition");

  function animateHeroWords() {
    const heroTitles = document.querySelectorAll("h1#hero-title");
    heroTitles.forEach(h1 => {
      const text = h1.innerText.trim();
      h1.innerHTML = "";
      text.split(" ").forEach((word, i) => {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = word;
        span.style.opacity = "0";
        span.style.transform = "translateY(40px)";
        span.style.transition = `all 0.5s ease ${i * 0.15}s`;
        h1.appendChild(span);
        h1.appendChild(document.createTextNode(" "));
      });

      // Toujours attendre que l'overlay ait disparu
      const startAnimation = () => {
        const spans = h1.querySelectorAll(".word");
        spans.forEach(span => {
          span.style.opacity = "1";
          span.style.transform = "translateY(0)";
        });
      };

      if (pageTransition) {
        // On vérifie régulièrement si l'overlay est caché
        const checkVisible = setInterval(() => {
          const style = getComputedStyle(pageTransition);
          if (style.display === "none" || style.opacity === "0") {
            clearInterval(checkVisible);
            requestAnimationFrame(startAnimation);
          }
        }, 50);
      } else {
        // Pas de transition, on anime directement
        requestAnimationFrame(startAnimation);
      }
    });
  }

  animateHeroWords();
});




// ===================== ANIMATION ELEMENTS AU SCROLL =====================
document.addEventListener('DOMContentLoaded', () => {
  const animElements = document.querySelectorAll('.card, .skill, .project, .service');

  // Observer pour détecter quand l'élément est visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // On arrête d'observer une fois visible
      }
    });
  }, {
    threshold: 0.2 // 20% visible pour déclencher l'animation
  });

  animElements.forEach(el => observer.observe(el));
});



// ===================== Animation de l'ombre du logo =====================
  const blurNode = document.querySelector('#shadow-j-green feGaussianBlur');
  const floodNode = document.querySelector('#shadow-j-green feFlood');
  const duration = 4000; // cycle complet pour la pulsation
  let startTime;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    // Pulsation de l'ombre
    const factor = Math.sin((elapsed / duration) * 2 * Math.PI) * 0.5 + 0.5;
    floodNode.setAttribute('flood-opacity', 0.3 + factor * 0.7); // 0.2 → 0.7
    blurNode.setAttribute('stdDeviation', 3 + factor * 7); // 2 → 10

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);



  function afficherAnneeEnCours() {
  const annee = new Date().getFullYear();
  document.getElementById('annee').textContent = annee;
}

// Appeler la fonction pour mettre à jour l'élément HTML
afficherAnneeEnCours();