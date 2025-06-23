// FileUploader.test.js
// Tests for FileUploader component

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import FileUploader from '../components/FileUploader';

describe('FileUploader', () => {
  it('should call onChange when a file is selected', () => {
    const handleChange = jest.fn();
    render(<FileUploader onChange={handleChange} onUpload={jest.fn()} />);
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/file/i);
    fireEvent.change(input, { target: { files: [file] } });
    expect(handleChange).toHaveBeenCalledWith(file);
  });

  it('should call fetch and onUpload when upload is triggered', async () => {
    const handleUpload = jest.fn();
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ filePath: 'test.txt' }) }));
    render(<FileUploader onChange={jest.fn()} onUpload={handleUpload} />);
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/file/i);
    fireEvent.change(input, { target: { files: [file] } });
    const button = screen.getByRole('button', { name: /subir archivo/i });
    fireEvent.click(button);
    await waitFor(() => expect(handleUpload).toHaveBeenCalledWith({ filePath: 'test.txt' }));
    global.fetch.mockRestore();
  });

  it('should show loading spinner during upload', async () => {
    global.fetch = jest.fn(() => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({}) }), 100)));
    render(<FileUploader onChange={jest.fn()} onUpload={jest.fn()} />);
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/file/i);
    fireEvent.change(input, { target: { files: [file] } });
    const button = screen.getByRole('button', { name: /subir archivo/i });
    fireEvent.click(button);
    expect(screen.getByRole('status')).toBeInTheDocument();
    global.fetch.mockRestore();
  });

  it('should handle upload errors', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
    render(<FileUploader onChange={jest.fn()} onUpload={jest.fn()} />);
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/file/i);
    fireEvent.change(input, { target: { files: [file] } });
    const button = screen.getByRole('button', { name: /subir archivo/i });
    fireEvent.click(button);
    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    global.fetch.mockRestore();
    consoleError.mockRestore();
  });
});
