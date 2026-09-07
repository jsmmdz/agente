const item = document.getElementById('demo')


const myButton = document.getElementById('myButton');

myButton.addEventListener('click', () => {
  item.textContent = 'Hola mundo';
});
