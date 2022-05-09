const { validationResult, body } = require('express-validator');
let NeDB = require('nedb');
let db = new NeDB({
    filename: 'users.db',
    autoload:true
}); 

module.exports = (app) => {
    let route = app.route('/users');

    route.get((req, res) => {

        db.find({}).sort({name:-1}).exec((err, users) =>{
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(users);
            }
        });
    });
    
    route.post(

        body('name', 'O nome e obrigatorio').isLength({min:1}),
        body('email', 'O email e invalido').isEmail(),
        body('passw', 'A senha deve possuir no minimo 8 digitos').isLength({min: 8}),
        ((req, res) => {
            const errors  = validationResult(req);

            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()});
            }else{
                db.insert(req.body, (err, user) =>{
                    if(err){
                        app.utils.error.send(err, req, res);
                    }else{
                        res.status(200).json(user);
                    }
                });
            }
        })

    );
                                    //email
                                    //name
    let routeId = app.route('/users/:id');

    routeId.get((req, res) => {
                                 //email   
                                //name
        db.findOne({_id:req.params.id}).exec((err, user)=>{
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(user);
            }
        });
    });

    routeId.put(
        body('name', 'O nome e obrigatorio').isLength({min:1}),
        body('email', 'O email e invalido').isEmail(),
        body('passw', 'A senha deve possuir no minimo 8 digitos').isLength({min: 8}),
        ((req, res) => {
            const errors  = validationResult(req);

            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()});
            }else{
                db.update({_id:req.params.id}, req.body, err=>{
                    if(err){
                        app.utils.error.send(err, req, res);
                    }else{
                        res.status(200).json(Object.assign(req.body, req.params));
                    }
                });
            }
        }),
        
    );

    routeId.delete((req, res) => {

        db.remove({_id:req.params.id}, {}, err=>{
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(req.params);
            }
        })

    });
};