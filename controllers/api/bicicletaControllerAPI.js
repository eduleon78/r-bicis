var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function(req, res){
    Bicicleta.allBicis(function(err, bicis){
        res.status(200).json({
          bicicletas: bicis
    });
  });
};

exports.bicicleta_create = function(req, res){
    var bici = Bicicleta.createIntance(req.body.code, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng];

    Bicicleta.add(bici, function(err, newBici){
        res.status(200).json({
            bicicleta: bici,
        });
    });
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeByCode(req.body.code, function(err, Bicis){
        res.status(204).send();
    });
}