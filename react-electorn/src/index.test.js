import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { channels } from './shared/constants';
import App from './App';

const { ipcRenderer } = require('electron');

describe('App component', () => {
  it('Should search for a product after clicking search', () => {
    render(<App />);

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button');
    const product = 'notebook';

    userEvent.type(input, product);
    userEvent.click(searchButton);

    expect(ipcRenderer.send).toBeCalledWith(channels.GET_DATA, {
      product,
    });
  });

  it('Should render the search result on the page', () => {
    render(<App />);
    const mData = {
      name: 'notebook',
      price: '2500',
      color: 'gray',
    };

    act(() => {
      ipcRenderer.on.mock.calls[0][1](null, mData);
    });

    expect(ipcRenderer.on).toBeCalledWith(
      channels.GET_DATA,
      expect.any(Function)
    );

    expect(screen.getByText(/Name/).textContent).toEqual(`Name: ${mData.name}`);
    expect(screen.getByText(/Price/).textContent).toEqual(
      `Price: ${mData.price}`
    );
    expect(screen.getByText(/Color/).textContent).toEqual(
      `Color: ${mData.color}`
    );
  });
});
