const express = require('express')
const router = express()
const Product = require('../model/product')
const Category = require('../model/category')
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

// router.get('/', async (req , res) =>{
//     try {
//         let getProduct = await Product.find().populate('category')
//         res.status(200).json(getProduct)
//     } catch (error) {
//         res.status(404).json({message:error.message})
//     }
// })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage })

router.get('/', async (req , res) =>{
    try {
        let filter = {}
        if(req.query.categories){
          filter = {category:req.query.categories.split(',')}
        }
        let getProduct = await Product.find(filter).populate('category')
        res.status(200).json(getProduct)
    } catch (error) {
        res.status(404).json({message:error.message})
    }
})


router.post('/', uploadOptions.single('image') , async (req, res) =>{
    try {
      const { name, description, richDescription, brand,category: categoryId , price, countInStock, rating, numReviews, isFeatured } = req.body;
      let category = await Category.findById(categoryId);

      if(!category) return res.status(400).send('Invalid Category')
      
      const file = req.file;
      if(!file) return res.status(400).json({message : 'No image in the request'})

      const fileName = file.filename
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
      

      let createProduct =  new Product(
          { name, description, richDescription, image : `${basePath}${fileName}`, brand, price, category: categoryId , countInStock, rating, numReviews, isFeatured }
        )
        await createProduct.save()
        if(!createProduct){
            return res.status(400).send('Product cannot be created')
        }
        return res.status(201).json({message:createProduct})
    } catch (error) {
        return res.status(404).json({message:error.message})
    }
})

router.put('/:id' , async (req ,res) => {
  try {
    const { name, description, richDescription, image, brand,category: categoryId , price, countInStock, rating, numReviews, isFeatured } = req.body;
      let category = await Category.findById(categoryId);
      if(!category) return res.status(400).send('Invalid Category')

      let updateProduct =  await Product.findByIdAndUpdate(
           req.params.id ,
          { name, description, richDescription, image, brand, price, category: categoryId , countInStock, rating, numReviews, isFeatured },
          {new:true}
        )
        if(!updateProduct){
            return res.status(400).send('Product update a successfully ')
        }
        return res.status(200).json(updateProduct)
  } catch (error) {
    return res.status(404).json({message:error.message})
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully'});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/get/count' , async (req , res) => {
  try {
    const productCount = await Product.countDocuments()

    return res.status(200).json({productCount:productCount});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

router.get('/get/featured' , async (req , res) => {
  try {
    const productCount = await Product.find({isFeatured:true})

    return res.status(200).json(productCount);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

router.put('/gallery-images/:id', 
    uploadOptions.array('images', 10), 
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
         }
         const files = req.files
         let imagesPaths = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesPaths.push(`${basePath}${file.filename}`);
            })
         }

         const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true}
        )

        if(!product)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(product);
    }
)

module.exports = router