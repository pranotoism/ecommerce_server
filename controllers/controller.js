const { User, Product } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios')

class Controller {

    static oneProduct(req, res, next) {
        const id = req.params.id
        Product.findOne({where: {id}})
        .then((product) => {
            res.status(200).json({product})
        })
        .catch(err => {
            console.log(err);
            next(err)
        })
    }

    static login(req, res, next) {
        User.findOne({where: {email: req.body.email}})
        .then( data => {
            if (!data) {
                res.status(401).json('Can not find your account')
            } else {
                // console.log(data, '<<<<<<<<<<<<<<<<<<<<');
                const access_token = jwt.sign({ id: data.id, email: data.email, role: data.role }, 'hiha');
                if(req.body.password, data.password) {
                    res.status(200).json({access_token})
                } else {
                    res.status(401).json('Can not find your account')
                }
            }
        })
        .catch(err => {
            next(err)
        })
    }
    
    static productList(req, res, next) {
        Product.findAll()
        .then( data => {
            // console.log({data});
            res.status(200).json({data})
        })
        .catch(err => {
            console.log(err);
            next(err)
        })
    }

    static addProducts(req, res, next) {
        let obj = {
            name: req.body.name,
            image_url: req.body.image_url,
            price: req.body.price,
            stock: req.body.stock,
            UserId: req.loggedInUser.id
        }

        Product.create(obj)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            // console.log(err);
            next(err)
        })
    }

    static patchProduct(req, res, next) {
        let obj = {
            stock: req.body.stock
        }
        let id = req.params.id
        Product.update(obj, {where: {id}})
        .then(data => {
            if (data != 0) {
                return Product.findOne({where: {id}})
            } else {
                res.status(401).json({msg: 'Data cant be found'})
            }
        })
        .then(result => {
            res.status(200).json({result})
        })
        .catch(err => {
            next(err)
        })
    }


    static updateProduct(req, res, next) {
        let obj = {
            name: req.body.name,
            image_url: req.body.image_url,
            stock: req.body.stock,
            price: req.body.price
        }
        let id = req.params.id
        Product.update(obj, {where: {id}})
        .then(data => {
            console.log(obj);
            if (data != 0) {
                return Product.findOne({where: {id}})
            } else {
                console.log('sinisinisinisinisini');
                res.status(401).json({msg: 'Data cant be found'})
            }
        })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            next(err)
        })
    }

    static deleteProduct(req, res, next) {
        let id = req.params.id
        Product.destroy({where: {id}})
        .then(data => {
            if (data != 0) {
                res.status(200).json({msg: 'Product has been successfully deleted'})
            } else {
                res.status(401).json({msg: 'Product cant be found'})
            }
        })
        .catch(err => {
            next(err)
        })
    }

}

module.exports = Controller