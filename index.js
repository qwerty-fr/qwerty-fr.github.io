'use strict'; // eslint-disable-line

/**
 * General events
 */
const tryOutButton = document.getElementById('try-out');
const learnMoreButton = document.getElementById('learn-more');
const sections = Array.from(document.getElementsByTagName('section'));
const [infoBox, keyboardDemo] = sections;
const input = keyboardDemo.firstElementChild;

tryOutButton.addEventListener('click', () => {
  if (infoBox.classList.contains('hidden')) {
    infoBox.classList.remove('hidden');
    keyboardDemo.classList.add('hidden');

    tryOutButton.classList.remove('go-back');
    tryOutButton.lastElementChild.innerHTML = 'Try out';
  } else {
    infoBox.classList.add('hidden');
    keyboardDemo.classList.remove('hidden');

    tryOutButton.classList.add('go-back');
    tryOutButton.lastElementChild.innerHTML = 'Go back';

    input.focus();
    input.value = '';
    // FIXME: add max character count to input field
  }
});

learnMoreButton.addEventListener('click', () => {
  window.location='https://github.com/qwerty-fr/qwerty-fr#readme';
});

/**
 * Keyboard emulation
 */

window.addEventListener('DOMContentLoaded', async () => {
  const keyboard = document.querySelector('x-keyboard');
  
  if (!keyboard.layout) {
    console.warn('web component x-keyboard couldn\'t be loaded');
    return; // the web component has not been loaded
  }

  const data = await (await fetch('./layouts/qwerty-fr.json')).json();
  const shape = 'iso'; // FIXME: decide based on user keyboard
  keyboard.setKeyboardLayout(data.keymap, data.deadkeys, shape);

  /**
   * Overwrite CSS of shadow DOM
   */
  // const stylesheet = './keyboard.css';
  // keyboard.shadowRoot.adoptedStyleSheets = [stylesheet];

  /**
   * Keyboard highlighting & layout emulation
   */

  // required to work around a Chrome bug, see the `keyup` listener below
  const pressedKeys = {};

  // highlight keyboard keys and emulate the selected layout
  input.addEventListener('keydown', (event) => {
    pressedKeys[event.code] = true;
    const value = keyboard.keyDown(event);
    if (value) {
      event.target.value += value;
    } else if (event.code === 'Enter') { // clear text input on <Enter>
      event.target.value = '';
    } else if ((event.code === 'Tab') || (event.code === 'Escape')) {
      setTimeout(close, 100);
    } else {
      return true; // don't intercept special keys or key shortcuts
    }
    return false; // event has been consumed, stop propagation
  });

  input.addEventListener('keyup', (event) => {
    if (pressedKeys[event.code]) { // expected behavior
      keyboard.keyUp(event);
      delete pressedKeys[event.code];
    } else {
      /**
       * We got a `keyup` event for a key that did not trigger any `keydown`
       * event first: this is a known bug with "real" dead keys on Chrome.
       * As a workaround, emulate a keydown + keyup. This introduces some lag,
       * which can result in a typo (especially when the "real" dead key is used
       * for an emulated dead key) -- but there's not much else we can do.
       */
      event.target.value += keyboard.keyDown(event);
      setTimeout(() => keyboard.keyUp(event), 100);
    }
  });

  /**
   * When pressing a "real" dead key + key sequence, Firefox and Chrome will
   * add the composed character directly to the text input (and nicely trigger
   * an `insertCompositionText` or `insertText` input event, respectively).
   * Not sure wether this is a bug or not -- but this is not the behavior we
   * want for a keyboard layout emulation. The code below works around that.
   */
  input.addEventListener('input', (event) => {
    if (event.inputType === 'insertCompositionText'
      || event.inputType === 'insertText') {
      event.target.value = event.target.value.slice(0, -event.data.length);
    }
  });
});
