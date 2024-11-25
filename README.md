# transcendence

1 -How to use Axios in React

Axios is a popular JavaScript library used to make HTTP requests to external resources. It is often used in React applications to interact with a server or API.


- Install Axios:

```
npm install axios
```

- use Axios 

```import axios from 'axios';

axios.get('https://jsonplaceholder.typicode.com/posts')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });
```