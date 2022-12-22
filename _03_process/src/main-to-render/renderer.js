const counter = document.getElementById('counter');

const callback = (event, value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue;
  event.sender.send('counter-value', newValue);
};

window.electronAPI.handleCounter(callback);
