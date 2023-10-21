# marked-webpack-plugin

A webpack5 plugin for markdown to html

## Usage

add this plugin:

```js
yarn add marked-webpack-plugin -D
```

configure the plugin:

```js
new MarkedWebpackplugin({
  input: path.resolve(__dirname, "./CHANGELOG.md"),
  output: path.resolve(__dirname, "./CHANGELOG.html"),
  title: "change log",
  template: path.resolve(__dirname, "./template.html"),
})
```

## Configuration Settings

| Option | Required | Type | Default | About |
| --- | --- | --- | --- | --- |
| input | yes | string | none | The markdwon file that needs to be converted to html |
| output | yes | string | none | The output html file |
| title | no | string | "change log" | html title |
| template | no | string | "dist/template.html" | Template file |

