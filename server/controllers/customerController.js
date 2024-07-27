const Customer = require('../models/Customer');
const mongoose = require('mongoose');



const express = require('express');
const router = express.Router();


/**
 * GET/
 * HomePage
 */
exports.homePage = async (req, res) => {
    const messages = await req.flash('info');
    const locals = {
        title: 'Nodejs',
        description: 'Free Nodejs User Management System'
    }
    let perPage = 5;
    let page = req.query.page || 1;

    try{
        const customers =  await Customer.aggregate([{ $sort:{updatedAt: -1}}])
        .skip(perPage*page - perPage)
        .limit(perPage)
        .exec();
    const count = await  Customer.countDocuments({});

    res.render('index',{
        locals,
        customers,
        current:page,
        pages: Math.ceil(count/perPage),
        messages
    })

    }catch(err)
    {
        console.log(err);
    } 
}




/**
 * GET/
 * AboutPage
 */
exports.aboutPage = async (req, res) => {
   
    const locals = {
        title: 'About',
        description: 'Free Nodejs User Management System'
    }
    try{
        res.render('about',{locals});
    }catch(err)
    {
        console.log(err);
    }
}


/**
 * GET/
 * New Customer Form
 */

exports.addCustomer = async (req, res) => {
    const locals = {
        title: 'Add new customer - Nodejs',
        description: 'Free Nodejs User Management System'
    }
    res.render('customer/add', locals);
}




/**
 * POST/
 * create New Customer Form
 */

exports.postCustomer = async (req, res) => {
    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email
    })
    try {

        await Customer.create(newCustomer);
        await req.flash('info','New cusstomer has been addded.');
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }

} 



/** GET/
 *  Get customer data
 */

exports.viewCustomer = async(req,res)=>{
    try{

        const customer = await Customer.findOne({_id:req.params.id})
        const locals = {
            title: 'View Customer Data',
            description: 'Free Nodejs User Management System'
        }

        res.render('customer/view',{
            locals,
            customer
        })
    }
    catch(err)
    {
        console.log(err);
    }
}





/** GET/
 *  Edit customer data
 */

exports.editCustomer = async(req,res)=>{
    try{

        const customer = await Customer.findOne({_id:req.params.id})
        const locals = {
            title: 'Edit Customer Data',
            description: 'Free Nodejs User Management System'
        }

        res.render('customer/edit',{
            locals,
            customer
        })
    }
    catch(err)
    {
        console.log(err);
    }
}





/** PUT/
 *  Update customer data
 */

exports.editPost = async(req,res)=>{
    try{

      await Customer.findByIdAndUpdate(req.params.id,{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
            updatedAt: Date.now()
      })
      res.redirect(`/edit/${req.params.id}`)

    }
    catch(err)
    {
        console.log(err);
    }
}





/** DELETE/
 *  Delete customer data
 */

exports.deleteCustomer = async(req,res)=>{
  

    try{

      await Customer.deleteOne({_id: req.params.id});
      res.redirect('/');
    }
    catch(err)
    {
        console.log(err);
    }
}


/** GET/
 *  Search customer data
*/

exports.searchCustomers = async(req,res)=>{

    const locals = {
        title: 'Search Customer Data',
        description: 'Free Nodejs User Management System'
    }

    try{
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");

    const customers = await Customer.find({
        $or: [
            { firstName: { $regex: new RegExp(searchNoSpecialChar, "i")}},
            { lastName: { $regex: new RegExp(searchNoSpecialChar, "i")}},
        ]
    });
        res.render('search',{
            customers,
            locals
        })
    }
    catch(err)
    {
        console.log(err);
    }
}
