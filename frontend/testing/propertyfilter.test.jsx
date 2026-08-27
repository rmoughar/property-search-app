 import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
 import {fireEvent, render, screen, cleanup} from '@testing-library/react'
import PropertyFilters from '../src/components/PropertyFilters';

// Create mock functions;
const mockSetFilter = vi.fn();
const mockSearch = vi.fn();

describe("propertyFilter", () => {
    beforeEach(() => {
        mockSetFilter.mockReset();
        mockSearch.mockReset();
    });

    afterEach(() => {
        cleanup();
    })

    test("returns property data when the request succeeds", () => {
        const filters = {city: '', zipcode: '', minPrice: '', maxPrice: '', beds: '', baths: ''};

        render(<PropertyFilters filters={filters} onSearch={mockSearch}/>);

        expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("ZIP Code")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Min Price")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Max Price")).toBeInTheDocument();
        expect(screen.getByLabelText("Beds:")).toBeInTheDocument();
        expect(screen.getByLabelText("Baths:")).toBeInTheDocument();
    });

    test("search updates filters object", () => {
        const filters = {city: '', 
            zipcode: '', 
            minPrice: '', 
            maxPrice: '', 
            beds: '', 
            baths: ''};

        render(<PropertyFilters filters={filters} 
            onSearch={mockSearch}/>);

        const input = screen.getByPlaceholderText('City');
        fireEvent.change(input, {
            target: {value: 'Escondido'},
        });
        fireEvent.click(screen.getByText("Search"));

        expect(mockSearch).toHaveBeenCalledTimes(1);
        expect(input.value).toBe('Escondido');
        expect(mockSearch).toHaveBeenCalledWith({
            city: 'Escondido',
            zipcode: '',
            minPrice: '',
            maxPrice: '',
            beds: '',
            baths: ''
        })
    });

    test("clear button calls search with empty filters", () => {
        const filters = {city: 'Escondido', 
            zipcode: '92025', 
            minPrice: '100000', 
            maxPrice: '500000', 
            beds: '3', 
            baths: '2'};

        render(<PropertyFilters filters={filters} 
            onSearch={mockSearch}/>);

        fireEvent.click(screen.getByText("Clear"))

        expect(mockSearch).toHaveBeenCalledWith({
            city: '',
            zipcode: '',
            minPrice: '',
            maxPrice: '',
            beds: '',
            baths: ''
        });

        expect(mockSearch).toHaveBeenCalledTimes(1);
    });
});