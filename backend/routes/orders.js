const express = require('express')
const router = express()
const Order = require('../model/order')
const OrderItem = require('../model/orderItem')

router.get('/' , async (req , res) =>{
    try {
        const orderList = await Order.find().populate("user" , "firstName").sort({'dateOrdered':-1})
        if(!orderList){
            res.status(400).json({message : 'not found orderlist'})
        }
        res.send(orderList)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
})

router.get('/:id' , async (req , res) =>{
    try {
        const orderList = await Order.findById(req.params.id)
        .populate("user" , "firstName")
        .populate({path:'orderItems' , populate:{path : 'product' ,populate : 'category'}})
        if(!orderList){
            res.status(400).json({message : 'not found orderlist'})
        }
        res.send(orderList)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const orderItemids = Promise.all(req.body.orderItems.map(async orderItem => {
            let newOrderItem = new OrderItem({
                quantity:orderItem.quantity ,
                product : orderItem.product
            })
            newOrderItem = await newOrderItem.save()
            return newOrderItem._id
        }))
        const orderItemIdsresovolver = await orderItemids

        let totalPrices = await Promise.all(orderItemIdsresovolver.map(async orderItemid => {
            let orderitem = await OrderItem.findById(orderItemid).populate('product' , 'price')
            let totalPrice = orderitem.product.price * orderitem.quantity
            return totalPrice

        }))
        totalPrices = totalPrices.reduce((sum,num) => sum + num , 0)

        let order = new Order(
            {
                orderItems: orderItemIdsresovolver,
                shippingAddress1: req.body.shippingAddress1,
                shippingAddress2: req.body.shippingAddress2,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                status: req.body.status,
                totalPrice: totalPrices,
                user: req.body.user,
            }
        )
        await order.save()
        if (!order) {
            return res.status(400).send('Category cannot be created')
        }
        return res.status(201).json({ message: order })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
})

router.put('/:id' ,async (req , res) => {
    try {
        let updateOrder = await Order.findByIdAndUpdate(
            req.params.id , 
            {
                status: req.body.status
            },
            {new:true}
        )
        if(!updateOrder){
            return res.status(400).send('Order cannot be updated')
        }
        return res.status(200).json(updateOrder)

    } catch (error) {
        return res.status(404).json({message:error.message})
    }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Find the order by ID first
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Delete all related orderItems
    await Promise.all(order.orderItems.map(async (orderItemId) => {
      await OrderItem.findByIdAndDelete(orderItemId);
    }));

     await Order.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Order and related items deleted successfully' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})

router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments()

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})

router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})


module.exports = router