# NgFirestarter

This project is a simple Angular application that uses Firebase for authentication, Firestore for a database, and Storage for file uploads. It is a starting point for building a web app that needs to authenticate users and store data. It is barebones and unstyled by default and on purpose.

## Getting Started

1. Clone the repo
2. Run `npm install` to install the dependencies
3. Copy the `.env.example` file to `.env.ts` and populate the values to match your Firebase project
4. Update `.firebaserc` to match your project
5. Run `ng serve` to start the development server

## Firebase

This project uses Firebase for authentication, Firestore for a database, and Storage for file uploads. If you don't have a Firebase project, you can create one at [Firebase Console](https://console.firebase.google.com/).

Make sure to deploy the firestore and storage rules before starting the app. The easiest way to do this is to use firebase-tools CLI.

Install firebase-tools if you haven't already:

```bash
npm install -g firebase-tools
```

Then deploy the firestore and storage rules:

```bash
firebase deploy --only firestore,storage
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
