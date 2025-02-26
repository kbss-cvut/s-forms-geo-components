# SForms Geo Components
[![Netlify Status](https://api.netlify.com/api/v1/badges/5f647e92-3dc1-465e-b1b2-0508d52ff03d/deploy-status)](https://app.netlify.com/sites/s-forms-geo-components/deploys)


This library is an extension of [SForms](https://github.com/kbss-cvut/s-forms) - a semantic form generator and processor for ontology-based smart forms.
SForms geo components are displayed based on structure of provided semantic form data and extend basic functionality of SForms.

## Live Demo

Checkout [live demo using storybook](https://s-forms-geo-components.netlify.app).


## Development

Packiging SForms geo components library for usage in other projects is done by `npm run build:lib`.

### Debugging a form & components with StorybookJS

Storybook is an open source tool for building UI components and pages in isolation. Rendering of a form or a specific component can be tested through a story provided in `./src/stories/`. The application can be started by executing npm script through `npm run dev` and then accessing `loaclhost:6006` from a browser. It renders the forms provided by the file `./src/stories/assets/`.
