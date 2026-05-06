# L2-Table

L2 table is an HTML-canvas based table framework that focuses on optimizing performance for live-updating tables using RxJS observables.

## Usage

### Overview

L2 table is a table framework backed by HTML canvas. L2 table is fundamentally built on a row definition, column definition, and source observable. The column and row definitions provide column-ids and row-ids which are used to extract data from the source observable. Data emitted in the source observable should be tagged with the corresponding column-id and row-id.

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
A table is driven by a configuration object that provides the blueprint for the columns and rows of the table, and a source observable that acts as a single pipe for data to flow into the table.

#### Table Configuration
A table configuration object contains a column definition, row definition, and styling object.

This is an example of a column definition.
```ts
const columns = [
  {
    columnId: "index",
    name: "index",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.index,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "avg",
    name: "average",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.avg,
    cellData: () => new NumberTableData(),
  }
];
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
