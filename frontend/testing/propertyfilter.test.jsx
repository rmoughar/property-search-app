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

    test("renders all filter inputs", () => {
        const filters = {city: '', zipcode: '', minPrice: '', maxPrice: '', beds: '', baths: ''};

        render(<PropertyFilters filters={filters} onSearch={mockSearch}/>);

        expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("ZIP Code")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Min Price")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Max Price")).toBeInTheDocument();
        expect(screen.getByLabelText("Beds:")).toBeInTheDocument();
        expect(screen.getByLabelText("Baths:")).toBeInTheDocument();
    });

    test("calls onSearch with entered filters", () => {
        const filters = {
            city: '', 
            zipcode: '', 
            minPrice: '', 
            maxPrice: '', 
            beds: '', 
            baths: ''
        };

        render(
            <PropertyFilters 
                filters={filters} 
                onSearch={mockSearch}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('City'), {
            target: {value: 'Escondido'},
        });

        fireEvent.change(screen.getByPlaceholderText('ZIP Code'), {
            target: {value: '92025'},
        });

        fireEvent.change(screen.getByPlaceholderText('Min Price'), {
            target: {value: '100000'},
        });

        fireEvent.change(screen.getByPlaceholderText('Max Price'), {
            target: {value: '500,000'},
        });

        fireEvent.change(screen.getByLabelText('Beds:'), {
            target: {value: '3'},
        });

        fireEvent.change(screen.getByLabelText('Baths:'), {
            target: {value: '2'},
        });

        fireEvent.click(screen.getByText("Search"));

        expect(mockSearch).toHaveBeenCalledTimes(1);
        expect(mockSearch).toHaveBeenCalledWith({
            city: 'Escondido',
            zipcode: '92025',
            minPrice: 100000,
            maxPrice: 500000,
            beds: 3,
            baths: 2
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


        expect(screen.getByPlaceholderText("City")).toHaveValue('');
        expect(screen.getByPlaceholderText("ZIP Code")).toHaveValue('');
        expect(screen.getByPlaceholderText("Min Price")).toHaveValue('');
        expect(screen.getByPlaceholderText("Max Price")).toHaveValue('');
        expect(screen.getByLabelText("Beds:")).toHaveValue('');
        expect(screen.getByLabelText("Baths:")).toHaveValue('');
        
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