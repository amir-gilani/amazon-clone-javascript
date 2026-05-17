const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
  console.log(xhr.response);
});

xhr.addEventListener('error', () => {
  console.log('Network error');
});

xhr.open('GET', 'https://supersimplebackend.dev');
xhr.send();
