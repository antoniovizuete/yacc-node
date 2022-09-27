# `yacc-node` - Yet Another Clickhouse Client for NodeJS

## Introduction

`yacc-node` is a zero depencies Clickhouse Client written in Typescript.

## Installation

```shell
npm install yacc-node --save

# or

yarn add yacc-node
```

## Getting started

Perform your first query using `yacc-node`:

```typescript
const client = new YacClient("clickhouse://localhost:8123/default");

const result = await client.query<{ a: number }>("SELECT {myParam:UInt8} AS a", { myParam: 1 });

console.log(result); // [{ a: 1 }]
```

```typescript
const client = new YacClient({
  host: "localhost",
  port: 8123,
  protocol: "http",
  database: "default",
});

const resutl = await client.query<{ number: number }>("SELECT * FROM numbers(10)");

console.log(result.length); // 10
```

> ## Working on improve the docs.
