document.addEventListener('DOMContentLoaded', () => {
  const avion = document.getElementById('avion');
  const distanciaDiv = document.getElementById('distancia');
  const iniciarBtn = document.getElementById('iniciar');
  const stopBtn = document.getElementById('stop');
  const toggleMusicBtn = document.getElementById('toggle-music'); // Nuevo botón
  const juego = document.getElementById('juego');

  let juegoIniciado = false;
  let distancia = 0;
  let velocidad = 2;
  let movimiento = { x: 0, y: 0 };
  let proyectiles = [];
  let musicaActiva = true; // Estado de la música inicializado como verdadero

  const musicaFondo = new Howl({
    src: ['music.mp3'],
    loop: true,
    volume: 0.5
  });

  const sonidoDisparo = new Howl({
    src: ['disparo.mp3'], // Asegúrate de que la ruta sea correcta
    volume: 0.09 // Ajusta el volumen según lo necesites
  });
  

  toggleMusicBtn.innerText = 'Desactivar Música'; // Inicializa el texto del botón

  function posicionInicialAvion() {
    avion.style.left = '10px';
    avion.style.top = '50%';
    movimiento = { x: 0, y: 0 };
  }

  function moverAvion() {
    const left = parseFloat(avion.style.left) || 0;
    const top = parseFloat(avion.style.top) || 0;

    avion.style.left = Math.max(0, Math.min(left + movimiento.x, juego.offsetWidth - avion.offsetWidth)) + 'px';
    avion.style.top = Math.max(0, Math.min(top + movimiento.y, juego.offsetHeight - avion.offsetHeight)) + 'px';

    if (juegoIniciado) requestAnimationFrame(moverAvion);
  }

  function dispararProyectil() {
    if (!juegoIniciado) return;

    const proyectil = document.createElement('div');
    proyectil.classList.add('proyectil');

    const puntoDisparo = document.getElementById('puntoDisparo');
    const puntoRect = puntoDisparo.getBoundingClientRect();

    proyectil.style.left = (puntoRect.left - 41) + 'px';
    proyectil.style.top = (puntoRect.top - 81) + 'px'; // Ajuste hacia arriba

    juego.appendChild(proyectil);
    proyectiles.push(proyectil);

    // Reproducir sonido de disparo
    sonidoDisparo.play();
  }

  function moverProyectiles() {
    proyectiles.forEach((proyectil, index) => {
      let proyectilLeft = proyectil.offsetLeft;
      proyectilLeft += 5; // Velocidad del proyectil
      proyectil.style.left = proyectilLeft + 'px';

      // Eliminar proyectil si sale de la pantalla
      if (proyectilLeft > juego.offsetWidth) {
        juego.removeChild(proyectil);
        proyectiles.splice(index, 1);
      }
    });

    if (juegoIniciado) requestAnimationFrame(moverProyectiles);
  }

  document.addEventListener('keydown', (event) => {
    if (!juegoIniciado) return;

    switch (event.key) {
      case 'ArrowUp':
        movimiento.y = -velocidad;
        break;
      case 'ArrowDown':
        movimiento.y = velocidad;
        break;
      case 'ArrowLeft':
        movimiento.x = -velocidad;
        break;
      case 'ArrowRight':
        movimiento.x = velocidad;
        break;
      case ' ': // Barra espaciadora
        dispararProyectil();
        break;
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        movimiento.y = 0;
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        movimiento.x = 0;
        break;
    }
  });

  iniciarBtn.addEventListener('click', () => {
    juegoIniciado = true;
    distancia = 0;
    distanciaDiv.innerText = 'Distancia: ' + distancia;
    iniciarBtn.disabled = true;
    juego.style.animationPlayState = 'running';
    posicionInicialAvion();
    requestAnimationFrame(moverAvion);
    requestAnimationFrame(moverProyectiles);
    
    if (musicaActiva) {
      musicaFondo.play(); // Reproducir música solo al iniciar el juego
    }
  });

  stopBtn.addEventListener('click', () => {
    juegoIniciado = false;
    iniciarBtn.disabled = false;
    juego.style.animationPlayState = 'paused';
    movimiento = { x: 0, y: 0 };
    posicionInicialAvion();
    musicaFondo.pause(); // Pausar la música al detener el juego
    proyectiles.forEach(proyectil => juego.removeChild(proyectil));
    proyectiles = [];
  });

  toggleMusicBtn.addEventListener('click', () => {
    musicaActiva = !musicaActiva; // Alternar estado de la música
    if (musicaActiva) {
      musicaFondo.play(); // Reproducir música
      toggleMusicBtn.innerText = 'Desactivar Música'; // Cambiar el texto del botón
    } else {
      musicaFondo.pause(); // Pausar música
      toggleMusicBtn.innerText = 'Activar Música'; // Cambiar el texto del botón
    }
  });

  function incrementarDistancia() {
    if (juegoIniciado) {
      distancia++;
      distanciaDiv.innerText = 'Distancia: ' + distancia;
    }
  }
  setInterval(incrementarDistancia, 100);
}); // Fin de DOMContentLoaded
