import { SearchParams, SortDirection } from "../search-params"

describe("SearchParams Unit Tests", () => {

  describe('page prop',() => {
    test.each([
      [null, 1],
      [undefined, 1],
      ["", 1],
      ["fake", 1],
      [0, 1],
      [-1, 1],
      [5.5, 1],
      [true, 1],
      [false, 1],
      [{}, 1],
      [1, 1],
      [2, 2],
    ])('page prop: %p should equal %p', (page, expected) => {
      let pageParam: number | undefined;
    
      if (typeof page === 'number') {
        pageParam = page;
      } else {
        pageParam = 1; // Padrão para 1 se o valor não for numérico
      }
    
      const params = new SearchParams({ page: pageParam });
      expect(params.page).toBe(expected);
    });
  })

  describe('perPage prop', () => {
    test.each([
      [null, 15],
      [undefined, 15],
      ["", 15],
      ["fake", 15],
      [0, 15],
      [-1, 15],
      [5.5, 15],
      [true, 15],
      [false, 15],
      [{}, 15],
      [1, 1],
      [2, 2],
      [10, 10],
    ])('perPage prop: %p should equal %p', (perPage, expected) => {
      const params = new SearchParams({ perPage: typeof perPage === 'number' ? perPage : undefined });
      expect(params.perPage).toBe(expected);
    });
  })

  test("sort prop", () => {
    const params = new SearchParams();
    expect(params.sort).toBeNull();

    //TODO refactor to test.each
    const arrange = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: "", expected: null },
      { sort: 0, expected: "0" },
      { sort: -1, expected: "-1" },
      { sort: 5.5, expected: "5.5" },
      { sort: true, expected: "true" },
      { sort: false, expected: "false" },
      { sort: {}, expected: "[object Object]" },
      { sort: "field", expected: "field" },
    ];

    arrange.forEach((i) => {
      expect(new SearchParams({ sort: i.sort as any }).sort).toBe(i.expected);
    });
  });

  test("sortDir prop", () => {
    let params = new SearchParams();
    expect(params.sortDir).toBeNull();

    params = new SearchParams({ sort: null });
    expect(params.sortDir).toBeNull();

    params = new SearchParams({ sort: undefined });
    expect(params.sortDir).toBeNull();

    params = new SearchParams({ sort: "" });
    expect(params.sortDir).toBeNull();

    //TODO refactor to test.each
    const arrange = [
      { sortDir: null, expected: "asc" },
      { sortDir: undefined, expected: "asc" },
      { sortDir: "", expected: "asc" },
      { sortDir: 0, expected: "asc" },
      { sortDir: "fake", expected: "asc" },

      { sortDir: "asc", expected: "asc" },
      { sortDir: "ASC", expected: "asc" },
      { sortDir: "desc", expected: "desc" },
      { sortDir: "DESC", expected: "desc" },
    ];

    arrange.forEach((i) => {
      expect(
        new SearchParams({ sort: "field", sortDir: i.sortDir as any })
          .sortDir
      ).toBe(i.expected);
    });
  });

  describe('filter prop', () => {
    test.each([
      [null, null],
      [undefined, null],
      ["", null],
      [0, "0"],
      [-1, "-1"],
      [5.5, "5.5"],
      [true, "true"],
      [false, "false"],
      [{}, "[object Object]"],
      ["field", "field"],
    ])('filter prop: %p should equal %p', (filter, expected) => {
      const params = new SearchParams({ filter });
      expect(params.filter).toBe(expected);
    });
  })
})