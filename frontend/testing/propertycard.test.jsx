import {render, screen, cleanup, fireEvent } from "@testing-library/react"
import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { MemoryRouter, useLocation } from "react-router";
import { FavoritesContext } from "../src/utils/FavoritesContext";
import PropertyCard from "../src/components/PropertyCard";
import PropertyGrid from "../src/components/PropertyGrid";

vi.mock('../src/components/PropertyImageCarousel', () => ({
    default: ({ images }) => (
        <div data-testid="property-carousel">{images.join(',')}</div>
    )
}))

const mockIsFavorite = vi.fn(() => false);
const mockToggleFavorite = vi.fn();


const property = {
    L_ListingID: 12345,
    L_SystemPrice: 300000,
    L_Keyword2: 3,
    LM_Dec_3: 2,
    LM_Int2_3: 1500,
    L_Address: '1234 Rivercrest Drive',
    L_City: 'Other',
    L_State: 'CA',
    L_Zip: 97303,
    ValidatedPhotos: '[]'
};

function renderPropertyCard(propertyToRender = property){
    return render(
        <MemoryRouter>
            <FavoritesContext.Provider
            value={{
                isFavorite: mockIsFavorite,
                toggleFavorite: mockToggleFavorite
            }}>
                <PropertyCard property={propertyToRender} />
            </FavoritesContext.Provider>
        </MemoryRouter>
    )
}

function CurrentLocation(){
    const location = useLocation();

    return (<div data-testid="location">{location.pathname}</div>);
}

describe("property-card", () => {
    beforeEach(() => {
        mockIsFavorite.mockReset();
        mockToggleFavorite.mockReset();
    })
    
    afterEach(() => {
        cleanup();
    })

    test('renders property data', () => {
        renderPropertyCard();

        expect(screen.getByText('$300,000')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('1,500')).toBeInTheDocument();
        expect(screen.getByText('1234 Rivercrest Drive,')).toBeInTheDocument();
        expect(screen.getByText('Other, CA, 97303')).toBeInTheDocument();
    });

    test('handles invalid photo JSON', () => {
        const invalidProperty = {...property, ValidatedPhotos: 'bad json'};
        renderPropertyCard(invalidProperty);
        expect(screen.getByTestId('property-carousel')).toBeInTheDocument();
    })

    test('clicking card navigates to detail page', () => {
        render(
            <MemoryRouter>
                <FavoritesContext.Provider
                    value={{
                        isFavorite: mockIsFavorite,
                        toggleFavorite: mockToggleFavorite
                    }}
                >
                    <PropertyGrid properties={[property]} />
                    <CurrentLocation />
                </FavoritesContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByTestId('location')).toHaveTextContent('/');
        fireEvent.click(screen.getByText('$300,000'));
        expect(screen.getByTestId('location')).toHaveTextContent('/property/12345');
    });

    test('uses L_Photos when ValidatedDPhotos is unavailable', () => {
        const propertyWithoutValidatedPhotos = {
            ...property, ValidatedPhotos: '', L_Photos: '["photo1.jpg", "photo2.jpg"]'
        };

        renderPropertyCard(propertyWithoutValidatedPhotos);
        expect(screen.getByTestId('property-carousel')).toHaveTextContent('photo1.jpg,photo2.jpg');
    })

    test('clicking favorite button toggles favorite', () => {
        renderPropertyCard();

        fireEvent.click(screen.getByRole('button'));
        expect(mockToggleFavorite).toHaveBeenCalledWith(12345);
    })



    
});