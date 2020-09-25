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

- Clone the repository.
- Navigate to the directory and install dependencies with `npm install`.
- Now fire in `npm link` which creates a symlink and now `hdg` can be accessed globally.

## Usage

`hdg <command> [options]`

## Generate API Doc

`hdg generate <path>`

`path` - path to `hoppscotch-collection.json` exported from [hoppscotch.io](https://hoppscotch.io/)

## Detailed Instructions

Hopp Doc Gen generates documentation (using Vuepress) based on Hoppscotch collections. 

1. Navigate to https://hoppscotch.io/doc and import a collection you have previously created in Hoppscotch (by clicking on the folder icon next to any collection in the Collections pane.

2. Once you've imported the collection, you'll see some JSON data about the collection, make sure to select all of it and copy it to your clipboard - we're going to be needing it! :wink:


3. Now it's time to generate the documentation! Clone this repository in the terminal.

```
$ git clone https://github.com/hoppscotch/hopp-doc-gen.git
$ cd hopp-doc-gen
```

4. Install all the dependencies.

```
$ npm install
```

5. Run `npm link` so that we can generate our documentation!.

```
$ npm link
```

6. Create a file named `hoppscotch-collection.json` and paste the JSON data that you copied earlier into the file. 

7. Then generate the documentation using the following commands:
```
$ hdg generate hoppscotch-collection.json
```

8. To preview your generated documentation, run 
```
$ npm run docs:dev
```

9. **Deploying to Netlify!!!**

Once you feel like you're ready to publish the documentation, you can deploy it on Netlify.

To deploy your documentation to Netlify, you'll have to build the files first.

```
$ npm run docs:build
```

10. At this point, you need to create a GitHub repo to deploy your documentation on Netlify. So create a GitHub repo and give it an awesome name!

11. Then, push the documentation folder to your GitHub repo. (**Make sure you are inside the `hopp-doc-gen` folder!**)
```
$ git remote add origin https://github.com/USERNAME/NAME_OF_REPO_WHERE_DOCUMENTATION_IS_TO_BE_DEPLOYED
$ git add .
$ git commit -m "generated docs!!!"
$ git push -u origin master
```

12. Once you're logged in at https://netlify.com, create a new site by clicking on `New Site from Git`. Choose your Git provider and then choose your awesome repo where the awesome documentation is located.

13. Under the **Basic Build Settings**, set build command as `npm run docs:build` and set the publish directory as `docs/.vuepress/dist`. 

14. And then click on **Deploy Site**! And *hopefully*, Netlify should build your documentation and make it live! :party:

15. Congratulations, you have successfully deployed your documentation on Netlify!

## Status

Under :construction:
