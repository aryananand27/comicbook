const express=require('express');
const app=express();
const cors=require("cors");
const jwt=require("jsonwebtoken");
const UserModel=require("./Models/User");
const BookModel=require('./Models/Book')
const {ObjectId}=require('mongodb');
require('dotenv').config();
const secretkey=process.env.JWT_SECRET_KEY;

app.use(cors());

app.use(express.json());
require("./DB/config")

app.get('/',(req,resp)=>{
    resp.status(200).send("Hello");
})

// Below Api is for A new Manager to register on the website.

app.post('/register',async(req,resp)=>{
    try{
        const {name,role,email,password}=req.body; // Required fields for registering on the website as a Manager.
        if(!name || !role || !email || !password){
            resp.status(400).send("All Field is required.");
        }
        else{
            const result=new UserModel(req.body);
           
            // Token for Authentication
            const token=jwt.sign({_id:result._id},secretkey,{expiresIn:"1h"});
            const data= await result.save();
           delete result.password;
           resp.status(200).send({data,token});
        }

    }catch(error){
        if(error.keyPattern){
            resp.status(500).send({err:"User Already Exists."})
        }
        else{
            resp.status(500).send(error);
        }
    }
})

//Below API is for acreating a new entry of Comic Book under a Manager.

app.put('/addInInventory',async(req,resp)=>{
    try{
        // ManagerId is must for adding a comic book in their Inventory.
        const {managerId,comicBooks}=req.body;

        // Relevant fields needed to make a entry in the inventory list.
        const {bookName,authorName,yearOfPublication,price,numberOfPages,condition}=comicBooks[0];
       
        if(!managerId || !bookName || !authorName || !yearOfPublication || !price || !numberOfPages || !condition){
            resp.status(400).send("Please provide all the important field.")
        }

        else{
            const manager=await BookModel.find({managerId:managerId});
            // If founded the name or managerId in the database then it will append a new comic Book data to list of array of comic books.
            if(manager.length>0){
                // Below is the logic to ennsure that duplicate data should not be inserted multiple times in the database. This will optimize the storage of database.

                let remarray=[];
                manager[0].comicBooks.forEach(element => {
                      let obj={bookName:element.bookName,authorName:element.authorName,yearOfPublication:element.yearOfPublication,price:element.price,discount:element.discount,numberOfPages:element.numberOfPages,condition:element.condition,description:element.description}
                      remarray.push(obj);
                });
                  comicBooks[0].discount=comicBooks.discount?comicBooks.discount:null;
                  comicBooks[0].condition=comicBooks.condition?comicBooks.condition:"New";
                  comicBooks[0].description=comicBooks.description?comicBooks.description:null;
                  let arrnew=comicBooks;
                  
                  arrnew=arrnew.concat(remarray);
                  
                  const sortObjectProperties = (obj) => {
                    const sortedObj = {};
                    Object.keys(obj).sort().forEach((key) => {
                      sortedObj[key] = obj[key];
                    });
                    return sortedObj;
                  };
                  const sortedBooks = arrnew.map(sortObjectProperties);
                  let sndarray=sortedBooks.filter(function(key,index){
                          return index===sortedBooks.findIndex(function(obj){
                              return JSON.stringify(key)===JSON.stringify(obj);
                          })
                      })
                      
                     console.log(sndarray);
                  req.body.comicBooks=sndarray;

                      // Updating the existing list by appending the new one.
                const updresult= await BookModel.updateOne({managerId:managerId},{$set:req.body});
                if(updresult.acknowledged){
                    resp.status(200).send({message:"Successfully added a Comic Book in the inventory",updresult});
                }
            }
            else{
                // If ManagerId is not found in the database then a new entry will be made corressponding to manager.
                const result=new BookModel(req.body);
                const data=await result.save();
                
                resp.status(200).send({message:"Successfully added a Comic Book in the inventory",data});
            }
        }
    }catch(err){
        resp.status(500).send({message:"Error occured while adding to the comic inventory".err})
    }
})

// Below API is for updating the existing Comic Book available under a Manager in the Inventory.

app.put('/updateAComicBook/:managerId/:BookId',async(req,resp)=>{
    try{
        const { managerId, BookId } = req.params;
        if(!managerId || !BookId){
            resp.status(400).send({message:"Please Specify which Comic Book Has To be Updated."})
        }
        else{

        // This will update the Comic Book with given BookId in the database.
            const Book = await BookModel.findOneAndUpdate(
                { managerId, 'comicBooks._id': new ObjectId(BookId) },
                { $set: { 'comicBooks.$': req.body } },
                { new: true }
            );
            if(Book){
                resp.status(200).send({message:"Successfully Updated the specified Comic Book.",Book})
            }
            else{
                resp.status(404).send({message:"Error in finding particular Comic Book."})
            }
        }
    }catch(err){
        resp.status(500).send({message:"Error occured while Editing A Comic Book",err})
    }
})

