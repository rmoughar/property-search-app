import {render, screen, cleanup, fireEvent} from "@testing-library/react"
import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import Pagination from "../src/components/Pagination";

// Create vitest mock fetch
const mockChangePage = vi.fn();

describe("pagination", () => {
    beforeEach(() => {
        mockChangePage.mockReset();
    })
    
    afterEach(() => {
        cleanup();
    })
    test("renders pagination controls + shows one elipses near the beggining", () => {
        
        render(
            <Pagination
            currentPage={1}
            totalPages={10}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )

        expect(screen.getByText("<")).toBeInTheDocument();
        expect(screen.getByText(">")).toBeInTheDocument();

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();

        expect(screen.getByText("10")).toBeInTheDocument();

        expect(screen.getByText("...")).toBeInTheDocument();
    });

    test("shows one elipses near the end", () => {
        
        render(
            <Pagination
            currentPage={29}
            totalPages={30}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )

        expect(screen.getByText("<")).toBeInTheDocument();
        expect(screen.getByText(">")).toBeInTheDocument();
        
        expect(screen.getByText("1")).toBeInTheDocument();
        
        expect(screen.getByText("27")).toBeInTheDocument();
        expect(screen.getByText("28")).toBeInTheDocument();
        expect(screen.getByText("29")).toBeInTheDocument();
        expect(screen.getByText("30")).toBeInTheDocument();

        expect(screen.getByText("...")).toBeInTheDocument();
    });

    test("shows two elipses near the middle", () => {
        
        render(
            <Pagination
            currentPage={10}
            totalPages={50}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )

        expect(screen.getByText("<")).toBeInTheDocument();
        expect(screen.getByText(">")).toBeInTheDocument();
        
        expect(screen.getByText("1")).toBeInTheDocument();

        expect(screen.getByText("9")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("11")).toBeInTheDocument();
        
        expect(screen.getAllByText("...")).toHaveLength(2);

        expect(screen.getByText("50")).toBeInTheDocument();

    });

    test("doesn't duplicate last page number", () => {
        
        render(
            <Pagination
            currentPage={48}
            totalPages={50}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )

        expect(screen.getAllByText("50")).toHaveLength(1);

    });

    test("doesn't duplicate first page number", () => {
        
        render(
            <Pagination
            currentPage={2}
            totalPages={50}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )

        expect(screen.getAllByText("1")).toHaveLength(1);

    });

    test("previous disapled on page 1", () => {
        
        render(
            <Pagination
            currentPage={1}
            totalPages={50}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )
        const button = screen.getByText('<');
        expect(button).toBeDisabled();

    });

    test("next disapled on last page", () => {
        
        render(
            <Pagination
            currentPage={50}
            totalPages={50}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )
        const button = screen.getByText('>');
        expect(button).toBeDisabled();

    });

    test("clicking number calls change page", () => {
        
        render(
            <Pagination
            currentPage={2}
            totalPages={50}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )
        
        fireEvent.click(screen.getByText("5"));
        expect(mockChangePage).toHaveBeenCalledWith(5);

    });

    test("clicking pevious calls currentpage - 1", () => {
        
        render(
            <Pagination
            currentPage={2}
            totalPages={50}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )
        
        fireEvent.click(screen.getByText("<"));
        expect(mockChangePage).toHaveBeenCalledWith(1);

    });

    test("clicking next calls currentpage + 1", () => {
        
        render(
            <Pagination
            currentPage={2}
            totalPages={50}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )
        
        fireEvent.click(screen.getByText(">"));
        expect(mockChangePage).toHaveBeenCalledWith(3);

    });

    test('ellipses to input calls changepage properly', () => {

        render(
            <Pagination
            currentPage={2}
            totalPages={50}
            changeCurrentPage={mockChangePage}>
            </Pagination>
        )

        fireEvent.click(screen.getByText('...'));

        const input = screen.getByRole('textbox');

        fireEvent.change(input, {
            target: {value: '15'},
        });

        const form = input.closest("form");
        fireEvent.submit(form);
        expect(input).toHaveValue('15');
        expect(mockChangePage).toHaveBeenCalledWith(15);


    })
});