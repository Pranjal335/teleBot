const express=require('express');
const router=express.Router();
const Post=require('../models/Post');
const User=require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout= '../views/layouts/admin';
const jwtSecret= process.env.JWT_SECRET;

/**
 * 
 * Check Login
*/

const authMiddleware= (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error){
        res.status(401).json({message:'Unauthorized'});
    }
}


//Admin Login Page

router.get('/admin',async (req,res)=>{
    try{ 
     const locals ={
         title: "Admin",
         description: "Simple Blog site."
        }
     res.render('admin/index',{locals, layout: adminLayout});
    }catch(error){
     console.log(error);
    }
 });
 
 //Admin Login Check


router.post('/admin',async (req,res)=>{

    try{ 

        const {username, password}=req.body;

        const user= await User.findOne({username});

        if(!user){
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        const isPasswordValid= await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');

    }catch(error){
     console.log(error);
    }
 });


 /**
 * GET /
 * Admin Dashboard
*/
 router.get('/dashboard',authMiddleware, async(req,res)=>{
    try{
        const locals ={
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        const data= await Post.find();
        res.render('admin/dashboard',{
            locals,
            data,
            layout: adminLayout
        });
    }
    catch(error){
        console.log(error);
    }
 });

 /**
 * GET /
 * Admin - Create New Post
*/

router.get('/add-post',authMiddleware, async(req,res)=>{
    try{
        const locals={
            title:'Add Post',
            description:'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        const data = await Post.find();
        res.render('admin/add-post',{
            locals,
            layout: adminLayout
        });
    } catch(error){
        console.log(error);
    }
});

/**
 * POST /
 * Admin - Create New Post
*/

router.post('/add-post',authMiddleware, async(req,res)=>{
     
})





module.exports= router;