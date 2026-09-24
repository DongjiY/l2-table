# L2 Table

L2 Table is a canvas-based table for dense, live-updating data. It consumes an RxJS stream of cell updates, renders only the visible cells, and includes horizontal and vertical scrolling, sortable headers, and drag-to-resize columns.

Use it when updates arrive frequently and a DOM cell for every row and column would be unnecessarily expensive.

## Packages

- `@dongjiy/l2-table` — framework-agnostic table, types, render primitives, and utilities.
- `@dongjiy/l2-table-react` — React component.

```sh
npm install @dongjiy/l2-table @dongjiy/l2-table-react rxjs
```

`@dongjiy/l2-table` already declares RxJS as a dependency. Install `rxjs` directly when your application creates the update stream.

## Quick start (React)

The configuration describes a fixed set of rows and columns. An observable delivers updates addressed by `rowId` and `columnId`.

```tsx
import {
  TableData,
  type TableColumnDef,
  type TableConfig,
  type TableRow,
  type TableSourceData,
} from "@dongjiy/l2-table";
import { L2Table } from "@dongjiy/l2-table-react";
import { Subject } from "rxjs";

class NumberData extends TableData<number> {
  constructor() {
    super(undefined, "—");
  }

  compare(a: number, b: number): -1 | 0 | 1 {
    return a === b ? 0 : a < b ? -1 : 1;
  }

  toString(value: number): string {
    return value.toFixed(2);
  }
}

type QuoteRow = TableRow<{ price: number }>;

const rows: QuoteRow[] = [
  { rowId: "btc", placeholders: { price: 0 } },
  { rowId: "eth", placeholders: { price: 0 } },
];

const columns: TableColumnDef<QuoteRow, number>[] = [
  {
    columnId: "price",
    name: "Price",
    hidden: false,
    autoResize: false,
    minWidth: 100,
    maxWidth: 180,
    placeholderAccessorFn: (row) => row.placeholders.price,
    cellData: () => new NumberData(),
  },
];

const config: TableConfig<QuoteRow> = {
  columns,
  rows,
  style: {
    header: { row: { height: 32 } },
    body: { row: { height: 28 } },
  },
};

const updates = new Subject<TableSourceData>();

export function QuoteTable() {
  return <L2Table config={config} source={updates} width={480} height={320} />;
}

// From a feed callback:
updates.next({ rowId: "btc", columnId: "price", data: 67234.5 });
```

Keep `config` and `source` stable. Creating either inline during a React render recreates the table and resubscribes to the stream. Define them outside the component when they do not depend on props, or memoize them when they do.

## Data model

`TableConfig` contains the table's row definitions, column definitions, and styles.

```ts
type TableConfig<TDataRow extends TableRow> = {
  columns: Array<TableColumnDef<TDataRow>>;
  rows: Array<TDataRow>;
  style: TableStyles;
};
```

Each row needs a unique `rowId`. Its `placeholders` supply the initial value for every column, and are used again when sorting before a live update has arrived.

```ts
type TableRow<TPlaceholders extends Record<string, unknown> = {}> = {
  rowId: string;
  placeholders: TPlaceholders;
};
```

Each column needs a unique `columnId`. It maps a row to its initial value and provides a fresh `TableData` instance for each cell.

```ts
type TableColumnDef<TDataRow extends TableRow, TValue = unknown> = {
  columnId: string;
  name: string;
  hidden: boolean;
  autoResize: boolean;
  minWidth?: number;
  maxWidth?: number;
  placeholderAccessorFn: (row: TDataRow) => TValue;
  cellData: () => TableData<TValue>;
  renderCell?: RenderCellFactory;
};
```

`minWidth` and `maxWidth` constrain the initial and measured column width. The current API requires `hidden` and `autoResize`; they are retained in the definition but do not currently alter rendering or sizing behavior.

## Live updates

The source is an `Observable<TableSourceData>`:

```ts
type TableSourceData = {
  rowId: string;
  columnId: string;
  data: unknown;
};
```

