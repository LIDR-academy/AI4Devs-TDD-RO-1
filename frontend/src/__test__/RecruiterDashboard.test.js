// RecruiterDashboard.test.js
// Tests for RecruiterDashboard component

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecruiterDashboard from '../components/RecruiterDashboard';

describe('RecruiterDashboard', () => {
  it('should render dashboard correctly', () => {
    render(
      <MemoryRouter>
        <RecruiterDashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/dashboard del reclutador/i)).toBeInTheDocument();
    expect(screen.getByAltText(/lti logo/i)).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(
      <MemoryRouter>
        <RecruiterDashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /añadir nuevo candidato/i })).toBeInTheDocument();
  });
});
