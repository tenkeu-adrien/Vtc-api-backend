import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  console.log("socket connect" ,socket.id)
  socket.emit('news', { hello: 'world' })

  socket.on('my other event', (data) => {
    console.log(data)
  })
})
