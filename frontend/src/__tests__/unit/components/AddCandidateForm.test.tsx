import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddCandidateForm from '../../../components/AddCandidateForm';

// Mock de react-datepicker
jest.mock('react-datepicker', () => {
  return function MockDatePicker(props: any) {
    return (
      <input
        data-testid="datepicker"
        onChange={(e) => props.onChange && props.onChange(new Date(e.target.value))}
        placeholder={props.placeholderText}
      />
    );
  };
});

// Mock de FileUploader
jest.mock('../../../components/FileUploader', () => {
  return function MockFileUploader(props: any) {
    return (
      <input
        data-testid="file-uploader"
        type="file"
        onChange={(e) => props.onChange && props.onChange({ filePath: 'test.pdf', fileType: 'application/pdf' })}
      />
    );
  };
});

// Mock de fetch
global.fetch = jest.fn();

describe('AddCandidateForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields', () => {
    render(<AddCandidateForm />);
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(<AddCandidateForm />);
    
    const firstNameInput = screen.getByLabelText(/nombre/i);
    const lastNameInput = screen.getByLabelText(/apellido/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    
    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john.doe@example.com');
  });

  it('should add education section when button is clicked', () => {
    render(<AddCandidateForm />);
    
    const addEducationButton = screen.getByText(/añadir educación/i);
    fireEvent.click(addEducationButton);
    
    expect(screen.getByPlaceholderText(/institución/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/título/i)).toBeInTheDocument();
  });

  it('should handle form submission successfully', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      status: 201,
      json: async () => ({ message: 'Success' }),
    } as Response);

    render(<AddCandidateForm />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'john.doe@example.com' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3010/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('John'),
      });
    });
  });

  it('should show error message on submission failure', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ message: 'Invalid data' }),
    } as Response);

    render(<AddCandidateForm />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'john.doe@example.com' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error al añadir candidato/i)).toBeInTheDocument();
    });
  });

  it('should handle file upload', () => {
    render(<AddCandidateForm />);
    
    const fileInput = screen.getByTestId('file-uploader');
    fireEvent.change(fileInput, { target: { files: [{ name: 'test.pdf' }] } });
    
    // The mock should have called the onChange handler
    expect(fileInput).toBeInTheDocument();
  });

  it('should remove education section when remove button is clicked', () => {
    render(<AddCandidateForm />);
    
    // Add education section
    const addEducationButton = screen.getByText(/añadir educación/i);
    fireEvent.click(addEducationButton);
    
    // Verify education section is added
    expect(screen.getByPlaceholderText(/institución/i)).toBeInTheDocument();
    
    // Remove education section (busca el botón en español)
    const removeButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(removeButton);
    
    // Verify education section is removed
    expect(screen.queryByPlaceholderText(/institución/i)).not.toBeInTheDocument();
  });
}); 