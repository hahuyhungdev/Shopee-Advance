class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:4000/',
      timeout: 10000,
    });
    this.refreshTokenRequest = null;
    this.instance.interceptors.request.use(
      (config) => {
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
          config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    this.instance.interceptors.response.use(
      (config) => {
        // console.log('response', config);
        return config.data;
      },
      (error) => {
        if (error.response.status === 401 && error.response.data.name === 'EXPIRED_ACCESS_TOKEN') {
          console.log('Erorresponse', error);
          this.refreshTokenRequest = this.refreshTokenRequest
            ? this.refreshTokenRequest
            : refreshToken().finally(() => {
                this.refreshTokenRequest = null;
              });
          return this.refreshTokenRequest
            .then((access_token) => {
              error.response.config.headers.Authorization = access_token;
              return this.instance(error.response.config);
            })
            .catch((error) => {
              console.log(error);
            });
          // keyword "instance" will callback the api just requested failed, so it falls into an infinite loop (sẽ gọi lại api vừa request bị lỗi vừa rồi, vì vậy nó rơi vào một vòng lặp vô hạn)
          // this.instance(error.response.config);
        }
        return Promise.reject(error);
      }
    );
  }

  get(url) {
    return this.instance.get(url);
  }

  post(url, body) {
    return this.instance.post(url, body);
  }
}

const http = new Http();

const fetchProfile = () => {
  http
    .get('profile')
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchProducts = () => {
  http
    .get('products')
    .then((res) => {
      console.log(res.data);
      localStorage.setItem('products', JSON.stringify(res.data));
    })
    .catch((error) => {
      console.log(error);
    });
};

const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  try {
    const res = await http.post('refresh-token', {
      refresh_token,
    });
    const { access_token } = res.data;
    localStorage.setItem('access_token', access_token);
    return access_token;
  } catch (error) {
    throw error.response;
  }
};

document.getElementById('login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  http
    .post('login', {
      username,
      password,
    })
    .then((res) => {
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
    })
    .catch((error) => {
      console.log(error);
    });
});

document.getElementById('btn-get-profile').addEventListener('click', (event) => {
  fetchProfile();
});

document.getElementById('btn-get-products').addEventListener('click', (event) => {
  fetchProducts();

  //  get products to client apend to DOM
  const products = localStorage.getItem('products');
  const productsDOM = document.getElementById('products');

  // product is json array string
  const productstest = JSON.parse(products);

  productstest.forEach((product) => {
    const productDOM = document.createElement('li');
    productDOM.innerHTML = product.name;
    productsDOM.appendChild(productDOM);
  });
});

document.getElementById('btn-get-both').addEventListener('click', (event) => {
  fetchProfile();
  fetchProducts();
});

document.getElementById('btn-refresh-token').addEventListener('click', (event) => {
  refreshToken();
});
