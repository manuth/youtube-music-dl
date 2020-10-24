const YTMUSIC_APP_STATE_INPUT_ID = 'ytm-dl-ytmusic-app-state'

const bindInputElem = (elemId, action) => {
  const inputElem = document.getElementById(elemId) || document.createElement('input')
  inputElem.id = elemId
  inputElem.style.display = 'none'
  inputElem.addEventListener('change', (e) => {
    chrome.runtime.sendMessage({
      action,
      value: e.target.value
    })
  })
  document.body.appendChild(inputElem)
}

(() => {
  bindInputElem(YTMUSIC_APP_STATE_INPUT_ID, 'newYtMusicAppState')

  const scriptElem = document.createElement('script')
  scriptElem.innerText = `
    function youtubeMusicDLWatch (elemId, getValueFn) {
      var inputElem = document.getElementById(elemId);
      var currentValue = null;

      setInterval(function () {
        var value = getValueFn();

        if (currentValue !== value) {
          currentValue = value;
          console.log('new value for', elemId, '->', value);
          inputElem.value = value;
          inputElem.dispatchEvent(new Event('change'));
        }
      }, 1000);
    }

    youtubeMusicDLWatch(
      '${YTMUSIC_APP_STATE_INPUT_ID}',
      function () {
        return JSON.stringify(document.querySelector('ytmusic-app').getState())
      }
    );
  `
  document.body.appendChild(scriptElem)
})()
