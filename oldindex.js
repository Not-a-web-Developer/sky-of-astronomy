var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');
// const md2mc = require('markdown-to-mailchimp');
// const marked =require('marked');
const mjml2html = require('mjml');

var Mustache = require('mustache');

// Return only base file name without dir
function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    // use underscore for max()
    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
    });
}

var flnm = getMostRecentFileName('./input-articles/');

/* var inpost = fs.readFileSync(`./input-articles/${flnm}`, 'utf-8');

console.log(inpost); */
/* 
const options = {
    // Mandatory
    markdown: `./input-articles/${flnm}`,
    template: './templates/default.mjml',
    output: './nls/'
}

md2mc(options); 

var inphtml = marked.parse(inpost);
console.log(inphtml);
*/

var mammoth = require("mammoth");

mammoth.convertToHtml({path: `./input-articles/${flnm}`})
    .then(function(result){
        var inphtml = result.value; // The generated HTML
        fs.writeFileSync('mammothout.html', inphtml);
        var messages = result.messages; // Any messages, such as warnings during conversion
        // console.log(inphtml);
        var contentlol = {
            content: inphtml 
        };
        
        var tmplt = fs.readFileSync('./templates/content-empty.mjml', 'utf-8');
        
        // console.log(tmplt);
        
        var outmjml = Mustache.render(tmplt, contentlol);
        fs.writeFileSync('./templates/content.mjml', outmjml)

        var outfinal = mjml2html('./templates/default.mjml').html;
        
        console.log(outfinal)
        fs.writeFileSync('testlol.html', outfinal);
    })
    .done();


