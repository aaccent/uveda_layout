import pkg from "gulp-pug"
import { nunjucksCompile }  from "gulp-nunjucks"
import gulpWebpHtmlNosvg from "gulp-webp-html-nosvg"

const { pug: pugCompile } = pkg;

const pug = () => {
    return app.gulp.src(app.path.src.pug)
        .pipe(app.plugins.plumber(app.plugins.notify.onError({
            title: "PUG",
            message: "Error: <%= error.message %>"
        })))
        .pipe(pugCompile({
            pretty: true,
            verbose: true
        }))
        .pipe(gulpWebpHtmlNosvg())
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browserSync.stream())
}

const njk = () => {
    return app.gulp.src(app.path.src.njk)
        .pipe(app.plugins.plumber(app.plugins.notify.onError({
            title: "NJK",
            message: "Error: <%= error.message %>"
        })))
        .pipe(nunjucksCompile())
        .pipe(gulpWebpHtmlNosvg())
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browserSync.stream())
}

// import fileInclude from "gulp-file-include"
// const htmlInclude = () => {
//     return app.gulp.src(app.path.src(app.path.src.html))
//         .pipe(fileInclude({
//             prefix: "@",
//             basepath: "@file"
//         }))
// .pipe(typograf({
//     locale: ["ru", "en-US"]
// }))
//         .pipe(webphtml())
//         .pipe(app.gulp.dest(app.path.build.html))
//         .pipe(app.plugins.browserSync.stream())
// }

export { pug, njk }