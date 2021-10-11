<div align="center">
  <a href="https://hoppscotch.io"><img src="https://hoppscotch.io/icon.png" alt="Hoppscotch" height="128"></a>
  <br>
  <h1>Hopp Doc Gen</h1>
  <p>
    An API documentation generator CLI by https://hoppscotch.io
  </p>
</div>

---

## Installation

```bash
$ npm install -g hdg
```

Or, with `npx`

```bash
$ npx hdg generate <path>
```

## Usage

```bash
Usage: hdg <command> [options]

An API documentation generator CLI

Options:
  -V, --version              output the version number
  -h, --help                 display help for command

Commands:
  generate [options] <path>  Generate API Documentation
  help [command]             display help for command
```

## Generate API Doc

```bash
Usage: hdg generate [options] <path>

Generate API Documentation

Options:
  -s, --skip-install        skip installation of vuepress and just create the markdown file
  -o, --output-path <path>  specify an output path (default: "docs")
  -r, --request-buttons     add a request button for each GET request
  -h, --help                display help for command
  -u, --update <path>            Update de documentation markdown file
  -n, --no-install               Skip npm install and create only the markdown file
  -r, --request-buttons          Add a request button for each request
```

`path` - path to `hoppscotch-collection.json` exported from [hoppscotch.io](https://hoppscotch.io/)

## Contributing Guidelines

- Clone the repository.
- Navigate to the directory and install dependencies with `npm install`.
- Now fire in `npm link` which creates a symlink and now `hdg` can be accessed globally.

## Instructions

_Hopp Doc Gen generates documentation (using Vuepress) based on Hoppscotch collections._

**1.** Navigate to https://hoppscotch.io/doc and export a collection. (by clicking on the `Import/Export` button in the Collections pane).

**2.** Then generate documentation using the following command:

```
$ npx hdg generate hoppscotch-collection.json
```

**3.** To preview your generated documentation, run

```
$ npm run docs:dev
```

**4.** **Deploying to Netlify!!!**

Once you feel like you're ready to publish the documentation, you can deploy it on Netlify.

To deploy your documentation to Netlify, you'll have to build the files first.

```
$ npm run docs:build
```

**5.** At this point, you need to create a GitHub repo to deploy your documentation on Netlify. So create a GitHub repo and give it an awesome name!

**6.** Then, push the documentation folder to your GitHub repo.

```
$ git remote add origin https://github.com/USERNAME/NAME_OF_REPO_WHERE_DOCUMENTATION_IS_TO_BE_DEPLOYED
$ git add .
$ git commit -m "generate api doc"
$ git push -u origin master
```

**7.** Once you're logged in at https://netlify.com, create a new site by clicking on `New Site from Git`. Choose your Git provider and then choose your awesome repo where the awesome documentation is located!

**8.** Under the **Basic Build Settings**, set build command as `npm run docs:build` and set the publish directory as `docs/.vuepress/dist`.

**9.** And then click on **Deploy Site**! And _hopefully_, Netlify should build your documentation and make it live! :partying_face:

**10.** Congratulations, you have successfully deployed your documentation on Netlify!
