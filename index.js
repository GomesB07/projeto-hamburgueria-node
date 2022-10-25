const { request } = require('express')
const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())


const orders = []
const status = "Em Preparação"
const status2 = "Pedido Pronto"

const checkOrderId = (request, response, next) => {
    const {id} = request.params
    const index = orders.findIndex(order => order.id === id)
    if(index < 0){
        response.status(404).json({error: "Order not found"})
    }
    request.orderIndex = index
    request.orderId = id
    next()
}
const checkUrl = (request, response, next) => {
    const method = request.method
    const url = request.url
    console.log(`O método chamado é ${method}, e a url é http://localhost:3000${url}`)
    next()
}
app.get('/order', checkUrl, (request, response) => {
    return response.json(orders)
})
app.post('/order', checkUrl, (request, response) => {
    const {order, name, value} = request.body
    const pedido = {id: uuid.v4(), order, name, value, status: status}
    orders.push(pedido)
    return response.status(201).json(pedido)
})
app.put('/order/:id', checkUrl, checkOrderId, (request, response) => {
    const {order, name, value} = request.body
    const index = request.orderIndex
    const id = request.orderId
    const orderOrigin = orders[index]
    const updateOrder = {
        id: orderOrigin.id,
        order: order ? order : orderOrigin.order,
        name: name ? name : orderOrigin.name,
        value: value ? value : orderOrigin.value,
        status: status ? status : orderOrigin.status
    }
    orders[index] = updateOrder
    
    return response.status(200).json(updateOrder)    
})
app.patch('/order/:id', checkUrl, checkOrderId, (request, response) => {
    const {order, name, value} = request.body
    const index = request.orderIndex
    const id = request.orderId
    const orderOrigin = orders[index]

    const updateStatus = {
        id: orderOrigin.id,
        order: order ? order : orderOrigin.order,
        name: name ? name : orderOrigin.name,
        value: value ? value : orderOrigin.value,
        status: status ? status2 : orderOrigin.status
    }
    orders[index] = updateStatus
    return response.json(updateStatus)

})
app.delete('/order/:id', checkUrl, checkOrderId, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)
    return response.status(204).json()

})
app.listen(port, () =>{
    console.log(`🚀 Server Funcionando! port${port}`)
})