// Below API is for deleting the existing Comic Book available under a Manager in the Inventory.

app.delete("/removeAComicBook/:managerId/:BookId", async(req,resp)=>{
    try{
        const{managerId,BookId}=req.params;
        if(!managerId || !BookId){
            resp.status(400).send({message:"Please Specify which Comic Book has To be Deleted."})
        }
        else{
             // This will delete the Comic Book with given BookId in the database.
            const deletedbook = await BookModel.updateOne({managerId:managerId},{$pull:{comicBooks:{_id:new ObjectId(BookId)}}});
            if(deletedbook){
                resp.status(200).send({message:"Successfully Deleted the Specified Comic Book.",deletedbook});
            }
            else{
                resp.status(404).send({message:"Error in finding particular Comic Book."})
            }
        }

    }
    catch(err){
        resp.status(500).send({message:"Error Occured while Deleting A Comic Book", err});
    }
})

// Below API is fetching Details of a Comic Book listed in the ManagerID.

app.get('/getDetailsOfOneComicBook/:managerId/:BookId',async(req,resp)=>{
    try{
        const{managerId,BookId}=req.params;
        if(!managerId || !BookId){
            resp.status(400).send({message:"Please Specify which Comic Book Details You want to fetch."})
        }
        else{
            const details=await BookModel.findOne({managerId,'comicBooks._id':new ObjectId(BookId)});
            if(details){
                resp.status(200).send({message:"Data For A particular Specified BookId is Here...",details});
            }
            else{
                resp.status(404).send({message:"Error in finding details of a particular Comic Book."})
            }

        }
    }
    catch(err){
        resp.status(500).send({message:"Error Occured while Fetching Data for a particular Comic Book"});
    }
})

// Below Api is for fetching All the comic books list available in the managerId ensuring pagination, sorting and filtering of Fetched data.

app.get('/getAllComicBooks/:managerId',async(req,resp)=>{
    try{
        const managerId=req.params.managerId;
        if(!managerId){
            resp.status(400).send({message:"Please Specify Correct Details Of Manager for fetching data."})
        }
        else{
            let result=await BookModel.find({managerId:managerId});
            if(result){
                const pageNumber=req.query.pageNumber || 1;
                const limit= req.query.limit || 5;
                const sortBy=req.query.sortBy || 'bookName';
                const order=req.query.order==='desc'?-1:1;
                let comicBooks=result[0].comicBooks;
               
                // Code for filtering on the basis of query available 
                const {authorName,yearOfPublication,condition}=req.query;// Fields on which filtering will be applied 
               
                if(authorName){
                    // If available then only filtering will be done.
                    comicBooks=comicBooks.filter(items=>
                        items.authorName.toLowerCase().includes(authorName.toLowerCase())
                    )
                }
                if (yearOfPublication) {
                     // If available then only filtering will be done.
                    comicBooks = comicBooks.filter(comic =>
                      comic.yearOfPublication === yearOfPublication
                    );
                  }
              
                  if (condition) {
                     // If available then only filtering will be done.
                    comicBooks = comicBooks.filter(comic =>
                      comic.condition.toLowerCase() === condition.toLowerCase()
                    );
                  }
                 
                  // Sorting the filtered data on the basis of order and field.
                  const sortedComicBooks = comicBooks.sort((a, b) => {
                    if (typeof a[sortBy] === 'string') {
                      return a[sortBy].localeCompare(b[sortBy]) * order;
                    } else if (typeof a[sortBy] === 'number') {
                      return (a[sortBy] - b[sortBy]) * order;
                    } else {
                      return 0;
                    }
                  });
                
                 
                  const totalItems = sortedComicBooks.length;
                  const startIndex = (pageNumber - 1) * limit;
               
                  // Paginating the sorted data.
                  const paginatedComicBooks = sortedComicBooks.slice(startIndex, startIndex + limit);
                  console.log(paginatedComicBooks);
                  resp.status(200).send({message:"Successfully Fetched list of Comic Books under specified ManagerId",
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: pageNumber,
                    comicBooks: paginatedComicBooks
                  });

            }
            else{
                resp.status(404).send({message:"Enable to find list of Comic Books under a provided ManagerId"})
            }
        }

    }catch(err){
        resp.status(500).send({message:"Error Occured while Fetching Data for all the Comic Books listed under a ManagerId"});
    }
})

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})

app.listen(7000,()=>{
    console.log("Listening on port 7000");
})