const express = require('express')
const router = express()
const Category = require('../model/category')
const {adminAuth} = require('../config/utils')

router.get('/', async (req , res) =>{
    try {
        let getCategory = await Category.find()

        if (!getCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(getCategory)
    } catch (error) {
        res.status(404).json({message:error.message})
    }
})

router.get('/:id' , async (req , res) => {
    try {
        
        let id = req.params.id
        let getByid = await Category.findById(id)
        if(!getByid){
            return res.status(400).send('Category id is not found')
        }
        return res.status(201).json({message:getByid})
    } catch (error) {
        return res.status(404).json({message:error.message})
    }
})

router.post('/',adminAuth , async (req, res) =>{
    try {
        let {name,color,icon} = req.body
        let createCategory = Category({name,color,icon})
        await createCategory.save()
        if(!createCategory){
            return res.status(400).send('Category cannot be created')
        }
        return res.status(201).json({message:createCategory})
    } catch (error) {
        return res.status(404).json({message:error.message})
    }
})

router.put('/:id' ,async (req , res) => {
    try {
        let updateCategory = await Category.findByIdAndUpdate(
            req.params.id , 
            {
                name:req.body.name,
                color:req.body.color,
                icon:req.body.icon
            },
            {new:true}
        )
        if(!updateCategory){
            return res.status(400).send('Category cannot be created')
        }
        return res.status(200).json(updateCategory)

    } catch (error) {
        return res.status(404).json({message:error.message})
    }
})
router.delete('/:id',adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully'});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router
