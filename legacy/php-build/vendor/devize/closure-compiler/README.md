# Closure Compiler
## What is the Closure Compiler?
From [Google](https://developers.google.com/closure/compiler/):
> The Closure Compiler is a tool for making JavaScript download and run faster. It is a true compiler for JavaScript. Instead of compiling from a source language to machine code, it compiles from JavaScript to better JavaScript. It parses your JavaScript, analyzes it, removes dead code and rewrites and minimizes what's left. It also checks syntax, variable references, and types, and warns about common JavaScript pitfalls.


## Why does this library exist?
The Closure Compiler (CC), as provided by Google, is available as a web application or for download as a commandline Java jarfile. This file can be used to run your own compilations. However, to use the compiler this way, you must type (or paste) all your javascript filenames into a terminal window, which can be cumbersome and is not easy to automate.

This library provides a PHP wrapper around the CC which can be used in PHP scripts. Using the wrapper, you can connect the configuration of your PHP application to the compiler and automate your compilations. Your compilation build script can then be used in, for instance, a Phing script.

## Installation
Clone this repository and include the classes. Or use Composer:

	"require-dev": {
	    "devize/closure-compiler": "*"
	}

The library uses Composer's autoloader so if your application uses it as well, you don't have to do anything else.

## Usage

Assuming you have managed your own autoloader, set your own includes or are using Composer's autoloader:

	use Devize\ClosureCompiler\ClosureCompiler;
	$compiler = new ClosureCompiler;
	$compiler->setSourceBaseDir('path/to/javascript-files/');
	$compiler->setTargetBaseDir('path/to/javascript-files/');
	$compiler->setSourceFiles(array('one.js', 'two.js', 'three.js'));
	$compiler->addSourceFile('four');
	$compiler->compile();

The `compile()` method uses a system call to execute the Jar-file. By default, the resulting file is called `compiled.js`. You can change this by calling this before you compile:

    $compiler->setTargetFile('somethingElse.js');

When you make a mistake, an exception of the class `Devize\ClosureCompiler\CompilerException` will be thrown.

## License
This library packages the Closure Compiler from Google. The folder `compiler-latest` is the result of unpacking the Google-supplied [Zip file](http://closure-compiler.googlecode.com/files/compiler-latest.zip). Its license is included.

The PHP wrapper files are licensed under the MIT license.

## Feedback
Any feedback is welcome; use the Github system or send a tweet to @breuls.