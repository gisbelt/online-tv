import './style.css'

document.querySelector('#app').innerHTML = `
  <div id="channel"></div>
  <div id="darkmode"><span class="material-symbols-outlined"><i class='bx bx-sun'></i></span></div>
  <div id="message-channel"></div>
  <div data-shaka-player-container style="width: 100%" data-shaka-player-cast-receiver-id="1BA79154" class="full-media">
      <video autoplay data-shaka-player id="video" style="width:100%;height:100%" type="application/x-mpegURL"></video>
  </div>
  <div id="controls">
      <button id="prev-channel" title="Anterior Canal"><i class='bx bx-skip-previous'></i></button>
      <button id="next-channel" title="Siguiente Canal"><i class='bx bx-skip-next'></i></button>
  </div>
`

