import { SortFilterItem } from "@/types";

export const sortingProductsItem = [
  {
    title: "Date: Oldest to Newest",
    sortKey: "createdAt",
    reverse: false,
  },
  {
    title: "Date: Newest to Oldest",
    sortKey: "createdAt",
    reverse: true,
  },
  {
    title: "Price: Low to High",
    sortKey: "price",
    reverse: false, // ASC
  },
  {
    title: "Price: High to Low",
    sortKey: "price",
    reverse: true,
  },
  {
    title: "Alphabetical: A - Z",
    sortKey: "name",
    reverse: false, // ASC
  },
  {
    title: "Alphabetical: Z - A",
    sortKey: "name",
    reverse: true,
  },
] satisfies SortFilterItem[];

export const productCategories = [
  { title: "Clothing", value: "clothing" },
  { title: "Backpack", value: "backpack" },
  { title: "Shoes", value: "shoes" },
];

export const rowsPerPage = [
  { title: "10", value: "10" },
  { title: "20", value: "20" },
  { title: "30", value: "30" },
  { title: "40", value: "40" },
  { title: "50", value: "50" },
];
