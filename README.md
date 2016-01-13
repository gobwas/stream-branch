#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Node Stream multiplexing tool

## Whatsup

This is a simple stream wrapper, that allows you to do the same things as [multistream](https://github.com/feross/multistream) and others, but with ability to write in combined stream:

```
          source
            |   
        transform
            |
           / \
          /   \
         /     \
transfrom1 ... transformN
         \     /
          \   /
           \ /
            |
        transform
            |
          result
```

## Example

```js
var branch = require("stream-branch");

// for example, browserify.bundle()
getSomeReadableStream()
	.pipe(makeCommonThings())
	.pipe(branch({ objectMode: true },
	    [
	    	// here list of transform streams
	        makeSomeTask(),
	        makeAnotherTask()
	    ]
	))
	.pipe(gulp.dest("./dist"))
	.pipe(uglify())
	.pipe(rename({ extname: ".min.js" }))
	.pipe(gulp.dest("./dist"));
```


## Install

```sh
$ npm install --save stream-branch
```

## API

### streamBranch(param: List[Stream]) : stream.Duplex


## License

MIT © [Sergey Kamardin](https://github.com/gobwas)


[npm-image]: https://badge.fury.io/js/stream-branch.svg
[npm-url]: https://npmjs.org/package/stream-branch
[travis-image]: https://travis-ci.org/gobwas/stream-branch.svg?branch=master
[travis-url]: https://travis-ci.org/gobwas/stream-branch
[daviddm-image]: https://david-dm.org/gobwas/stream-branch.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/gobwas/stream-branch