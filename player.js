async function init(link) {

  const [url, key] = link.split('?&ck=');
  const ck = window.atob(key);
  // console.log(window.atob(key))

  // When using the UI, the player is made automatically by the UI object.
  const video = document.getElementById('video');
  const ui = video['ui'];
  if (!ui) {
      return;
  }
  const controls = ui.getControls();
  const player = controls.getPlayer();

  const config = {
          'controlPanelElements' : ['play_pause', 'time_and_duration', 'fullscreen', 'overflow_menu'],
          'overflowMenuButtons': ['quality', 'language', 'cast', 'picture_in_picture']
      }

  ui.configure(config);

  player.configure({
  drm: {
      clearKeys: JSON.parse(ck),
  }
  });

  // Attach player and ui to the window to make it easy to access in the JS console.
  window.player = player;
  window.ui = ui;

  // Listen for error events.
  player.addEventListener('error', onPlayerErrorEvent);
  controls.addEventListener('error', onUIErrorEvent);
  

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
      await player.load(url);
      // This runs if the asynchronous load is successful.
      console.log('The video has now been loaded!');
      const messageContainer = document.getElementById('message-channel');
      messageContainer.innerHTML = '';
      messageContainer.style.display = 'none';

  } catch (error) {
      onPlayerError(error) 
  }
}

function onPlayerErrorEvent(errorEvent) {
  onPlayerError(event.detail);
}

function onPlayerError(error) {
  console.error('Error code', error.code, 'object', error);
  const messageContainer = document.getElementById('message-channel');
  messageContainer.innerHTML = `
    <p>No se ha podido cargar el canal. Por favor vaya al siguiente canal</p>
  `;
  messageContainer.style.display = 'block';
}

function onUIErrorEvent(errorEvent) {
  yerError(event.detail);
}

function initFailed(errorEvent) {
  console.error('Unable to load the UI library!');
}


export {init, initFailed}
