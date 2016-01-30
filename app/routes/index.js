'use strict';
var Imgur = require('imgur-search');
var Images = require('../models/Images');


module.exports = function (app) {
    app.route('/api/imagesearch/:input')
        .get( function (req, res) {

            // save input on database
            var input = {
                term : req.params.input,
                when : new Date()
            };

            var offset= req.query.offset || 0;

            Images.create(input, function(err, Image) {
                if(err) { return handleError(res, err); }

                // once saved, call imgur api and send to client the result
                //https://api.imgur.com/endpoints/gallery#gallery-search
                var images = new Imgur('4fb9f0926b919c7');
                ///Imgur.prototype.search = function (query, sort, page) 
                console.log("Image>>",JSON.stringify(Image));
                console.log("input>>",JSON.stringify(input));

                images.search(input.term, 'top', offset)
                    .done(function(data){
                        return res.status(201).json(data); 
                    })
                    .fail(function(error){
                        return handleError(res, error);
                    });
            });
        });

    app.route('/api/latest/imagesearch') // latest 10 searches
        .get( function (req, res) {
            var query = Images.find({},{_id:0, term:1, when:1}).sort({"when":-1}).limit(10);
            query.exec(function(err, results){
                if(err) { return handleError(res, err); }
                return res.json(results);
            });
            
        });
};


function handleError(res, err) {
//  console.log("error");
  return res.status(500).send(err);
}