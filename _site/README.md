# System Commands Handbook

A 10-Week System Commands Handbook built with Jekyll and GitHub Pages.

## Getting Started

### Prerequisites
- Ruby
- Bundler

### Installation

Install required gems:

```bash
bundle install
```

### Running Locally

Start the local Jekyll development server:

```bash
bundle exec jekyll serve --livereload
```

Once running, view the site in your browser at:
- **[http://localhost:4000/system-commands/](http://localhost:4000/system-commands/)**

> **Note:** If you want to serve at root (`http://localhost:4000/`) without the `/system-commands/` path prefix:
> ```bash
> bundle exec jekyll serve --baseurl "" --livereload
> ```

### Building for Production

To build the static site (output generated in `_site/`):

```bash
bundle exec jekyll build
```