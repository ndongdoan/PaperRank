# Frontend Architecture

The UI for the PaperRank system was developed to visualize the citation network and illustrate calculation steps of the PageRank algorithm.

## Features

- **Interactive Graph Visualization:** Display the citation network as a directed graph, where the node's size represents the final PageRank score, and each edge represents a reference.
- **Advanced Search Options:**
    1. Limit number of papers to search (min: 2, max: 50)
    2. Search by topics/keywords/papers' names/authors
    3. Specify the year range of papers
- **Mathematical Simulation:** Provide a panel to view the underlying matrices directly.

## Tech Stack

- **Language:** Typescript
- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Graph Visualizatioin:** ```d3```

## Folder Structure

```text
frontend
├── public
├── src
│   ├── app
│   ├── components
│   └── lib
├── .env.example
└── *config_files...
```

## Installation and Run

### Installation

You can use ```npm```, ```yarn```, ```pnpm```, or ```bun``` based on your preference. Here, we provide an example of ```npm```:

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

*The website is available at: ```http://localhost:3000```*
