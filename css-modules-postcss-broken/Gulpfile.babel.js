import gulp               from 'gulp';
import postcss            from 'gulp-postcss';
import modules            from 'postcss-modules';
import autoprefixer       from 'autoprefixer';
import ejs                from 'gulp-ejs';
import path               from 'path';
import fs                 from 'fs';
import concatCss          from 'gulp-concat-css';
import webpack            from 'gulp-webpack';
import ExtractTextPlugin  from 'extract-text-webpack-plugin';


function getJSONFromCssModules(cssFileName, json) {
  const cssName       = path.basename(cssFileName, '.css');
  const jsonFileName  = path.resolve('./', `${ cssName }.json`);
  fs.writeFileSync(jsonFileName, JSON.stringify(json));
}

function getClass(module, className) {
  const moduleFileName  = path.resolve('./', `${ module }.json`);
  const classNames      = fs.readFileSync(moduleFileName).toString();
  return JSON.parse(classNames)[className];
}

gulp.task('css', () => {
  return gulp.src('./css/*.css')
    .pipe(postcss([
      autoprefixer,
      modules({ getJSON: getJSONFromCssModules }),
    ]))
    .pipe(concatCss('styles.css'))
    .pipe(gulp.dest('./'));
});

gulp.task('js', () => {
	return gulp.src('./js/main.js')
	  .pipe(webpack({
	      entry: {
	        main: './js/main.js',
	      },
	      module: {
	      	loaders: [
	      		{
	      		  test: /\.css/,
	      		  loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'),
	      		}
	      	],
	      },
	      output: {
	        filename: 'main.js',
	      },
	    }))
	  .pipe(gulp.dest('./'));

});

gulp.task('html', ['css'], () => {
  return gulp.src('./html/index.ejs')
    .pipe(ejs({ className: getClass }, { ext: '.html' }))
    .pipe(gulp.dest('./'));
});


gulp.task('default', ['html', 'js']);
