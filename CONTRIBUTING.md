# Code Contributions

Please follow these guidlines before sending your pull request and making contributions.

* When you submit a pull request, you agree that your code is published under the [GNU General Public License](https://www.gnu.org/licenses/gpl.html)
* Do not include non-free software or modules with your code.
* Make sure your pull request is setup to merge your branch to CCA's development branch.
* Make sure your branch is up to date with the development branch before submitting your pull request.
* Stick to a similar style of code already in the project. Please look at current code to get an idea on how to do this.
* Comment your code when necessary.
* Please test your code.  Make sure new features work as well as core features.
* Please limit the amount of Node Modules that you introduce into the project.  Only include them when absolutely necessary for your code to work or if a module provides similar functionality to what you are trying to achieve.

# Setting up Your Environment

Here's how to get your environment setup.  You will need Git and NPM installed on your system.

Clone down the repository:

```
git clone https://github.com/ThePacielloGroup/CCAe.git
```

Install Dependencies:

```
npm install
```

Install Dev Dependencies:

```
npm install --only=dev
```

Run the application:

```
npm run start
```

To build a new version:

```shell
  # Because some libraries need to be compiled natively, you can build only for your current OS.
  # i.e. you can't build a Windows version if you are under MacOS

  # build a MacOS version
  npm run dist

  # build a Windows version
  npm run dist-windows
```

The CHANGELOG.md is generated using Gren
https://github.com/github-tools/github-release-notes

Other commands are available in the `package.json` file.
