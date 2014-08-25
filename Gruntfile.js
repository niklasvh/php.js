module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*\n  <%= pkg.title || pkg.name %> <%= pkg.version %>' +
                '<%= pkg.homepage ? " <" + pkg.homepage + ">\n" : "" %>' +
                '  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
                '\n\n  Released under <%= _.pluck(pkg.licenses, "type").join(", ") %> License\n*/',
            pre: '(function(undefined){',
            post: 'if (typeof exports !== "undefined") {\n  exports.PHP = PHP;\n}\nif (typeof window === "object") {\n  window.PHP = PHP;\n}\n})();'
        },
        concat: {
            dist: {
                src: ['<banner:meta.banner>',
                    "src/core.js",
                    "src/halt.js",
                    "src/compiler/compiler.js",
                    "src/compiler/expr.js",
                    "src/compiler/stmt.js",
                    "src/compiler/scalar.js",
                    "src/modules/init.js",
                    "src/modules/array/array.js",
                    "src/modules/array/array_key_exists.js",
                    "src/modules/array/array_merge.js",
                    "src/modules/array/array_pop.js",
                    "src/modules/array/array_push.js",
                    "src/modules/array/array_search.js",
                    "src/modules/array/array_shift.js",
                    "src/modules/array/array_unshift.js",
                    "src/modules/array/count.js",
                    "src/modules/array/current.js",
                    "src/modules/array/each.js",
                    "src/modules/array/is_array.js",
                    "src/modules/array/key.js",
                    "src/modules/array/list.js",
                    "src/modules/array/next.js",
                    "src/modules/array/reset.js",
                    "src/modules/classes/class_exists.js",
                    "src/modules/classes/get_class.js",
                    "src/modules/classes/get_declared_classes.js",
                    "src/modules/classes/get_class_methods.js",
                    "src/modules/classes/get_parent_class.js",
                    "src/modules/classes/interface_exists.js",
                    "src/modules/classes/is_subclass_of.js",
                    "src/modules/classes/method_exists.js",
                    "src/modules/control_structures/foreach.js",
                    "src/modules/control_structures/include.js",
                    "src/modules/control_structures/include_once.js",
                    "src/modules/control_structures/require.js",
                    "src/modules/control_structures/require_once.js",
                    "src/modules/date/constants.js",
                    "src/modules/date/date_default_timezone_set.js",
                    "src/modules/date/mktime.js",
                    "src/modules/date/time.js",
                    "src/modules/error/constants.js",
                    "src/modules/error/trigger_error.js",
                    "src/modules/filesystem/constants.js",
                    "src/modules/filesystem/dirname.js",
                    "src/modules/filesystem/fclose.js",
                    "src/modules/filesystem/file_get_contents.js",
                    "src/modules/filesystem/fopen.js",
                    "src/modules/filesystem/is_uploaded_file.js",
                    "src/modules/filesystem/realpath.js",
                    "src/modules/filesystem/rename.js",
                    "src/modules/functions/call_user_func.js",
                    "src/modules/functions/call_user_func_array.js",
                    "src/modules/functions/create_function.js",
                    "src/modules/functions/function_exists.js",
                    "src/modules/math/dechex.js",
                    "src/modules/misc/constant.js",
                    "src/modules/misc/define.js",
                    "src/modules/misc/defined.js",
                    "src/modules/misc/eval.js",
                    "src/modules/misc/exit.js",
                    "src/modules/misc/php_egg_logo_guid.js",
                    "src/modules/misc/php_logo_guid.js",
                    "src/modules/misc/php_real_logo_guid.js",
                    "src/modules/misc/zend_logo_guid.js",
                    "src/modules/network/header.js",
                    "src/modules/options/assert.js",
                    "src/modules/options/ini_get.js",
                    "src/modules/options/ini_restore.js",
                    "src/modules/options/ini_set.js",
                    "src/modules/options/getenv.js",
                    "src/modules/options/set_time_limit.js",
                    "src/modules/options/zend_version.js",
                    "src/modules/output/constants.js",
                    "src/modules/output/flush.js",
                    "src/modules/output/ob.js",
                    "src/modules/output/ob_flush.js",
                    "src/modules/output/ob_get_contents.js",
                    "src/modules/output/ob_get_length.js",
                    "src/modules/output/ob_get_level.js",
                    "src/modules/pcre/preg_match.js",
                    "src/modules/string/echo.js",
                    "src/modules/string/explode.js",
                    "src/modules/string/implode.js",
                    "src/modules/string/localeconv.js",
                    "src/modules/string/parse_str.js",
                    "src/modules/string/print.js",
                    "src/modules/string/printf.js",
                    "src/modules/string/setlocale.js",
                    "src/modules/string/sprintf.js",
                    "src/modules/string/str_repeat.js",
                    "src/modules/string/str_replace.js",
                    "src/modules/string/str_rot13.js",
                    "src/modules/string/strlen.js",
                    "src/modules/string/strncmp.js",
                    "src/modules/string/strtolower.js",
                    "src/modules/string/strtoupper.js",
                    "src/modules/string/trim.js",
                    "src/modules/tokenizer/constants.js",
                    "src/modules/tokenizer/token_get_all.js",
                    "src/modules/tokenizer/token_name.js",
                    "src/modules/variable/constants.js",
                    "src/modules/variable/empty.js",
                    "src/modules/variable/gettype.js",
                    "src/modules/variable/is_callable.js",
                    "src/modules/variable/is_float.js",
                    "src/modules/variable/is_null.js",
                    "src/modules/variable/is_string.js",
                    "src/modules/variable/isset.js",
                    "src/modules/variable/print_r.js",
                    "src/modules/variable/serialize.js",
                    "src/modules/variable/unserialize.js",
                    "src/modules/variable/unset.js",
                    "src/modules/variable/var_dump.js",
                    "src/modules/variable/var_export.js",
                    "src/parser/lexer.js",
                    "src/parser/parser.js",
                    "src/parser/yyn.js",
                    "src/parser/yyn_stmt.js",
                    "src/parser/yyn_expr.js",
                    "src/parser/yyn_scalar.js",
                    "src/parser/ini.js",
                    "src/parser/rawpost.js",
                    "src/vm/vm.js",
                    "src/vm/class.js",
                    "src/vm/variable.js",
                    "src/vm/array.js",
                    "src/vm/resource.js",
                    "src/vm/constants.js",
                    "src/predefined/classes/DateTime.js",
                    "src/predefined/classes/Exception.js",
                    "src/predefined/classes/ReflectionClass.js",
                    "src/predefined/classes/ReflectionException.js",
                    "src/predefined/classes/ReflectionMethod.js",
                    "src/predefined/classes/ReflectionProperty.js",
                    "src/predefined/classes/__PHP_Incomplete_Class.js",
                    "src/predefined/classes/stdClass.js",
                    "src/predefined/interfaces/Traversable.js",
                    "src/predefined/interfaces/ArrayAccess.js",
                    "src/predefined/interfaces/Iterator.js",
                    "src/predefined/interfaces/IteratorAggregate.js",
                    "src/predefined/interfaces/Reflector.js",
                    "src/predefined/interfaces/Serializable.js",
                    "adapters/filesystem/xhr.js",
                    "cfg/locales.js"
                ],
                dest: 'dist/<%= pkg.name %>'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/php.min.js'
            }
        },
        express: {
            test: {
                options: {
                    script: __dirname + "/tests/test_server.js"
                }
            }
        },
        mocha: {
            desc: [__dirname + '/tests/results'],
            options: {
                run: false,
                urls: ['http://localhost:3000/index.html'],
                timeout: 10000
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha');

    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('test', ['express', 'mocha']);

    grunt.registerTask('default', ['build', 'test']);

};
