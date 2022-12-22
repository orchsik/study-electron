const channels = {
  GET_DATA: 'get_data',
  QUIT: 'quit',
};

const mock = {
  products: {
    notebook: {
      name: 'notebook',
      price: '2500',
      color: 'gray',
    },
    headphone: {
      name: 'headphone',
      price: '700',
      color: 'black',
    },
  },
};

module.exports = {
  channels,
  mock,
};
