import { render, screen } from '@testing-library/react';
import Ship from './Ship';
import React from 'react';

test('renders ship', () => {
    const fakeRef = React.createRef<HTMLDivElement>();

    render(<Ship ref={fakeRef} />);
    const ship = screen.getByTestId('player1');
    expect(ship).toBeInTheDocument();
});
