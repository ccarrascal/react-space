import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import store from 'store/index';

HTMLCanvasElement.prototype.getContext = () => { 
  return null;
};

test('Renders the App on screen', () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>);
    const title1 = screen.getByText(/player 1 get ready/i);
    expect(title1).toBeInTheDocument();
});
