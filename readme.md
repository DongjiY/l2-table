# L2-Table

L2 table is an HTML-canvas based table framework that focuses on optimizing performance for live-updating tables using RxJS observables.

## Usage

### Overview

L2 table is a table framework backed by HTML canvas. L2 table is fundamentally built on a collection of row configurations, column configurations, and source observable. The column and row configurations provide column-ids and row-ids which are used to extract data from the source observable. Data emitted in the source observable should be tagged with the corresponding column-id and row-id.

### Installation

The core table library can be installed via npm using the following command

```sh
npm install l2-table
```

To install the react-specific table library you can run the following command

```sh
npm install @l2-table/react
```

The docs will focus on table usage in react moving forward. For details on the core library, visit LINK_HERE.

### Creating a Table
A table is driven by a configuration object, hereafter referred to as a table configuration, which provides the blueprint for the table’s columns and rows, along with a source observable that serves as a single pipeline for data to flow into the table.

#### Column Configuration
The table config contains a collection of column configurations. Each column configuration is a declarative description of how to extract and render data for a column.

```ts
const columns = [
  {
    columnId: "price",
    name: "Live Price",
    hidden: false,
    autoResize: false,
    minWidth: 20;
    maxWidth: 100;
    placeholderAccessorFn: (row) => row.placeholders.index,
    cellData: () => new MoneyTableData(),
    renderCell: (styles) => new CryptoIconCell(styles),
  },
];
```
The details for each of the options are as follows

```ts
type TableColumnDef<TDataRow extends TableRow, TValue = unknown> = {
  columnId: string; // Unique identifier for the column
  name: string; // Display name in the header
  hidden?: boolean; // Whether the column is visible
  autoResize?: boolean; // Whether width adjusts to content
  minWidth?: number; // Min width for the column
  maxWidth?: number; // Max width for the column
  placeholderAccessorFn: (row: TDataRow) => TValue; // Extracts placeholder data from the row configuration
  cellData: () => TableData<TValue>; // A type wrapper around your underlying cell type
  renderCell?: () => TableCell; // Custom cell rendering. Used when the base cell class does not fulfill your needs
};
```

#### Row Configuration
The table config also contains a collection of row configurations. Each row configuration is an object that contains the row's id and a placeholder value.

```ts
const rows = [
    {
        rowId: "BTC",
        placeholders: {
            price: Money.from("14.55") 
        },
    },
    {
        rowId: "WETH",
        placeholders: {
            price: Money.from("22.93")
        }
    }
]
```
The details for each of the options are as follows
```ts
type TableRow<TPlaceholders extends Record<string, unknown> = {}> = {
  rowId: string; // Unique identifier for the column
  placeholders: TPlaceholders; // A record of this row's placeholder values for each column
};
```

#### Table Styling
The table style object can be provided to give custom styling to certain components of the table, such as cell fonts, background colors, and padding. 
```ts
type TableStyles = {
  body: {
    cell?: TableCellStyles;
    row: {
      height: number;  // Provide a height for your table body rows
    };
  };
  header: {
    cell?: TableCellStyles;
    row: {
      height: number;  // Provide a height for your table header row
    };
  };
};

type TableCellStyles = {
  text?: {
    alignment?: "left" | "middle" | "right";
    font?: string;
    color?: string;
  },
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hovered?: {
    backgroundColor?: string;
  };
};
```
For table body cells, you can gain complete control over the rendered contents by extending a `TableCell` class and implementing the draw methods. For more information visit SECTION.

#### Table Configuration
With all of the subcomponents of the table now introduced, we can create a table configuration object as follows: 
```ts
type TableConfig<TDataRow extends TableRow> = {
  columns: Array<TableColumnDef<TDataRow>>;
  rows: Array<TDataRow>;
  style: TableStyles;
};
```

#### Table Creation
Tables can be created using the `L2Table` react component. The component takes the following props:

| Prop Name | Type | Required |
| ---: | ---: | ---: |
| config | TableConfig | yes |
| source | TableSource | yes |
| width | number | no |
| height | number | no |

The config and source object should be stable references. Do not provide inline instances of these objects. Instead, wrap them in a use memo or define them in a separate module.
```ts
function MyComponent(): ReactNode {
    return <L2Table config={CONFIG} source={SOURCE} width={300} height={400} />
}
```

## Contribution

### Getting Started

Source code is located in the `packages` subdirectory. After making changes, you can run

```sh
npm run build
```

to rebuild all packages.

To run the sample vite app, navigate to `sample/vite` and run

```sh
npm run dev
```

### PR Rules

PRs should be opened using the following format:
`<github-username>/<feature-name>`
Without whitespace and hyphenated. For example,
dongjiy/cell-pool-poc.