Emit one object per changed cell. Its IDs should identify a configured row and column; an unknown column causes an error, and an unknown row has no visible cell. Updates replace the cell's value and redraw the table. If that column is currently sorted, the row is resorted immediately.

`TableData` owns formatting and ordering for a column's values:

```ts
abstract class TableData<T> {
  constructor(value: T | undefined, placeholder?: string);
  setValue(value: T): void;
  getValue(): T | undefined;
  abstract compare(a: T, b: T): -1 | 0 | 1;
  abstract toString(value: T): string;
}
```

`toString` determines what the default cell displays. `compare` drives header sorting, so use a numeric comparison for numeric data rather than comparing formatted strings.

## Interaction and sizing

- Scroll with the mouse wheel or trackpad; both axes are supported.
- Click a header to cycle ascending, descending, then unsorted order.
- Drag a header's right-edge handle to set a manual column width.
- Columns grow to fit rendered content until they are manually resized, subject to `minWidth` and `maxWidth`.

Give the root a real size. The React component's optional `width` and `height` set its inline size; omitting them is fine when its parent supplies a resolvable size. The table observes its container and redraws when it changes size.

## Styling

Body and header styles are configured independently. Canvas font values use normal CSS font syntax.

```ts
const style = {
  header: {
    row: { height: 36 },
    cell: {
      backgroundColor: "#0f172a",
      text: { font: "600 13px system-ui", color: "#f8fafc", alignment: "left" },
      padding: { left: 12, right: 12 },
    },
    resizer: { width: 6, color: "#64748b" },
  },
  body: {
    row: { height: 32 },
    cell: {
      backgroundColor: "#ffffff",
      text: { font: "13px system-ui", color: "#0f172a", alignment: "right" },
      padding: { left: 12, right: 12 },
      hovered: { backgroundColor: "#f1f5f9" },
    },
  },
};
```

`alignment` accepts `"left"`, `"middle"`, or `"right"`. Background color, text settings, padding, and body-row hover color are optional.

## Custom cells

For rendering beyond formatted text, extend `TableCell` and attach a factory with `renderCell`. `drawGlobal` renders the whole cell; `drawClipped` renders inside the padded, clipped area. Return the width used by your drawing so L2 Table can measure the column.

```ts
import {
  Dimensions,
  Painter,
  Point,
  TableCell,
  type Padding,
  type TableCellStyles,
} from "@dongjiy/l2-table";

class StatusCell extends TableCell {
  drawGlobal(painter: Painter): number {
    painter.drawRect(this.point, this.dimensions, "#ecfeff");
    return 0;
  }

  drawClipped(
    painter: Painter,
    dimensions: Dimensions,
    padding: Required<Padding>
  ): number {
    painter.drawRect(
      Point.at(this.point.x + padding.left, this.point.y + padding.top),
      new Dimensions(8, 8),
      "#06b6d4"
    );
    return 8;
  }
}

const statusColumn = {
  // Other TableColumnDef fields...
  renderCell: (style: TableCellStyles | undefined) => new StatusCell(style),
};
```

## Framework-agnostic usage

Create a table directly when you are not using React. `createTable` appends the table to the supplied element. Call both cleanup methods when the host is removed.

```ts
import { createTable } from "@dongjiy/l2-table";

const table = createTable(rootElement, { config, source: updates });

// Later:
table.close();
table.unmount();
```

In React, `L2Table` performs this setup and cleanup automatically.

## Contribution

### Getting Started

Install dependencies by running

```sh
pnpm install
```

From the root directory.

Source code is located in the `packages` subdirectory. After making changes, you can run

```sh
pnpm run build
```

to rebuild all packages.

To run the sample vite app, navigate to `sample/vite` and run

```sh
pnpm run dev
```

### PR Rules

Before opening a PR you must create a new changeset. Run the following command and follow the interactive prompts

```sh
pnpm changeset
```

PRs should be opened using the following format:
`<github-username>/<feature-name>`
Without whitespace and hyphenated. For example,
dongjiy/cell-pool-poc.
