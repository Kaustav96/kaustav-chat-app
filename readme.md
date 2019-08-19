"test": "echo \"Error: no test specified\" && exit 1"

  // socket.emit('countUpdated', count);
    // socket.on('increment',()=>{
    //     count++;
    //     //socket.emit('countUpdated', count);
    //     io.emit('countUpdated', count);
    // });


    // socket.on('countUpdated',(count)=>{
//     console.log('The count has been updated - ' + count);
// });

// document.querySelector('#increment').addEventListener('click',()=>{
//     socket.emit('increment');
// })

index.html

<div class="chat">
        <div class="chat_sidebar">

        </div>
        <div class="chat__main">
            <div id="messages" class="chat__messages"></div>
            <div class="compose">
                <form id="message-form">
                    <input type="text" placeholder="Enter Message" name="msg">
                    <button id="send">Send</button>
                </form>

                <button id="location">Share Location</button>
            </div>
        </div>
    </div>
    <!-- <h1>Chat APP</h1> -->

    <script id="message-template" type="text/html">
            <div class="message">
                <p>
                    <span class="message__name">Some user name</span>
                    <span class="message__meta">{{createdAt}}</span>
                </p>
                <p>{{message}}</p>
            </div>
        </script>
    <script id="location-template" type="text/html">
            <div class="message">
                <p>
                    <span class="message__name">Some user name</span>
                    <span class="message__meta">{{createdAt}}</span>
                </p>
                <p>Current Location - <a href="{{url}}" target="_blank">{{url}}</a></p>
            </div>
        </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.1/mustache.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.7.0/qs.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="js/chat.js"></script>