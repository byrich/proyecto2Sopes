<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitd0ca98686da17ca9756b4c2ab8035a75
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PhpAmqpLib\\' => 11,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PhpAmqpLib\\' => 
        array (
            0 => __DIR__ . '/..' . '/php-amqplib/php-amqplib/PhpAmqpLib',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitd0ca98686da17ca9756b4c2ab8035a75::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitd0ca98686da17ca9756b4c2ab8035a75::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
