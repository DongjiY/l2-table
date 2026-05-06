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

Tables

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
