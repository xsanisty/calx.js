<?php
/**
 * PHP-wrapper to create an interface between Google's Closure Compiler and your PHP scripts
 *
 * Usage: set basedirs for your files, set names for the source files and resulting target file, and compile.
 *
 *      $compiler = new ClosureCompiler;
 *      $compiler->setSourceBaseDir('path/to/javascript-src/');
 *      $compiler->setTargetBaseDir('path/to/javascript/');
 *
 *      $compiler->addSourceFile('functions.js');
 *      $compiler->addSourceFile('library.js');
 *
 *          to add multiple files:
 *
 *      $compiler->setSourceFiles(array('one.js', 'two.js', 'three.js'));
 *
 *
 *      $compiler->setTargetFile('minified.js');
 *      $compiler->compile();
 *
 * @package Devize\ClosureCompiler
 * @author  Peter Breuls <breuls@devize.nl>
 * @license MIT
 * @link    https://github.com/devize/closure-compiler
 */

namespace Devize\ClosureCompiler;

/**
 * Main interface for Closure Compiler
 *
 * @package Devize\ClosureCompiler
 * @author  Peter Breuls <breuls@devize.nl>
 * @license MIT
 * @link    https://github.com/devize/closure-compiler
 */
class ClosureCompiler
{
    protected $java;
    protected $compilerJar = 'compiler-latest/compiler.jar';

    protected $config = array(
        'sourceBaseDir' => '',
        'targetBaseDir' => '',
        'sourceFileNames' => array(),
        'targetFileName' => 'compiled.js',
    );

    /**
     * Constructor; sets the path to the compiler binary
     */
    public function __construct()
    {
        $this->compilerJar = realpath(__DIR__ . '/../../' . $this->compilerJar);
    }

    /**
     * Retrieve the CLI function call to the compiler binary
     *
     * @return string
     */
    public function getBinary()
    {
        if (!$this->java) {
            $this->java = rtrim(shell_exec('which java'));
            if (!$this->java) {
                throw new \RuntimeException('java could not be found in PATH.');
            }
        }

        return "{$this->java} -jar {$this->compilerJar}";
    }

    /**
     * Returns the config array
     *
     * @return array
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Set the path to serve as basedir for the source javascript files
     *
     * @param string $path
     *
     * @return null
     * @throws CompilerException
     */
    public function setSourceBaseDir($path = '')
    {
        if (file_exists($path)) {
            $this->config['sourceBaseDir'] = rtrim($path, '/') . '/';
        } elseif (empty($path)) {
            $this->config['sourceBaseDir'] = '';
        } else {
            throw new CompilerException("The path '{$path}' does not seem to exist.");
        }
    }

    /**
     * Set the path to serve as basedir for the compiled javascript file
     *
     * @param string $path
     *
     * @return null
     * @throws CompilerException
     */
    public function setTargetBaseDir($path = '')
    {
        if (file_exists($path)) {
            $this->config['targetBaseDir'] = rtrim($path, '/') . '/';
        } elseif (empty($path)) {
            $this->config['targetBaseDir'] = '';
        } else {
            throw new CompilerException("The path '{$path}' does not seem to exist.");
        }
    }

    /**
     * Delete all entries from the list of source files
     */
    public function clearSourceFiles()
    {
        $this->config['sourceFileNames'] = array();
    }

    /**
     * Add an entry to the list of source files
     *
     * @param string $file
     *
     * @return null
     * @throws CompilerException
     */
    public function addSourceFile($file)
    {
        $path = $this->config['sourceBaseDir'] . $file;
        if (in_array($path, $this->config['sourceFileNames'])) {
            return;
        }
        if (file_exists($path)) {
            $this->config['sourceFileNames'][] = $path;
        } else {
            throw new CompilerException("The path '{$path}' does not seem to exist.");
        }
    }

    /**
     * Set the list of source files
     *
     * @param array $files
     * @param boolean $reset
     *
     * @return null
     */
    public function setSourceFiles(array $files, $reset = true)
    {
        if ($reset === true) {
            $this->clearSourceFiles();
        }
        foreach ($files as $file) {
            $this->addSourceFile($file);
        }
    }

    /**
     * Remove a specific file from the list of source files
     *
     * @param string $file
     *
     * @return null
     */
    public function removeSourceFile($file)
    {
        $path = $this->config['sourceBaseDir'] . $file;
        $index = array_search($path, $this->config['sourceFileNames']);
        if ($index !== false) {
            unset($this->config['sourceFileNames'][$index]);
        }
    }

    /**
     * Set the name of the resulting compiled javascript file
     *
     * @param string $file
     *
     * @throws CompilerException
     */
    public function setTargetFile($file)
    {
        $path = $this->config['targetBaseDir'] . $file;
        $this->config['targetFileName'] = $path;
    }

    /**
     * Performs the compilation by calling the compiler.jar
     *
     * @return int
     * @throws CompilerException
     */
    public function compile()
    {
        # check for possible overwrite of source files
        if (in_array($this->config['targetFileName'], $this->config['sourceFileNames'])) {
            throw new CompilerException("The target file '{$this->config['targetFileName']}' is one of the source files. A compile would cause undesired effects.");
        }

        # check for path
        if (basename($this->config['targetFileName']) === $this->config['targetFileName'] and !empty($this->config['targetBaseDir'])) {
            $this->config['targetFileName'] = $this->config['targetBaseDir'] . $this->config['targetFileName'];
        }

        $command = $this->getBinary();
        foreach ($this->config['sourceFileNames'] as $file) {
            $command .= " --js={$file}";
        }

        $command .= " --js_output_file={$this->config['targetFileName']} 2>&1";

        $return = '';
        $output = array();
        exec($command, $output, $return);
        return $return;
    }
}

